const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads', { recursive: true });
  }
}

// Generate palette using matugen
async function generatePalette(imagePath) {
  try {
    // Execute matugen with JSON output and quiet flag to suppress extra output
    const { stdout, stderr } = await execAsync(
      `matugen image "${imagePath}" --json hex --quiet`
    );

    if (stderr && !stdout) {
      throw new Error(stderr);
    }

    // The output may have extra whitespace or content, find the JSON object
    let jsonOutput = stdout.trim();
    
    // If there's content after the JSON, extract just the JSON
    // Look for the last } which should close the JSON object
    const lastBrace = jsonOutput.lastIndexOf('}');
    if (lastBrace !== -1 && lastBrace < jsonOutput.length - 1) {
      jsonOutput = jsonOutput.substring(0, lastBrace + 1);
    }

    // Parse the JSON output from matugen
    const paletteData = JSON.parse(jsonOutput);
    return paletteData;
  } catch (error) {
    console.error('Matugen error:', error);
    console.error('Raw output:', error.stdout || 'N/A');
    throw new Error(`Failed to generate palette: ${error.message}`);
  }
}

// Clean up uploaded file
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/generate-palette', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const imagePath = req.file.path;

  try {
    // Generate palette using matugen
    const palette = await generatePalette(imagePath);

    // Clean up the uploaded file
    await cleanupFile(imagePath);

    res.json({
      success: true,
      palette: palette,
      originalFilename: req.file.originalname
    });
  } catch (error) {
    // Clean up the uploaded file even on error
    await cleanupFile(imagePath);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { stdout } = await execAsync('matugen --version');
    res.json({
      status: 'ok',
      matugen: stdout.trim()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Matugen not found or not working',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
async function startServer() {
  await ensureUploadsDir();
  
  app.listen(PORT, () => {
    console.log(`🎨 Matugen Palette Generator running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${path.resolve('uploads')}`);
  });
}

startServer().catch(console.error);
