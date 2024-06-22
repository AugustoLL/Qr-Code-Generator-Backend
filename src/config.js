require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CACHE_EXPIRATION_TIME: process.env.CACHE_EXPIRATION_TIME || 3600, // Cache expiration time in seconds
  MAX_CACHE_SIZE: process.env.MAX_CACHE_SIZE || 100, // Maximum number of entries in the cache
};