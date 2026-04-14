import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

// ─── Hardcoded fallback (if API is unreachable) ───────────────────────────────
const FALLBACK_RATES = {
  residentialTranches: [
    { limit: 50,   rate: 0.062 },
    { limit: 100,  rate: 0.096 },
    { limit: 200,  rate: 0.176 },
    { limit: 300,  rate: 0.218 },
    { limit: 500,  rate: 0.341 },
    { limit: 9999, rate: 0.414 },
  ],
  flatRateProfessional: 0.380,
  surtaxesPerKwh:       0.010,
  tvaResidentialLow:    0.07,
  tvaResidentialHigh:   0.13,
  tvaProfessional:      0.19,
  redevanceFixeResidential:  3.5,
  redevanceFixeProfessional: 15.0,
  redevanceFixeAgricultural: 15.0,
  panelWattage:      450,
  systemPricePerKwp: 3500,
  productionPerKwp:  1500,
  co2EmissionFactor: 0.56,
};

const INITIAL_RESULTAT = {
  billBefore: null,
  billAfter:  null,
  savings:    { monthly: 0, trimestriel: 0, annual: 0 },
  systemSize: { kWp: 0, panels: 0, cost: 0 },
  payback: 0,
  co2: 0,
  productionSolaireAnnuelle: 0,
};

// ─── Live STEG billing calculation (uses dynamic rates from API) ──────────────
const calculateEnergyCost = (conso, typeBatiment, rates) => {
  if (typeBatiment === 'professional' || typeBatiment === 'agricultural') {
    return conso * (rates.flatRateProfessional || 0.380);
  }
  // Residential: entire consumption at the rate of the reached tier
  const tranches = rates.residentialTranches || FALLBACK_RATES.residentialTranches;
  for (const t of tranches) {
    if (conso <= t.limit) return conso * t.rate;
  }
  return conso * tranches[tranches.length - 1].rate;
};

const calculateMonthlyBill = (consoBase, coefCouverture, typeBatiment, rates) => {
  const consoAfterSolar = Math.max(consoBase * (1 - coefCouverture), 0);
  const energyCost      = calculateEnergyCost(consoAfterSolar, typeBatiment, rates);
  const surtaxes        = consoAfterSolar * (rates.surtaxesPerKwh || 0.010);
  const energyBaseForTVA = energyCost + surtaxes;

  let tvaEnergyPct = 0;
  let tvaFixedPct  = 0;

  if (typeBatiment === 'residential') {
    tvaEnergyPct = consoAfterSolar <= 300
      ? (rates.tvaResidentialLow  || 0.07)
      : (rates.tvaResidentialHigh || 0.13);
    tvaFixedPct = 0;
  } else {
    tvaEnergyPct = rates.tvaProfessional || 0.19;
    tvaFixedPct  = rates.tvaProfessional || 0.19;
  }

  const tvaEnergy = energyBaseForTVA * tvaEnergyPct;

  const fixedFees = {
    residential:  rates.redevanceFixeResidential  || 3.5,
    professional: rates.redevanceFixeProfessional || 15.0,
    agricultural: rates.redevanceFixeAgricultural || 15.0,
  };
  const fixedFee = fixedFees[typeBatiment] || 3.5;
  const tvaFixed = fixedFee * tvaFixedPct;

  return {
    energy: energyCost, surtaxes, tvaEnergy, fixedFee, tvaFixed,
    total: energyCost + surtaxes + tvaEnergy + fixedFee + tvaFixed,
  };
};

export const useSimulator = () => {
  // ── Live rates from API ────────────────────────────────────────────────────
  const [rates,      setRates]      = useState(FALLBACK_RATES);
  const [ratesReady, setRatesReady] = useState(false);

  // ── Simulator form state ───────────────────────────────────────────────────
  const [typeBatiment, setTypeBatiment] = useState('residential');
  const [consommation, setConsommation] = useState('');
  const [couverture,   setCouverture]   = useState(30);
  const [currentStep,  setCurrentStep]  = useState(1);
  const [viewAnnual,   setViewAnnual]   = useState(false);
  const [resultat,     setResultat]     = useState(INITIAL_RESULTAT);

  // ── Flow state machine: 'form' → 'lead' → 'dashboard' ─────────────────────
  const [flowStep, setFlowStep] = useState('form'); // 'form' | 'lead' | 'dashboard'
  const [leadId,   setLeadId]   = useState(null);

  // ─── Fetch live STEG rates on mount ─────────────────────────────────────────
  useEffect(() => {
    dataService.getStegRates()
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {})
      .finally(() => setRatesReady(true));
  }, []);

  // ── Run calculations (called at end of Step 3) ─────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const conso = parseFloat(consommation);
    if (isNaN(conso) || conso <= 0) return;

    const PANEL_WP   = rates.panelWattage      || 450;
    const PRICE_KWP  = rates.systemPricePerKwp || 3500;
    const PROD_KWP   = rates.productionPerKwp  || 1500;
    const CO2_FACTOR = rates.co2EmissionFactor || 0.56;

    // Bill BEFORE Solar
    const billBeforeMonth = calculateMonthlyBill(conso, 0, typeBatiment, rates);

    // Solar Sizing
    const coefCouverture   = couverture / 100;
    const targetAnnualProd = conso * 12 * coefCouverture;
    const neededKWp        = targetAnnualProd / PROD_KWP;
    const panelsCount      = Math.ceil(neededKWp / (PANEL_WP / 1000));
    const actualKWp        = panelsCount * (PANEL_WP / 1000);
    const actualAnnualProd = actualKWp * PROD_KWP;
    const systemCost       = actualKWp * PRICE_KWP;

    // Bill AFTER Solar
    let consoNetMonthly     = conso - (actualAnnualProd / 12);
    let creditMonetary      = 0;
    if (consoNetMonthly < 0) {
      creditMonetary  = Math.abs(consoNetMonthly) * 0.200;
      consoNetMonthly = 0;
    }

    let billAfterMonth;
    if (consoNetMonthly === 0) {
      const fixedFee = rates[`redevanceFixe${typeBatiment.charAt(0).toUpperCase() + typeBatiment.slice(1)}`] || 3.5;
      const tvaFixed = fixedFee * (typeBatiment === 'residential' ? 0 : (rates.tvaProfessional || 0.19));
      billAfterMonth = { energy: 0, surtaxes: 0, tvaEnergy: 0, fixedFee, tvaFixed, total: fixedFee + tvaFixed };
    } else {
      billAfterMonth = calculateMonthlyBill(consoNetMonthly, 0, typeBatiment, rates);
    }

    const monthlySavings = (billBeforeMonth.total - billAfterMonth.total) + creditMonetary;
    const annualSavings  = monthlySavings * 12;
    const payback        = systemCost / annualSavings;
    const co2            = (actualAnnualProd * CO2_FACTOR) / 1000;

    const newResultat = {
      billBefore: billBeforeMonth,
      billAfter:  billAfterMonth,
      // Shared totals for easy visualization
      totals: {
        quarterly: {
          before: billBeforeMonth.total * 3,
          after:  billAfterMonth.total * 3,
          savings: monthlySavings * 3
        },
        annual: {
          before: billBeforeMonth.total * 12,
          after:  billAfterMonth.total * 12,
          savings: monthlySavings * 12
        }
      },
      savings:    { monthly: monthlySavings, trimestriel: monthlySavings * 3, annual: annualSavings },
      systemSize: { kWp: actualKWp.toFixed(2), panels: panelsCount, cost: systemCost },
      payback:    payback.toFixed(1),
      co2:        co2.toFixed(2),
      productionSolaireAnnuelle: actualAnnualProd.toFixed(0),
    };

    setResultat(newResultat);
    setViewAnnual(false);
    // ✨ Transition to Lead Capture Gate — NOT directly to dashboard
    setFlowStep('lead');
  };

  const handleReset = () => {
    setTypeBatiment('residential');
    setConsommation('');
    setCouverture(30);
    setCurrentStep(1);
    setViewAnnual(false);
    setFlowStep('form');
    setLeadId(null);
    setResultat(INITIAL_RESULTAT);
  };

  const nextStep = () => { if (currentStep < 3) setCurrentStep((s) => s + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); };

  return {
    // Form state
    typeBatiment, setTypeBatiment,
    consommation, setConsommation,
    couverture,   setCouverture,
    currentStep,
    viewAnnual,   setViewAnnual,
    resultat,
    // Flow control (replaces old `submitted`)
    flowStep, setFlowStep,
    leadId,   setLeadId,
    // Actions
    handleSubmit,
    handleReset,
    nextStep,
    prevStep,
    ratesReady,
  };
};
