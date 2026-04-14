const mongoose = require('mongoose');

/**
 * StegRate stores the current STEG tariff configuration.
 * There's only ever ONE document (singleton pattern).
 * The frontend simulator fetches this on every mount.
 */
const StegRateSchema = new mongoose.Schema({
  // ── Residential Tranches (Entire-consumption-at-reached-tier logic) ────────
  residentialTranches: [
    {
      limit: { type: Number, required: true }, // kWh ceiling (Infinity stored as 9999)
      rate:  { type: Number, required: true }, // DT/kWh
    }
  ],

  // ── Professional / Agricultural flat rate ────────────────────────────────
  flatRateProfessional: { type: Number, default: 0.380 },
  flatRateAgricultural: { type: Number, default: 0.380 },

  // ── Surtaxes (Municipal + Energy Transition Fund) ─────────────────────────
  surtaxesPerKwh: { type: Number, default: 0.010 },

  // ── TVA Rates ─────────────────────────────────────────────────────────────
  tvaResidentialLow:  { type: Number, default: 0.07  }, // <= 300 kWh
  tvaResidentialHigh: { type: Number, default: 0.13  }, // > 300 kWh
  tvaProfessional:    { type: Number, default: 0.19  },

  // ── Fixed Monthly Fees (Redevance Fixe) DT ────────────────────────────────
  redevanceFixeResidential:  { type: Number, default: 3.5  },
  redevanceFixeProfessional: { type: Number, default: 15.0 },
  redevanceFixeAgricultural: { type: Number, default: 15.0 },

  // ── System Constants ──────────────────────────────────────────────────────
  panelWattage:       { type: Number, default: 450  }, // W
  systemPricePerKwp:  { type: Number, default: 3500 }, // DT/kWp
  productionPerKwp:   { type: Number, default: 1500 }, // kWh/year/kWp
  co2EmissionFactor:  { type: Number, default: 0.56  }, // kg CO2/kWh

}, { timestamps: true });

module.exports = mongoose.model('StegRate', StegRateSchema);
