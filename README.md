# Portfolio Website

Modern 3D Portfolio Website for Data Analyst - Pavan Vignesh Bayisetti

## Features

- 🎨 Modern 3D animations using Three.js
- 🌟 Floating torus knot in hero section
- 💫 Interactive project cards with 3D hover effects
- 🎯 Skills visualization with logos
- 📱 Fully responsive design
- 🌙 Dark theme with purple/blue neon accents

## Deployment on Render

### Option 1: Static Site (Recommended)

1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect GitHub repository: `vigneshpavan30-afk/MyPortfolio`
4. Settings:
   - **Name**: portfolio-website
   - **Branch**: master
   - **Build Command**: (leave empty)
   - **Publish Directory**: `.` (root)
5. Click "Create Static Site"

### Option 2: Web Service (If needed)

If you must use Web Service:
- **Build Command**: `echo "No build needed"`
- **Start Command**: (leave empty or use a simple static server)

## Local Development

```bash
# Install dependencies (optional - uses npx)
npm install

# Run development server
npm run dev
```

Or simply open `index.html` in your browser.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Three.js (3D graphics)
- No build tools required!

## License

MIT
