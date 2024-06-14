const express = require("express");
const { getQRCode, clearCacheManually } = require("../controller/qrCodeController");

const router = express.Router();

router.get('/generate', getQRCode);
router.get('/clear-cache', clearCacheManually);

module.exports = router;