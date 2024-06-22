const { generateQRCode, validateInputs } = require('../services/qrCodeService');
const { clearCache } = require('../cache');
const { ValidationError, InternalServerError, AppError } = require("../utils/errors");
const qrCodeSchema = require('../validation/qrCodeSchema');
const logger = require('../utils/logger');


const getQRCode = async (req, res, next) => {
  try {
    // Get URL, format, size, error correction level, dark color and light color, logo URL and logo size ratio from query parameters
    let { 
      url,
      format = 'png',
      size = 200,
      errorCorrectionLevel = 'M',
      darkColor = '#000000',
      lightColor = '#FFFFFF', 
      logoUrl,
      logoSizeRatio = 0.3 
    } = req.query;

    darkColor = decodeURIComponent(darkColor);
    lightColor = decodeURIComponent(lightColor);

    logger.info('Received parameters:', {
      url, format, size, errorCorrectionLevel, darkColor, lightColor, logoUrl, logoSizeRatio
    });

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

    logger.info('Options after validation:', options);

    // Generate QR code
    const qrCode = await generateQRCode(url, options);

    logger.info('QR code generated successfully');

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    res.setHeader('Content-Type', mimeType);

    // Send the QR code as a response
    logger.info('Sending QR code as a response to:', req.socket.remoteAddress);
    res.status(200).send(Buffer.from(qrCode.split(',')[1], 'base64'));

  } catch (error) {
    logger.error('Error in getQRCode:', error);
    if (!(error instanceof AppError)) {
      logger.error("Error generating QR code", error);
      error = new InternalServerError("Error generating QR code");
    }
    next(error);
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