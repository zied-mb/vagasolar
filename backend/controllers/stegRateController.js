const StegRate = require('../models/StegRate');

// ─── Default seed data (mirrors constants/simulator.js) ───────────────────────
const DEFAULT_RATES = {
  residentialTranches: [
    { limit: 50,   rate: 0.062 },
    { limit: 100,  rate: 0.096 },
    { limit: 200,  rate: 0.176 },
    { limit: 300,  rate: 0.218 },
    { limit: 500,  rate: 0.341 },
    { limit: 9999, rate: 0.414 },
  ],
  flatRateProfessional: 0.380,
  flatRateAgricultural: 0.380,
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

// ─── GET /api/steg-rates  (PUBLIC) ───────────────────────────────────────────
exports.getRates = async (req, res) => {
  try {
    let rates = await StegRate.findOne();
    // Auto-seed on first call if collection is empty
    if (!rates) {
      rates = await StegRate.create(DEFAULT_RATES);
    }
    res.status(200).json({ success: true, rates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/steg-rates  (ADMIN) ─────────────────────────────────────────────
exports.updateRates = async (req, res) => {
  try {
    let rates = await StegRate.findOne();
    if (!rates) {
      rates = await StegRate.create({ ...DEFAULT_RATES, ...req.body });
    } else {
      Object.assign(rates, req.body);
      await rates.save();
    }
    res.status(200).json({ success: true, rates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
