const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: [true, 'Email is required'],
    unique:   true,
    lowercase: true,
    trim:     true,
  },
  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: 8,
    select:    false, // Never returned in queries by default
  },
  role: {
    type:    String,
    enum:    ['admin'],
    default: 'admin',
  },
}, { timestamps: true });

// ─── Hash password before saving ──────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare plain text with stored hash ──────────────────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
