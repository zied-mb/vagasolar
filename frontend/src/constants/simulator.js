/**
 * Simulator constants: STEG tariff tranches + CO2 emission factor.
 */

// CO2 emission factor for Tunisia grid electricity (kg CO2 per kWh)
export const CO2_EMISSION_FACTOR = 0.56;

// Surtaxes (Municipal + Energy Transition Fund) per kWh BEFORE TVA
export const SURTAXES_PER_KWH = 0.010;

// TVA Constants
export const TVA_RESIDENTIAL_LOW = 0.07;  // <= 300 kWh
export const TVA_RESIDENTIAL_HIGH = 0.13; // > 300 kWh
export const TVA_PROFESSIONAL = 0.19;

// Fixed monthly fees (Redevance Fixe)
export const REDEVANCE_FIXE = {
  residential: 3.5, // 0.700 DT * 5 kVA
  professional: 15.0,
  agricultural: 15.0,
};

// Panel and System Constants
export const PANEL_WATTAGE = 450; // Watts per panel
export const SYSTEM_PRICE_PER_KWP = 3500; // DT per kWp
export const PRODUCTION_PER_KWP = 1500; // kWh produced per kWp annually

export const BUILDING_TYPE_LABELS = {
  residential:  'Résidentiel',
  professional: 'Professionnel',
  agricultural: 'Agricole',
};
