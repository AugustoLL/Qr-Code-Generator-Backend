const express = require('express');
const QRCode = require('qrcode');
const cache = require('memory-cache');
const validUrl = require('valid-url');


// Create express app
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cache expiration time in seconds
const CACHE_EXPIRATION_TIME = 3600 * 1000; // 1 hour
// Maximum number of entries in the cache
const MAX_CACHE_ENTRIES = 100;
let cacheSize = 0;

const manageCacheSize = () => {
  if (cacheSize > MAX_CACHE_ENTRIES) {
    cache.clear();
    cacheSize = 0;
    cache.keys().forEach(key => {
      cache.del(key);
    });
    console.log('Cache cleared due to max size reached.');
  }
};

app.get('/generate', async (req, res) => {
  try {
    const url = req.query.url // Get URL from query parameter
    const format = req.query.format || 'png' // Get format from query parameter
    const size = req.query.size || 200 // Get size from query parameter
    const errorCorrectionLevel = req.query.errorCorrectionLevel || 'M' // Get error correction level from query parameter

    // Validate URL
    if (!url || !validUrl.isUri(url)) {
      return res.status(400).json({ error: 'A valid URL is required' });
    }

    // Validate format
    // Check if format is one of png, svg, jpeg, jgp, webp
    if (!['png', 'svg', 'jpeg', 'jpg', 'webp'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Valid values are png, svg, jpeg, jgp, webp' });
    }

    // Validate size
    // Check if size is a number and between 50 and 1080
    if (isNaN(size) || size < 50 || size > 1080) {
      return res.status(400).json({ error: 'Invalid size. Valid values are between 50 and 1080' });
    }

    // Generate cache key based on URL, format and size
    const cacheKey = `${url}-${format}-${size}`;

    // Check if the QR code already exists in the cache
    let qrCode = cache.get(cacheKey);

    if (!qrCode) {
      // Generate QR code
      qrCode = await QRCode.toDataURL(url);

      // Cache size management
      manageCacheSize();

      // Cache the QR code with expiration time
      cache.put(cacheKey, qrCode, CACHE_EXPIRATION_TIME);
      // Increment the cache size
      cacheSize++;
    }

    // Send the QR code as a response
    res.send(`<img src="${qrCode}" alt="qrcode"/>`);
  } catch (error) {
    console.log('Error generating QR code:', error);
    res.status(500).json({ error: "Failed to generate QR code. Please try again." });
  }
});

// Clear the cache manually
app.get('/clear-cache', (req, res) => {
  cache.clear();
  cacheSize = 0;
  cache.keys().forEach(key => {
    cache.del(key);
  });
  console.log('Cache cleared manually.');
  res.send('Cache cleared successfully.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));