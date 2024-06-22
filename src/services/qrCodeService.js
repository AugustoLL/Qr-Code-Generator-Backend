const QRCode = require('qrcode');
const sharp = require('sharp');
const axios = require('axios');
const logger = require('../logger');
const { getCache, setCache, manageCacheSize, clearCache } = require('../cache');
const { CACHE_EXPIRATION_TIME, MAX_CACHE_SIZE } = require('../config');
const { ValidationError, InternalServerError } = require("../utils/errors");
const qrCodeSchema = require('../validation/qrCodeSchema');

// Generate QR code and cache it if it doesn't exist in the cache
const generateQRCode = async (url, options) => {
  try {
    url = decodeURIComponent(url);
    const { format, size, errorCorrectionLevel, color, logoUrl, logoSizeRatio } = options;
    
    const cacheKey = `${url}_${format}_${size}_${errorCorrectionLevel}_${color}_${logoUrl}_${logoSizeRatio}`;

    // Check if the QR code already exists in the cache
    let qrCode = getCache(cacheKey);

    if (!qrCode) {
      // Generate QR code
      const qrCodeBuffer = await QRCode.toBuffer(url, {
        type: format,
        width: size,
        errorCorrectionLevel: errorCorrectionLevel,
        color: {
          dark: color.dark || '#000000',
          light: color.light || '#FFFFFF'
        }
      });

      logger.info(`QR code generated successfully for: ${url}`);

      if (logoUrl) {
        // Add logo to QR code
        qrCode = await addLogoToQRCode(qrCodeBuffer, logoUrl, logoSizeRatio || 0.2, format, size, color.light);
      } else {
        // Convert QR code to base64
        qrCode = `data:image/${format};base64,${qrCodeBuffer.toString('base64')}`;
      }

      // Cache the QR code with expiration time
      manageCacheSize(MAX_CACHE_SIZE);
      setCache(cacheKey, qrCode, CACHE_EXPIRATION_TIME);
    } else {
      logger.info(`QR code found in cache for: ${url}`);
    }

    return qrCode;
  } catch (error) {
    logger.error(`Error generating QR code: ${error}`);
    throw new InternalServerError("Error generating QR code");
  }
};

const addLogoToQRCode = async (qrCodeBuffer, logoUrl, logoSizeRatio, format, size, backgroundColor = '#FFFFFF') => {
  // Fetch the logo image from the URL
  const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
  const logoImageBuffer = Buffer.from(response.data, 'binary');

  const qrImage = sharp(qrCodeBuffer);
  const logoImage = sharp(logoImageBuffer);

  const { width } = await qrImage.metadata();
  const logoSize = Math.floor(width * logoSizeRatio);

  // Create a white rectangle where the logo will be placed
  const qrImageWithRect = await qrImage
    .composite([{
      input: Buffer.from(
        `<svg width="${size}" height="${size}">
          <rect x="${(size - logoSize) / 2}" y="${(size - logoSize) / 2}" width="${logoSize}" height="${logoSize}" fill="${backgroundColor}"/>
        </svg>`
      ),
      gravity: 'center',
    }])
    .toBuffer();

  const resizedLogo = await logoImage
    .resize(logoSize, logoSize)
    .toBuffer();

  const qrCodeWithLogo = await sharp(qrImageWithRect)
    .composite([{ input: resizedLogo, gravity: 'center' }])
    .toFormat(format)
    .toBuffer();

    return `data:image/${format};base64,${qrCodeWithLogo.toString('base64')}`;
}

const validateInputs = (url, format, size, errorCorrectionLevel, colors, logoUrl, logoSizeRatio) => {
  const { error, value } = qrCodeSchema.validate({
    url,
    format,
    size,
    errorCorrectionLevel,
    color: colors,
    logoUrl,
    logoSizeRatio
  });

  if (error) {
    const  errorMessages = error.details.map((detail) => detail.message).join(', ');
    throw new ValidationError(errorMessages);
  }
  
  return value;
};

module.exports = {
  generateQRCode,
  validateInputs,
};