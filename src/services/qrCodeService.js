const QRCode = require('qrcode');
const sharp = require('sharp');
const axios = require('axios');
const validUrl = require('valid-url');
const { getCache, setCache, manageCacheSize, clearCache } = require('../cache');
const { CACHE_EXPIRATION_TIME, MAX_CACHE_SIZE } = require('../config');


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
  // Validate URL
  if (!url || !validUrl.isUri(url)) {
    return { error: 'A valid URL is required' };
  }

  // Validate format
  // Check if format is one of png, jpeg, jgp
  const validFormats = ['png', 'jpeg', 'jpg'];
  if (!validFormats.includes(format)) {
    return { error: 'Invalid format. Valid values are png, jpeg, jgp' };
  }

  // Validate size
  // Check if size is a number and between 50 and 1080
  if (isNaN(size) || size < 50 || size > 1080) {
    return { error: 'Invalid size. Valid values are between 50 and 1080' };
  }

  // Validate error correction level
  // Check if error correction level is one of L, M, Q, H
  const validCorrectionLevels = ['L', 'M', 'Q', 'H'];
  if (!validCorrectionLevels.includes(errorCorrectionLevel)) {
    return { error: 'Invalid error correction level. Valid values are L, M, Q, H' };
  }

  const isValidHexColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);
  if (!isValidHexColor(colors.dark) || !isValidHexColor(colors.light)) {
    return { error: 'Invalid color. Use hex colors, e.g., #000000' };
  }

  if (logoUrl && !validUrl.isUri(logoUrl)) {
    return { error: 'Invalid logo URL. Use a valid URL' };
  }

  if (isNaN(logoSizeRatio) || logoSizeRatio <= 0 || logoSizeRatio > 1) {
    return { error: 'Invalid logo size ratio. Valid values are between 0 and 1' };
  }
};

module.exports = {
  generateQRCode,
  validateInputs,
};