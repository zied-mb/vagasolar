const mongoose = require('mongoose');

/**
 * LeadSchema captures every potential customer who completes the
 * simulator's Lead Gate.  The full `resultat` object is stored as JSON
 * so Zied can reconstruct the exact audit view in the admin dashboard.
 */
const LeadSchema = new mongoose.Schema({
  // ── Identity ──────────────────────────────────────────────────────────────
  nom:       { type: String, required: [true, 'Nom requis'],    trim: true },
  prenom:    { type: String, required: [true, 'Prénom requis'], trim: true },
  telephone: { type: String, required: [true, 'Téléphone requis'], trim: true },
  email:     { type: String, trim: true, lowercase: true, default: null },

  // ── Financial Snapshot (from SimulatorForm inputs) ────────────────────────
  consommationMensuelle: { type: Number, required: true }, // kWh/month
  typeBatiment:          { type: String, required: true,
    enum: ['residential', 'professional', 'agricultural'] },
  couvertureVoulue:      { type: Number, required: true }, // %

  // ── Full Calculation Object (mirrors useSimulator resultat) ───────────────
  resultat: {
    billBefore: {
      energy:    Number,
      surtaxes:  Number,
      tvaEnergy: Number,
      fixedFee:  Number,
      tvaFixed:  Number,
      total:     Number,
    },
    billAfter: {
      energy:    Number,
      surtaxes:  Number,
      tvaEnergy: Number,
      fixedFee:  Number,
      tvaFixed:  Number,
      total:     Number,
    },
    // New explicit totals for easier visualization
    totals: {
      quarterly: { before: Number, after: Number, savings: Number },
      annual:    { before: Number, after: Number, savings: Number },
    },
    savings: {
      monthly:     Number,
      trimestriel: Number,
      annual:      Number,
    },
    systemSize: {
      kWp:   mongoose.Schema.Types.Mixed,
      panels: Number,
      cost:   Number,
    },
    payback:                  mongoose.Schema.Types.Mixed,
    co2:                      mongoose.Schema.Types.Mixed,
    productionSolaireAnnuelle: mongoose.Schema.Types.Mixed,
  },

  // ── Metadata ──────────────────────────────────────────────────────────────
  pdfDownloaded: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quote_sent', 'closed'],
    default: 'new',
  },
  notes: { type: String, default: '' },

}, { timestamps: true });

// ─── Indexes ─────────────────────────────────────────────────────────────────
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ telephone: 1 });

module.exports = mongoose.model('Lead', LeadSchema);
