# QR Generator

[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/package-name.svg)](https://nodejs.org/)
[![npm Version](https://img.shields.io/npm/v/package-name.svg)](https://www.npmjs.com/package/package-name)

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