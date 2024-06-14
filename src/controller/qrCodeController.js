const { generateQRCode, validateInputs } = require('../services/qrCodeService');
const { clearCache } = require('../cache');

const getQRCode = async (req, res, next) => {
  try {
    // Get URL, format, size, error correction level, dark color and light color, logo URL and logo size ratio from query parameters
    const { 
      url,
      format = 'png',
      size = 200,
      errorCorrectionLevel = 'M',
      darkColor = '#000000',
      lightColor = '#FFFFFF', 
      logoUrl,
      logoSizeRatio = 0.2 
    } = req.query;

    // Validate inputs
    validateInputs(url, format, size, errorCorrectionLevel, { dark: darkColor, light: lightColor }, logoUrl, logoSizeRatio);

    const options = {
      format,
      size: parseInt(size, 10),
      errorCorrectionLevel,
      color: { dark: darkColor, light: lightColor },
      logoUrl,
      logoSizeRatio: parseFloat(logoSizeRatio)
    };

    // Generate QR code
    const qrCode = await generateQRCode(url, options);

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    res.setHeader('Content-Type', mimeType);

    // Send the QR code as a response
    // res.send(`<img src="${qrCode}" alt="qrcode"/>`);
    res.send(Buffer.from(qrCode.split(',')[1], 'base64'));
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