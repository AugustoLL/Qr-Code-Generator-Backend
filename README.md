# QR Generator

[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.com/rafael-schaefer/qr-generator.svg?branch=master)](https://travis-ci.com/rafael-schaefer/qr-generator)
[![Coverage Status](https://coveralls.io/repos/github/rafael-schaefer/qr-generator/badge.svg)](https://coveralls.io/github/rafael-schaefer/qr-generator)
[![Maintainability](https://api.codeclimate.com/v1/badges/c5c5ea0c6b0f1f62f7e6f7e4aeeb2c3e)](https://codeclimate.com/github/rafael-schaefer/qr-generator)

This is a simple QR code generator made with Node.js and Express.

## Features

- Generate QR codes from URLs
- Support for different formats and sizes
- Caching to improve performance

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
    node app.js
    ```

## Usage

To generate a QR code, open your browser and navigate to:

http://localhost:3000/generate?url=YOUR_URL&format=png&size=200

Replace `YOUR_URL` with the URL you want to encode.