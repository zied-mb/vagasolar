const Project = require('../models/Project');
const { cloudinary } = require('../middleware/upload');

// ─── GET /api/projects  (PUBLIC) ─────────────────────────────────────────────
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ active: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/projects/:id (PUBLIC) ──────────────────────────────────────────
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable.' });

    // ─── Fetch Similar Projects ───
    const similar = await Project.find({
      _id: { $ne: project._id },
      active: true,
      type: project.type
    }).limit(3);

    // If not enough similar projects of same type, fill with others
    let suggestions = [...similar];
    if (suggestions.length < 3) {
      const others = await Project.find({
        _id: { $ne: project._id, $nin: suggestions.map(s => s._id) },
        active: true
      }).limit(3 - suggestions.length);
      suggestions = [...suggestions, ...others];
    }

    res.status(200).json({ success: true, project, similar: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ID de projet invalide ou erreur serveur.' });
  }
};

// ─── GET /api/projects/all  (ADMIN — includes inactive) ──────────────────────
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/projects  (ADMIN) ─────────────────────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/projects/:id  (ADMIN) ──────────────────────────────────────────
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable.' });
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/projects/:id  (ADMIN) ───────────────────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable.' });

    // ─── Smart Multi-Purge from Cloudinary ───
    if (project.images && project.images.length > 0) {
      try {
        const deletePromises = project.images.map(img => {
          if (img.public_id) {
            return cloudinary.uploader.destroy(img.public_id);
          }
          return Promise.resolve();
        });
        
        const results = await Promise.all(deletePromises);
        console.log(`[CLOUDINARY] Bulk delete success for project: ${project.title}`, results);
      } catch (cloudErr) {
        console.warn('[CLOUDINARY_DELETE_FAILED]', cloudErr.message);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Projet et ses images ont été supprimés.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
