const xss  = require('xss');
const Lead = require('../models/Lead');
const XLSX = require('xlsx');

// ─── POST /api/leads  (PUBLIC) ────────────────────────────────────────────────
exports.createLead = async (req, res) => {
  try {
    // SECURITY — Field Whitelisting: Destructure only the expected guest fields.
    // Any extra keys (e.g. status:'closed', _id, pdfDownloaded) in req.body are
    // silently discarded, preventing mass-assignment and ID spoofing attacks.
    const {
      nom, prenom, telephone, email,
      consommationMensuelle, typeBatiment, couvertureVoulue, resultat,
    } = req.body;

    // Basic validation
    if (!nom || !prenom || !telephone || !consommationMensuelle || !typeBatiment || !resultat) {
      return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
    }

    // SECURITY — XSS Sanitization: Strip HTML/script injection from all
    // user-supplied strings before persisting to MongoDB.
    const lead = await Lead.create({
      nom:                   xss(String(nom).trim()),
      prenom:                xss(String(prenom).trim()),
      telephone:             xss(String(telephone).trim()),
      email:                 email ? xss(String(email).trim()) : undefined,
      consommationMensuelle: Number(consommationMensuelle),
      typeBatiment:          xss(String(typeBatiment).trim()),
      couvertureVoulue:      couvertureVoulue !== undefined ? Number(couvertureVoulue) : undefined,
      resultat,              // Numeric/object — not user-rendered as HTML
    });

    res.status(201).json({ success: true, leadId: lead._id });
  } catch (err) {
    console.error('[createLead]', err.message);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement.' });
  }
};

// ─── GET /api/leads  (ADMIN) ──────────────────────────────────────────────────
exports.getLeads = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { nom:       { $regex: search, $options: 'i' } },
        { prenom:    { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/leads/:id  (ADMIN) ──────────────────────────────────────────────
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead introuvable.' });
    res.status(200).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/leads/:id/status  (ADMIN) ────────────────────────────────────
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ['new', 'contacted', 'quote_sent', 'closed'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }

    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead introuvable.' });
    res.status(200).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/leads/:id/pdf  (PUBLIC — called after PDF download) ───────────
exports.markPdfDownloaded = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { pdfDownloaded: true });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/leads/export  (ADMIN) ──────────────────────────────────────────
exports.exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();

    const rows = leads.map((l) => ({
      Date:          new Date(l.createdAt).toLocaleDateString('fr-TN'),
      Nom:           l.nom,
      Prénom:        l.prenom,
      Téléphone:     l.telephone,
      Email:         l.email || '',
      'Type Bâtiment': l.typeBatiment,
      'Conso (kWh/m)': l.consommationMensuelle,
      'Couverture %':  l.couvertureVoulue,
      'Facture Avant (DT)': l.resultat?.billBefore?.total?.toFixed(2) || '',
      'Facture Après (DT)':  l.resultat?.billAfter?.total?.toFixed(2)  || '',
      'Économies/An (DT)':   l.resultat?.savings?.annual?.toFixed(0)   || '',
      'Système (kWp)':       l.resultat?.systemSize?.kWp              || '',
      'Panneaux':            l.resultat?.systemSize?.panels            || '',
      'ROI (Ans)':           l.resultat?.payback                      || '',
      'PDF Téléchargé':      l.pdfDownloaded ? 'Oui' : 'Non',
      Statut:                l.status,
      Notes:                 l.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', `attachment; filename=VagaSolar-Leads-${Date.now()}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
