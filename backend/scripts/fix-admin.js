/**
 * VagaSolar — Admin Auth Check
 * Test if the password in .env matches the hash in DB
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const bcrypt   = require('bcryptjs');

const verifyAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const pass  = process.env.INITIAL_ADMIN_PASSWORD;

    console.log(`🔍 Checking account: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.log('❌ User NOT found in database.');
    } else {
      const isMatch = await bcrypt.compare(pass, user.password);
      console.log(`🔑 Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
      
      if (!isMatch) {
         console.log('🔄 Attempting to FORCE reset password to .env value...');
         user.password = pass;
         await user.save();
         console.log('✅ Password has been reset and re-hashed.');
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

verifyAuth();
