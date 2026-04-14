const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  type:        { type: String, enum: ['residential', 'commercial', 'agricultural', 'industrial'], default: 'residential' },
  description: { type: String, required: true },
  capacity:    { type: String, required: true }, // e.g. "3 kWc"
  savings:     { type: String, required: true }, // e.g. "70%"
  location:    { type: String, required: true },
  
  // Replaced single image with a high-fidelity image objects array
  images: [{
    url:       { type: String, required: true },
    public_id: { type: String, required: true }
  }],

  link:        { type: String, default: '#' },
  active:      { type: Boolean, default: true }, // Toggle visibility
  order:       { type: Number, default: 0 },     // Display order
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
