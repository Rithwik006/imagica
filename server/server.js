const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth'); // Import auth routes
const settingsRoutes = require('./routes/settings'); // Import settings routes
const db = require('./db');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://imagica-2lj7bei5p-rithwik006s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check if it's a local development URL (localhost or 127.0.0.1)
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || isLocal) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log blocked origins for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    // Standardize user object to use userId for all legacy and new routes
    req.user = user;
    if (user.id && !user.userId) user.userId = user.id;
    next();
  });
};

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const processingTypeRaw = req.body.processingType;
  let processingType = ['original'];

  try {
    // Try to parse if it's a JSON string (from frontend)
    if (processingTypeRaw) {
      processingType = JSON.parse(processingTypeRaw);
    }
  } catch (e) {
    // Fallback if not JSON
    processingType = processingTypeRaw || 'original';
  }

  // Ensure it's an array for consistent processing
  if (!Array.isArray(processingType)) {
    processingType = [processingType];
  }

  const intensity = req.body.intensity ? parseInt(req.body.intensity) : null;

  try {
    // Process the image using the imageProcessing utility
    const { processImage } = require('./utils/imageProcessing');
    const processedPath = await processImage(req.file.path, processingType, intensity);

    const processedFilename = path.basename(processedPath);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.json({
      message: 'Image processed successfully',
      originalUrl: `${baseUrl}/uploads/${req.file.filename}`,
      processedUrl: `${baseUrl}/uploads/${processedFilename}`,
      processingType: processingType.join(', '), // Return as comma-separated string for display
      intensity: intensity
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

// Save Image Endpoint
app.post('/api/save', authenticateToken, (req, res) => {
  const { originalUrl, processedUrl, processingType } = req.body;
  const userId = req.user.userId;

  if (!originalUrl || !processedUrl) {
    return res.status(400).json({ error: 'Missing image URLs' });
  }

  try {
    const stmt = db.prepare('INSERT INTO images (user_id, original_url, processed_url, processing_type) VALUES (?, ?, ?, ?)');
    const result = stmt.run(userId, originalUrl, processedUrl, processingType || 'original');

    res.json({ message: 'Image saved successfully', id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Get User Saved Images Endpoint
app.get('/api/images', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  try {
    const stmt = db.prepare('SELECT * FROM images WHERE user_id = ? ORDER BY created_at DESC');
    const images = stmt.all(userId);
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

app.get('/', (req, res) => {
  res.send('Imagica API is running');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
