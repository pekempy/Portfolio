import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const login = (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (username === adminUser && adminHash && bcrypt.compareSync(password, adminHash)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });
        return res.json({ success: true });
    }

    res.status(401).json({ error: 'Invalid credentials' });
};

export const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
};

export const authCheck = (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.json({ isAdmin: false });

    try {
        jwt.verify(token, JWT_SECRET);
        return res.json({ isAdmin: true });
    } catch (err) {
        res.clearCookie('auth_token');
        return res.json({ isAdmin: false });
    }
};
