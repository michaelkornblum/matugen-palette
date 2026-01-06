# Matugen Color Palette Generator

A Node.js web application that generates Material Design 3 color palettes from images using the [matugen](https://github.com/InioX/matugen) command-line tool.

## Prerequisites

1. **Install matugen**: Follow instructions at https://github.com/InioX/matugen
   ```bash
   # Example for Linux (check repo for your OS)
   cargo install matugen
   # or download pre-built binary
   ```

2. **Node.js**: Version 14 or higher

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure matugen is in your PATH:
   ```bash
   matugen --version
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

2. Open your browser to: `http://localhost:3000`

3. Upload an image to generate a Material Design 3 color palette

## Project Structure

```
/home/michael/
├── server.js           # Express backend server
├── package.json        # Node.js dependencies
├── public/
│   └── index.html      # Frontend interface
├── uploads/            # Temporary image storage
└── README.md           # This file
```

## How It Works

1. User uploads an image through the web interface
2. Image is sent to the Node.js backend via Express/Multer
3. Backend executes `matugen` CLI to generate the palette
4. Matugen analyzes the image and returns a JSON palette
5. Backend sends the palette back to the frontend
6. Frontend displays the Material Design 3 color system with semantic naming

## API Endpoints

- `POST /api/generate-palette` - Upload image and get generated palette
- `GET /api/health` - Check server status

## Troubleshooting

- **"matugen: command not found"**: Make sure matugen is installed and in your PATH
- **CORS errors**: The server has CORS enabled for localhost
- **Large images**: Files are limited to 10MB

## License

This project uses matugen for color generation. See matugen's license at https://github.com/InioX/matugen
