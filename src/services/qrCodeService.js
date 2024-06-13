const QRCode = require('qrcode');
const validUrl = require('valid-url');
const { getCache, setCache, manageCacheSize, clearCache } = require('../cache');
const { CACHE_EXPIRATION_TIME, MAX_CACHE_SIZE } = require('../config');


// Generate QR code and cache it if it doesn't exist in the cache
const generateQRCode = async (url, format, size, errorCorrectionLevel) => {
  const cacheKey = `${url}-${format}-${size}-${errorCorrectionLevel}`;

  // Check if the QR code already exists in the cache
  let qrCode = getCache(cacheKey);

  if (!qrCode) {
    // Generate QR code
    qrCode = await QRCode.toDataURL(url, {
      type: format,
      width: size,
      errorCorrectionLevel: errorCorrectionLevel
    });

    // Cache the QR code with expiration time
    manageCacheSize(MAX_CACHE_SIZE);
    setCache(cacheKey, qrCode, CACHE_EXPIRATION_TIME);
  }

  return qrCode;
};

const validateInputs = (url, format, size, errorCorrectionLevel) => {
  // Validate URL
  if (!url || !validUrl.isUri(url)) {
    return { error: 'A valid URL is required' };
  }

  // Validate format
  // Check if format is one of png, svg, jpeg, jgp, webp
  if (!['png', 'svg', 'jpeg', 'jpg', 'webp'].includes(format)) {
    return { error: 'Invalid format. Valid values are png, svg, jpeg, jgp, webp' };
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
};

module.exports = {
  generateQRCode,
  validateInputs,
};