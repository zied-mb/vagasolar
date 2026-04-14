const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Nom requis'],    trim: true },
  email:    { type: String, required: [true, 'Email requis'],  trim: true, lowercase: true },
  phone:    { type: String, trim: true },
  type:     { type: String, enum: ['Contact', 'Devis'], default: 'Contact' },
  subject:  { type: String, trim: true },
  content:  { type: String, required: [true, 'Message requis'] },
  status:   { type: String, enum: ['New', 'Read'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
