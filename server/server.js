const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth'); // Import auth routes
const settingsRoutes = require('./routes/settings'); // Import settings routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve uploaded files statically for now
app.use('/uploads', express.static('uploads'));

// Auth Routes
app.use('/api/auth', authRoutes);
// Settings Routes
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

  const processingType = req.body.processingType || 'original';
  const intensity = req.body.intensity ? parseInt(req.body.intensity) : null;

  try {
    // Process the image using the imageProcessing utility
    const { processImage } = require('./utils/imageProcessing');
    const processedPath = await processImage(req.file.path, processingType, intensity);

    const processedFilename = path.basename(processedPath);

    res.json({
      message: 'Image processed successfully',
      originalUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
      processedUrl: `http://localhost:${PORT}/uploads/${processedFilename}`,
      processingType: processingType,
      intensity: intensity
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Imagica API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
