const QRCode = require('qrcode');
const sharp = require('sharp');
const axios = require('axios');
const validUrl = require('valid-url');
const Joi = require('joi');
const { getCache, setCache, manageCacheSize, clearCache } = require('../cache');
const { CACHE_EXPIRATION_TIME, MAX_CACHE_SIZE } = require('../config');

const schema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'The URL must be a valid URL',
    'any.required': 'The URL is required',
  }),
  format: Joi.string().valid('png', 'jpg', 'jpeg').default('png').messages({
    'any.only': 'The format must be png, jpg or jpeg',
  }),
  size: Joi.number().positive().min(100).max(1080).default(200).messages({
    'number.base': 'The size must be a number',
    'number.positive': 'The size must be positive',
    'number.min': 'The size must be at least 100',
    'number.max': 'The size must be at most 1080',
  }),
  errorCorrectionLevel: Joi.string().valid('L', 'M', 'Q', 'H').default('M').messages({
    'any.only': 'The error correction level must be L, M, Q or H',
  }),
  color: Joi.object({
    dark: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/i).default('#000000').messages({
      'string.pattern.base': 'The dark color must be a valid hex color',
    }),
    light: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/i).default('#FFFFFF').messages({
      'string.pattern.base': 'The light color must be a valid hex color',
    }),
  }),
  logoUrl: Joi.string().uri().optional().messages({
    'string.uri': 'The logo URL must be a valid URL',
    'string.base': 'The logo URL must be a string',
  }),
  logoSizeRatio: Joi.number().positive().min(0.1).max(1).default(0.3).messages({
    'number.base': 'The logo size ratio must be a number',
    'number.positive': 'The logo size ratio must be positive',
    'number.min': 'The logo size ratio must be at least 0.1',
    'number.max': 'The logo size ratio must be at most 1',
  }),
});

// Generate QR code and cache it if it doesn't exist in the cache
const generateQRCode = async (url, options) => {
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

    if (logoUrl) {
      // Add logo to QR code
      qrCode = await addLogoToQRCode(qrCodeBuffer, logoUrl, logoSizeRatio || 0.2, format, size);
    } else {
      // Convert QR code to base64
      qrCode = `data:image/${format};base64,${qrCodeBuffer.toString('base64')}`;
    }

    // Cache the QR code with expiration time
    manageCacheSize(MAX_CACHE_SIZE);
    setCache(cacheKey, qrCode, CACHE_EXPIRATION_TIME);
  }

  return qrCode;
};

const addLogoToQRCode = async (qrCodeBuffer, logoUrl, logoSizeRatio, format, size) => {
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
          <rect x="${(size - logoSize) / 2}" y="${(size - logoSize) / 2}" width="${logoSize}" height="${logoSize}" fill="white"/>
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
  const { error, value } = schema.validate({
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
    throw new Error(errorMessages);
  }
  
  return value;
};

module.exports = {
  generateQRCode,
  validateInputs,
};