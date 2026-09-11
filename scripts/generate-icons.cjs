const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SVG_PATH = path.join(__dirname, "../public/favicon.svg");
const OUT_DIR = path.join(__dirname, "../public");

const SIZES = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "pwa-192x192.png", size: 192 },
  { name: "pwa-512x512.png", size: 512 }
];

async function generateIcons() {
  console.log("Generating PNG assets from SVG...");

  if (!fs.existsSync(SVG_PATH)) {
    console.error(`Error: Could not find ${SVG_PATH}`);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  for (const { name, size } of SIZES) {
    const outPath = path.join(OUT_DIR, name);
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outPath);
      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (err) {
      console.error(`❌ Failed to generate ${name}:`, err);
    }
  }
}

generateIcons();
