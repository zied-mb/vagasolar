import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiRefreshCw, FiInfo } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Field = ({ label, name, value, onChange, hint, step = '0.001' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input type="number" step={step} value={value} onChange={(e)=>onChange(name, parseFloat(e.target.value)||0)}
      className="w-full px-4 py-2.5 bg-gray-800/60 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
    />
    {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
  </div>
);

const AdminStegRates = () => {
  const [rates,   setRates]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/steg-rates`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setRates(d.rates); })
      .catch(() => setError('Erreur de chargement.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => setRates((p) => ({ ...p, [field]: value }));

  const handleTrancheChange = (i, key, val) => setRates((p) => ({
    ...p,
    residentialTranches: p.residentialTranches.map((t, idx) => idx === i ? { ...t, [key]: parseFloat(val)||0 } : t),
  }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const res  = await fetch(`${API_URL}/api/steg-rates`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRates(data.rates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"/></div>;
  if (!rates)  return <div className="text-gray-400 text-center py-16">Impossible de charger les tarifs.</div>;

  const TRANCHE_LABELS = ['≤ 50 kWh', '51–100 kWh', '101–200 kWh', '201–300 kWh', '301–500 kWh', '> 500 kWh'];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Tarifs STEG</h1>
          <p className="text-gray-400 mt-1">Les modifications sont répercutées immédiatement sur le simulateur public.</p>
        </div>
        <motion.button onClick={handleSave} disabled={saving} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all text-sm"
        >
          {saving ? <FiRefreshCw className="animate-spin" size={15}/> : <FiSave size={15}/>}
          {saved ? '✓ Sauvegardé !' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </motion.button>
      </div>

      {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      <div className="flex items-start gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm">
        <FiInfo className="shrink-0 mt-0.5" size={14}/>
        <span>Les tarifs réidentiels utilisent la logique <strong>"Toute la consommation au tarif du palier atteint"</strong> (STEG officiel).</span>
      </div>

      {/* Residential Tranches */}
      <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="font-bold text-white">Tarifs Résidentiels (Tranches)</h2>
        </div>
        <div className="p-6 space-y-3">
          {rates.residentialTranches?.map((t, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-800/40 rounded-xl px-4 py-3">
              <span className="text-gray-400 text-sm w-28 shrink-0">{TRANCHE_LABELS[i] || `Tranche ${i+1}`}</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-gray-500">Plafond</span>
                <input type="number" value={t.limit} onChange={(e)=>handleTrancheChange(i,'limit',e.target.value)}
                  className="w-24 px-3 py-1.5 bg-gray-800 border border-white/8 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400/50"
                />
                <span className="text-xs text-gray-500 ml-2">Tarif (DT/kWh)</span>
                <input type="number" step="0.001" value={t.rate} onChange={(e)=>handleTrancheChange(i,'rate',e.target.value)}
                  className="w-28 px-3 py-1.5 bg-gray-800 border border-white/8 rounded-lg text-amber-400 text-sm font-mono focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-white mb-2">Tarifs Pro / Agri</h2>
          <Field label="Tarif Professionnel (DT/kWh)" name="flatRateProfessional" value={rates.flatRateProfessional} onChange={handleChange}/>
          <Field label="Tarif Agricole (DT/kWh)"      name="flatRateAgricultural"  value={rates.flatRateAgricultural}  onChange={handleChange}/>
          <Field label="Surtaxes / kWh (DT)"          name="surtaxesPerKwh"         value={rates.surtaxesPerKwh}         onChange={handleChange}/>
        </div>
        <div className="bg-gray-900 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-white mb-2">TVA & Redevances</h2>
          <Field label="TVA Résidentiel Bas (≤300 kWh)" name="tvaResidentialLow"         value={rates.tvaResidentialLow}         onChange={handleChange}/>
          <Field label="TVA Résidentiel Haut (>300 kWh)" name="tvaResidentialHigh"       value={rates.tvaResidentialHigh}       onChange={handleChange}/>
          <Field label="TVA Professionnel"               name="tvaProfessional"          value={rates.tvaProfessional}          onChange={handleChange}/>
          <Field label="Redevance Fixe Résidentiel (DT)" name="redevanceFixeResidential" value={rates.redevanceFixeResidential} onChange={handleChange} step="0.1"/>
        </div>
        <div className="bg-gray-900 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-white mb-2">Constantes Système</h2>
          <Field label="Wattage Panneau (W)"          name="panelWattage"      value={rates.panelWattage}      onChange={handleChange} step="1"/>
          <Field label="Prix Système (DT/kWp)"        name="systemPricePerKwp" value={rates.systemPricePerKwp} onChange={handleChange} step="50"/>
          <Field label="Production (kWh/kWp/an)"      name="productionPerKwp"  value={rates.productionPerKwp}  onChange={handleChange} step="10"/>
          <Field label="Facteur CO₂ (kg/kWh)"         name="co2EmissionFactor" value={rates.co2EmissionFactor} onChange={handleChange}/>
        </div>
      </div>
    </div>
  );
};

export default AdminStegRates;
