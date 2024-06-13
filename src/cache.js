const cache = require('memory-cache');

let cacheSize = 0;

const clearCache = () => {
  cache.clear();
  cacheSize = 0;
  cache.keys().forEach(key => {
    cache.del(key);
  });
  console.log('Cache cleared.');
};

const manageCacheSize = (maxCacheSize) => {
  if (cacheSize > maxCacheSize) {
    cache.clear();
  }
};

const getCache = (key) => cache.get(key);

const setCache = (key, value, expirationTime) => {
  cache.put(key, value, expirationTime * 1000);
  cacheSize++;
};

module.exports = {
  getCache,
  setCache,
  manageCacheSize,
  clearCache,
};