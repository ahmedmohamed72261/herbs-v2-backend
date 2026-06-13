import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

dotenv.config({ path: './.env' });

console.log('Initializing admin...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

dns.setServers(['8.8.8.8', '1.1.1.1']);

const initializeAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        const adminName = process.env.ADMIN_NAME || 'Admin';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@herbs.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        console.log('Looking for existing admin:', adminEmail);
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists');
            console.log(`Name: ${adminName}`);
            console.log(`Email: ${adminEmail}`);
            process.exit(0);
        }

        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();

        console.log('Admin user created successfully!');
        console.log(`Name: ${adminName}`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('\nPlease change the default password after first login.');

    } catch (error) {
        console.error('Error initializing admin:', error);
        if (error.stack) console.error(error.stack);
    } finally {
        console.log('Closing MongoDB connection...');
        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    }
};

initializeAdmin();
