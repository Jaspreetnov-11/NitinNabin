import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const possiblePaths = [
    String.raw`C:\Users\HEY its amandeep\.gemini\antigravity-ide\brain\17afda2c-cd8e-4187-a590-9ccd3b562088\.user_uploaded\media_1789110859246.png`,
    path.join(process.cwd(), "public", "temple-darshan.jpg"),
  ];

  let srcPath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      srcPath = p;
      break;
    }
  }

  if (!srcPath) {
    return new NextResponse("Image not found", { status: 404 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require("sharp");
    const image = sharp(srcPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Find the blue sky & temple bounding box
    // Blue sky has: b > 160, b > r + 30, g > 100, y between 30% and 80%
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    const startY = Math.round(height * 0.30);
    const endY = Math.round(height * 0.78);

    for (let y = startY; y < endY; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Match the blue sky of the temple: vibrant cyan/blue sky
        const isSky = b > 150 && b > r + 30 && g > 110 && g < 235;
        // Or the white temple marble/shikhara
        const isTempleMarble = r > 180 && g > 185 && b > 190 && y > startY + 50;

        if (isSky || isTempleMarble) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX > minX && maxY > minY) {
      // Add slight padding but stay within bounds
      const pad = 4;
      const cropLeft = Math.max(0, minX - pad);
      const cropTop = Math.max(0, minY - pad);
      const cropWidth = Math.min(width - cropLeft, maxX - minX + pad * 2);
      const cropHeight = Math.min(height - cropTop, maxY - minY + pad * 2);

      const cropped = await sharp(srcPath)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .jpeg({ quality: 92 })
        .toBuffer();

      return new NextResponse(cropped, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Fallback if detection misses
    const cropLeft = Math.round(width * 0.40);
    const cropTop = Math.round(height * 0.41);
    const cropWidth = Math.round(width * 0.44);
    const cropHeight = Math.round(height * 0.34);

    const cropped = await sharp(srcPath)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(cropped, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("Error cropping temple image:", err);
    const buf = fs.readFileSync(srcPath);
    return new NextResponse(buf, { headers: { "Content-Type": "image/png" } });
  }
}

