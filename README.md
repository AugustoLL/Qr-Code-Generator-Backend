# QR Generator

[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-v20.11.0-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![npm Version](https://img.shields.io/badge/npm-v10.3.0-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/)
[![axios Version](https://img.shields.io/badge/axios-v1.7.2-blue?style=for-the-badge&logo=axios)](https://www.npmjs.com/package/axios/v/1.7.2)
[![Express Version](https://img.shields.io/badge/express-v4.19.2-blue?style=for-the-badge&logo=express)](https://www.npmjs.com/package/express/v/4.19.2)
[![express-rate-limit Version](https://img.shields.io/badge/express--rate--limit-v7.3.1-blue?style=for-the-badge)](https://www.npmjs.com/package/express-rate-limit/v/7.3.1)
[![nodemon Version](https://img.shields.io/badge/nodemon-v3.1.3-blue?style=for-the-badge&logo=nodemon)](https://www.npmjs.com/package/nodemon/v/3.1.3)
[![dotenv Version](https://img.shields.io/badge/dotenv-v16.4.5-blue?style=for-the-badge&logo=dotenv)](https://www.npmjs.com/package/dotenv/v/v16.4.5)
[![joi Version](https://img.shields.io/badge/joi-v17.13.1-blue?style=for-the-badge)](https://www.npmjs.com/package/joi/v/17.13.1)
[![memory-cache Version](https://img.shields.io/badge/memory--cache-v0.2.0-blue?style=for-the-badge)](https://www.npmjs.com/package/memory-cache/v/0.2.0)
[![morgan Version](https://img.shields.io/badge/morgan-v1.10.0-blue?style=for-the-badge)](https://www.npmjs.com/package/morgan/v/1.10.0)
[![qrcode Version](https://img.shields.io/badge/qrcode-v1.5.3-blue?style=for-the-badge)](https://www.npmjs.com/package/qrcode/v/1.5.3)
[![sharp Version](https://img.shields.io/badge/sharp-v0.33.4-blue?style=for-the-badge&logo=sharp)](https://www.npmjs.com/package/sharp/v/0.33.4)
[![valid-url Version](https://img.shields.io/badge/valid--url-v1.0.9-blue?style=for-the-badge)](https://www.npmjs.com/package/valid-url/v/1.0.9)
[![winston Version](https://img.shields.io/badge/winston-v3.13.0-blue?style=for-the-badge)](https://www.npmjs.com/package/winston/v/3.13.0)
[![winston-daily-rotate-file Version](https://img.shields.io/badge/winston--daily--rotate--file-v5.0.0-blue?style=for-the-badge)](https://www.npmjs.com/package/winston-daily-rotate-file/v/5.0.0)

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

## Examples

### Example 1: Simple Black and White QR Code

```sh
http://localhost:8080/api/generate?url=https://github.com/AugustoLL/Qr-Code-Generator-Backend&format=png&size=500&errorCorrectionLevel=H
```

<img src="examples/githubRepoQRCode.png" alt="Github repo QR Code" width="300" />

### Example 2: Red and Black QR Code with YouTube Logo

```sh
http://localhost:8080/api/generate?url=https://youtube.com&format=png&size=500&errorCorrectionLevel=H&darkColor=%23FF0000&lightColor=%23000000&logoUrl=https://clipart-library.com/images_k/youtube-transparent-png/youtube-transparent-png-15.png
```

<img src="examples/youtubeQRCode.png" alt="YouTube QR Code" width="300" />

### Example 3: White and Light-Blue QR Code with LinkedIn Logo

```sh
http://localhost:8080/api/generate?url=https://www.linkedin.com/in/augusto-lombino-218bba18b&format=png&size=500&errorCorrectionLevel=H&darkColor=%231686B0&lightColor=%23FFFFFF&logoUrl=https://sydneysocialmediamanagers.com.au/wp-content/uploads/2017/03/Linkedin-logo.png&logoSizeRatio=0.2
```

<img src="examples/linkedInQRCode.png" alt="LinkedIn Profile QR Code" width="300" />

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/AugustoLL/Qr-Code-Generator-Backend.git
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

The server will start on http://localhost:8080 by default.

## Environment Variables

This project uses the following environment variables for configuration:

- `PORT`: The port on which the server runs (default: 8080).
- `CACHE_EXPIRATION_TIME`: Cache expiration time in seconds (default: 3600).
- `MAX_CACHE_SIZE`: Maximum cache size (default: 100).

You can define these variables in a `.env` file.

### Example .env File

```plaintext
PORT=8080
CACHE_EXPIRATION_TIME=3600
MAX_CACHE_SIZE=100
```

## API Endpoints

### Generate QR Code

```sh
GET /api/generate
```

#### Parameters

- `url`: URL to encode in the QR code (required)
- `format`: Image format (png, jpeg, webp; default: png)
- `size`: Size of the QR code image (default: 200)
- `errorCorrectionLevel`: Error correction level (L, M, Q, H; default: M)
- `darkColor`: Dark color of the QR code in hex format (default: #000000)
- `lightColor`: Light color of the QR code in hex format (default: #FFFFFF)
- `logoUrl`: URL of the logo image to overlay on the QR code (optional)
- `logoSizeRatio`: Size ratio of the logo relative to the QR code (default: 0.2)

#### Example

```sh
http://localhost:8080/api/generate?url=https://example.com&format=png&size=300&errorCorrectionLevel=M&darkColor=%230000FF&lightColor=%23FFFF00
```

### Clear Cache

```sh
GET /api/clear-cache
```

#### Description

Clears the cached QR codes stored for improved performance.

## Usage

To generate a QR code, open your browser and navigate to:

http://localhost:8080/api/generate?url=YOUR_URL&format=png&size=200

Replace `YOUR_URL` with the URL you want to encode.

## Docker Setup

### Build Docker Image

```bash
docker build -t qr-code-generator .
```

### Run Docker Container

```bash
docker run --env-file .env -p 8080:8080 qr-code-generator
```

Alternatively, you can pass individual environment variables directly:

```bash
docker run -e NODE_ENV=production -e API_KEY=your_api_key_here -p 8080:8080 qr-code-generator
```

### Docker Compose

To use Docker Compose, run the following command:

```bash
docker-compose up
```