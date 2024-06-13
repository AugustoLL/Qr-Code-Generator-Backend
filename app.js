const express = require('express');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/generate', async (req, res) => {
  try {
    const url = req.query.url // Get URL from query parameter
    if (!url) {
      return res.status(400).json({ error: 'URL query parameter is required' });
    }
    // Generate QR code
    const qrCode = await QRCode.toDataURL(url);
    res.send(`<img src="${qrCode}" alt="qrcode"/>`);
  } catch (error) {
    console.log('Error generating QR code:', error);
    res.status(500).json({ error: "Failed to generate QR code. Please try again." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));