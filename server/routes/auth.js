const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register Route
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(username || '', email, hashedPassword);

        const token = jwt.sign({ userId: info.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: info.lastInsertRowid, username, email } });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Me Route (Verify Token)
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const stmt = db.prepare('SELECT id, username, email FROM users WHERE id = ?');
        const user = stmt.get(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// Google OAuth Login Route
router.post('/google', async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ error: 'Google credential is required' });
    }

    try {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name || '';

        // Check if user exists
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            // Create new user if doesn't exist
            const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
            const info = stmt.run(name, email, 'google-oauth'); // Placeholder password for OAuth users
            user = { id: info.lastInsertRowid, name, email };
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
});

module.exports = router;
