const Joi = require('joi');


const qrCodeSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.base': 'The URL must be a string',
    'string.uri': 'The URL must be a valid URL',
    'any.required': 'The URL is required',
  }),
  format: Joi.string().valid('png', 'jpg', 'jpeg').default('png').messages({
    'string.base': 'The format must be a string',
    'any.only': 'The format must be png, jpg or jpeg',
  }),
  size: Joi.number().positive().integer().min(100).max(1080).default(200).messages({
    'number.base': 'The size must be a number',
    'number.positive': 'The size must be positive',
    'number.integer': 'The size must be an integer',
    'number.min': 'The size must be at least 100',
    'number.max': 'The size must be at most 1080',
  }),
  errorCorrectionLevel: Joi.string().valid('L', 'M', 'Q', 'H').default('M').messages({
    'string.base': 'The error correction level must be a string',
    'any.only': 'The error correction level must be L, M, Q or H',
  }),
  color: Joi.object({
    dark: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/i).default('#000000').messages({
      'string.base': 'The dark color must be a string',
      'string.pattern.base': 'The dark color must be a valid hex color',
    }),
    light: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/i).default('#FFFFFF').messages({
      'string.base': 'The light color must be a string',
      'string.pattern.base': 'The light color must be a valid hex color',
    }),
  }),
  logoUrl: Joi.string().uri().optional().messages({
    'string.base': 'The logo URL must be a string',
    'string.uri': 'The logo URL must be a valid URL',
  }),
  logoSizeRatio: Joi.number().positive().min(0.1).max(1).default(0.3).messages({
    'number.base': 'The logo size ratio must be a number',
    'number.positive': 'The logo size ratio must be positive',
    'number.min': 'The logo size ratio must be at least 0.1',
    'number.max': 'The logo size ratio must be at most 1',
  }),
  style: Joi.string().valid('default', 'rounded', 'smooth').default('default').messages({
    'string.base': 'Style must be a string',
    'any.only': 'Style must be one of [default, rounded, smooth]'
  })
});

module.exports = qrCodeSchema