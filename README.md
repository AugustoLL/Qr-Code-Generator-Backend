# QR Generator

[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-v20.11.0-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![npm Version](https://img.shields.io/badge/npm-v10.3.0-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/)
[![axios Version](https://img.shields.io/badge/axios-v1.7.2-blue?style=for-the-badge&logo=axios)](https://www.npmjs.com/package/axios/v/1.7.2)
[![Express Version](https://img.shields.io/badge/express-v4.19.2-blue?style=for-the-badge&logo=express)](https://www.npmjs.com/package/express/v/4.19.2)
[![express-rate-limit Version](https://img.shields.io/badge/express--rate--limit-v7.3.1-blue?style=for-the-badge)](https://www.npmjs.com/package/express-rate-limit/v/7.3.1)
[![nodemon Version](https://img.shields.io/badge/nodemon-v3.1.3-blue?style=for-the-badge)](https://www.npmjs.com/package/nodemon/v/3.1.3)
[![dotenv Version](https://img.shields.io/badge/dotenv-v16.4.5-blue?style=for-the-badge)](https://www.npmjs.com/package/dotenv/v/v16.4.5)
[![joi Version](https://img.shields.io/badge/joi-v17.13.1-blue?style=for-the-badge)](https://www.npmjs.com/package/joi/v/17.13.1)
[![memory-cache Version](https://img.shields.io/badge/memory--cache-v0.2.0-blue?style=for-the-badge)](https://www.npmjs.com/package/memory-cache/v/0.2.0)
[![morgan Version](https://img.shields.io/badge/morgan-v1.10.0-blue?style=for-the-badge)](https://www.npmjs.com/package/morgan/v/1.10.0)
[![qrcode Version](https://img.shields.io/badge/qrcode-v1.5.3-blue?style=for-the-badge)](https://www.npmjs.com/package/qrcode/v/1.5.3)
[![sharp Version](https://img.shields.io/badge/sharp-v0.33.4-blue?style=for-the-badge)](https://www.npmjs.com/package/sharp/v/0.33.4)
[![valid-url Version](https://img.shields.io/badge/valid--url-v1.0.9-blue?style=for-the-badge)](https://www.npmjs.com/package/valid-url/v/1.0.9)
[![winston Version](https://img.shields.io/badge/winston-v3.13.0-blue?style=for-the-badge)](https://www.npmjs.com/package/winston/v/3.13.0)

This is a simple QR code generator made with Node.js and Express.

## Features

- Generate QR codes with customizable options:
- - URL to encode
- - Image format (PNG, JPEG, WebP)
- - Size
- - Error correction level
- - Dark and light colors
- - Logo overlay with customizable size ratio
- Cache QR codes for improved performance
- Clear cache manually through API endpoint

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/qr-code-generator.git
    cd qr-code-generator
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the server:
    ```sh
    npm start
    ```

The server will start on http://localhost:3000 by default.

## API Endpoints

### Generate QR Code

```sh
GET /api/generate
```

#### Parameters

`url`: URL to encode in the QR code (required)
`format`: Image format (png, jpeg, webp; default: png)
`size`: Size of the QR code image (default: 200)
`errorCorrectionLevel`: Error correction level (L, M, Q, H; default: M)
`darkColor`: Dark color of the QR code in hex format (default: #000000)
`lightColor`: Light color of the QR code in hex format (default: #FFFFFF)
`logoUrl`: URL of the logo image to overlay on the QR code (optional)
`logoSizeRatio`: Size ratio of the logo relative to the QR code (default: 0.2)

#### Example

```sh
http://localhost:3000/api/generate?url=https://example.com&format=png&size=300&errorCorrectionLevel=M&darkColor=%230000FF&lightColor=%23FFFF00
```

### Clear Cache

```sh
GET /api/clear-cache
```

#### Description

Clears the cached QR codes stored for improved performance.

## Usage

To generate a QR code, open your browser and navigate to:

http://localhost:3000/generate?url=YOUR_URL&format=png&size=200

Replace `YOUR_URL` with the URL you want to encode.