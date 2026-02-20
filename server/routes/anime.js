const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { convertToAnime } = require('../services/animeService');
const jwt = require('jsonwebtoken');

// Reuse authentication middleware or similar if needed
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'temp-anime-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/**
 * @route POST /api/anime
 * @desc Convert image to anime style
 */
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const strength = parseFloat(req.body.strength) || 0.55;

    try {
        console.log('[Anime Route] Received request for anime conversion');
        const generatedBuffer = await convertToAnime(req.file.path);

        // Save the generated buffer to local storage
        const localFilename = `anime-${Date.now()}.png`;
        const localPath = path.join(__dirname, '../uploads', localFilename);

        console.log('[Anime Route] Saving generated image to:', localPath);
        fs.writeFileSync(localPath, generatedBuffer);


        // Clean up temp upload
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.json({
            message: 'Anime conversion successful',
            originalUrl: `${baseUrl}/uploads/${path.basename(req.file.path)}`,
            processedUrl: `${baseUrl}/uploads/${localFilename}`,
            processingType: 'AI Anime'
        });

    } catch (error) {
        console.error('[Anime Route] Error:', error.message);
        // Cleanup on error
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        res.status(500).json({
            error: 'Failed to convert to anime',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
