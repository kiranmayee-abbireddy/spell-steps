import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateIcons() {
    const assetsDir = path.join(process.cwd(), 'assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir);
    }

    const svgPath = path.join(process.cwd(), 'public', 'favicon.svg');
    if (!fs.existsSync(svgPath)) {
        console.error('favicon.svg not found in public folder.');
        process.exit(1);
    }

    console.log('Generating assets/icon.png (1024x1024) from favicon.svg...');
    await sharp(svgPath)
        .resize(1024, 1024)
        .toFile(path.join(assetsDir, 'icon.png'));

    console.log('Generating assets/splash.png (2732x2732) from favicon.svg...');
    // For the splash screen, let's create a background with the icon centered.
    await sharp({
        create: {
            width: 2732,
            height: 2732,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 } // white background
        }
    })
        .composite([
            {
                input: await sharp(svgPath).resize(1024, 1024).toBuffer(),
                gravity: 'center'
            }
        ])
        .png()
        .toFile(path.join(assetsDir, 'splash.png'));

    console.log('Done!');
}

generateIcons().catch(console.error);
