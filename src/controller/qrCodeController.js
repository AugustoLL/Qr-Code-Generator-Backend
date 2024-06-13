const { generateQRCode, validateInputs } = require('../services/qrCodeService');
const { clearCache } = require('../cache');

const getQRCode = async (req, res) => {
  try {
    // Get URL, format, size and error correction level from query parameters
    const url = req.query.url // Get URL from query parameter
    const format = req.query.format || 'png' // Get format from query parameter
    const size = parseInt(req.query.size) || 200 // Get size from query parameter
    const errorCorrectionLevel = req.query.errorCorrectionLevel || 'M' // Get error correction level from query parameter

    // Validate inputs
    validateInputs(url, format, size, errorCorrectionLevel);

    // Generate QR code
    const qrCode = await generateQRCode(url, format, size, errorCorrectionLevel);

    // Send the QR code as a response
    res.send(`<img src="${qrCode}" alt="qrcode"/>`);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: error.message});
  }
};

const clearCacheManually = async (req, res) => {
  clearCache();
  res.json({ message: 'Cache cleared successfully' });
};

module.exports = {
  getQRCode,
  clearCacheManually,
};