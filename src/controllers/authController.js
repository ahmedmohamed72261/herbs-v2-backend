import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-me', {
        expiresIn: parseInt(process.env.JWT_TTL || '3600'),
    });
};

export const login = async (req, res) => {
    try {
        console.log('Login request received:', { email: req.body.email });
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log('Found user:', user ? user.email : 'No user found');

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Unauthorized - Invalid password' });
        }

        res.json({
            access_token: generateToken(user._id),
            token_type: 'bearer',
            expires_in: parseInt(process.env.JWT_TTL || '3600'),
            user,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(422).json({ errors: { email: 'Email already exists' } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        res.status(201).json({
            access_token: generateToken(user._id),
            token_type: 'bearer',
            expires_in: parseInt(process.env.JWT_TTL || '3600'),
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const me = async (req, res) => {
    res.json(req.user);
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar, current_password, new_password } = req.body;
        const user = req.user;

        if (current_password && new_password) {
            if (!(await bcrypt.compare(current_password, user.password))) {
                return res.status(422).json({ errors: { current_password: 'Current password is incorrect' } });
            }
            user.password = await bcrypt.hash(new_password, 10);
        }

        if (name) user.name = name;
        if (email) {
            if (email !== user.email) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(422).json({ errors: { email: 'Email already exists' } });
                }
            }
            user.email = email;
        }
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    res.json({ message: 'Successfully logged out' });
};

export const refresh = (req, res) => {
    res.json({
        access_token: generateToken(req.user._id),
        token_type: 'bearer',
        expires_in: parseInt(process.env.JWT_TTL || '3600'),
        user: req.user,
    });
};
