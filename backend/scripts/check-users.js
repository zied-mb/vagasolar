/**
 * VagaSolar — Admin Diagnostic Tool
 *
 * Lists all registered users in the MongoDB 'users' collection.
 * Helpful for verifying if the admin was seeded correctly.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUsers = async () => {
    try {
        console.log('🔍 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.\n');

        const users = await User.find({}).select('+password'); // Include password field to see if it's hashed
        
        if (users.length === 0) {
            console.log('⚠️  No users found in the database. You need to run: npm run seed');
        } else {
            console.log(`📊 Found ${users.length} user(s):`);
            users.forEach((u, i) => {
                const isHashed = u.password.startsWith('$2');
                console.log(`  ${i + 1}. Email: ${u.email} | Role: ${u.role} | Hashed: ${isHashed ? '✅ Yes' : '❌ NO (Plain text!)'}`);
            });
        }

        console.log('\n✨ Diagnostic complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    }
};

checkUsers();
