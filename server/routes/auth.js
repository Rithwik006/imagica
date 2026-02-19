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

// Google OAuth Login Route (legacy - kept for backwards compat)
router.post('/google', async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ error: 'Google credential is required' });
    }

    try {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name || '';

        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
            const info = stmt.run(name, email, 'google-oauth');
            user = { id: info.lastInsertRowid, name, email };
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
});

const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'imagica-3a5d6'
    });
}

// Firebase Google Sign-In Route
router.post('/google-firebase', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'Firebase ID token is required' });
    }

    try {
        // Verify the Firebase ID token using the Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (!decodedToken || !decodedToken.email) {
            return res.status(401).json({ error: 'Invalid Firebase token' });
        }

        const email = decodedToken.email;
        const name = decodedToken.name || decodedToken.email.split('@')[0];
        const picture = decodedToken.picture || null;

        // Find or create user in SQLite
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            const stmt = db.prepare(
                'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)'
            );
            const info = stmt.run(name, name, email, 'firebase-google');
            user = { id: info.lastInsertRowid, name, email };
        } else if (!user.name && name) {
            // Update name if it was missing
            db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, user.id);
            user.name = name;
        }

        // Issue our own JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name || name,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Firebase Google auth error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(401).json({
            error: 'Failed to authenticate with Google',
            details: error.message,
            code: error.code
        });
    }
});

module.exports = router;

