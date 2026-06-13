import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import User from './models/User.js';

dotenv.config();

// Create a database connection middleware
const dbMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error in middleware:', err);
        res.status(500).json({ error: 'Database connection failed: ' + err.message });
    }
};

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(dbMiddleware);

app.use((req, res, next) => {
    console.log('\n=== NEW REQUEST ===');
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token');
    res.header('Access-Control-Max-Age', '86400');
    res.header('Access-Control-Expose-Headers', 'Authorization, Content-Length, X-JSON-Response');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Debug endpoint to list all users (for development only!)
app.get('/api/debug/users', async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json({ count: users.length, users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Herbs Node.js API' });
});

// Only listen when not in Vercel Serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
