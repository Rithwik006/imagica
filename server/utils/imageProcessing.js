const sharp = require('sharp');
const path = require('path');

/**
 * Apply grayscale filter to image
 */
async function applyGrayscale(inputPath, outputPath) {
    await sharp(inputPath)
        .grayscale()
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply sepia tone filter
 */
async function applySepia(inputPath, outputPath) {
    await sharp(inputPath)
        .tint({ r: 112, g: 66, b: 20 }) // Sepia tone
        .modulate({ saturation: 0.6 })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply blur with adjustable intensity
 */
async function applyBlur(inputPath, outputPath, intensity = 5) {
    await sharp(inputPath)
        .blur(Math.max(0.3, Math.min(1000, intensity)))
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply sharpen filter
 */
async function applySharpen(inputPath, outputPath) {
    await sharp(inputPath)
        .sharpen()
        .toFile(outputPath);
    return outputPath;
}

/**
 * Adjust brightness (-100 to 100)
 */
async function adjustBrightness(inputPath, outputPath, level = 0) {
    const brightness = 1 + (level / 100);
    await sharp(inputPath)
        .modulate({ brightness })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Adjust contrast (-100 to 100)
 */
async function adjustContrast(inputPath, outputPath, level = 0) {
    const contrast = 1 + (level / 100);
    await sharp(inputPath)
        .linear(contrast, -(128 * contrast) + 128)
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply edge detection using convolution
 */
async function applyEdgeDetection(inputPath, outputPath) {
    await sharp(inputPath)
        .grayscale()
        .convolve({
            width: 3,
            height: 3,
            kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
        })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply vintage effect (sepia + vignette)
 */
async function applyVintage(inputPath, outputPath) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    await image
        .tint({ r: 112, g: 66, b: 20 })
        .modulate({ saturation: 0.5, brightness: 1.1 })
        .toFile(outputPath);

    return outputPath;
}

/**
 * Apply invert/negative effect
 */
async function applyInvert(inputPath, outputPath) {
    await sharp(inputPath)
        .negate()
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply pixelate effect
 */
async function applyPixelate(inputPath, outputPath, pixelSize = 10) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const smallWidth = Math.max(1, Math.floor(metadata.width / pixelSize));
    const smallHeight = Math.max(1, Math.floor(metadata.height / pixelSize));

    await image
        .resize(smallWidth, smallHeight, { kernel: 'nearest' })
        .resize(metadata.width, metadata.height, { kernel: 'nearest' })
        .toFile(outputPath);

    return outputPath;
}

/**
 * Apply anime/japanese style effect
 */
/**
 * Apply anime/japanese style effect
 */
async function applyAnimeStyle(inputPath, outputPath) {
    await sharp(inputPath)
        .modulate({ saturation: 1.8, brightness: 1.15 }) // Higher saturation
        .sharpen({ sigma: 2.5 }) // Stronger sharpen
        .gamma(0.9) // Slight gamma correction for "pop"
        // .linear(1.2, -(128 * 1.2) + 128) // Contrast increase (simplified below)
        .linear(1.3, -40) // Stronger contrast
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply cartoon style effect
 */
async function applyCartoonStyle(inputPath, outputPath) {
    await sharp(inputPath)
        .modulate({ saturation: 1.5, brightness: 1.1 })
        .median(7) // Higher median filter for "painted" look
        .blur(0.5) // Slight blur to smooth edges further
        .sharpen({ sigma: 1.5 })
        .linear(1.2, -20)
        .toFile(outputPath);
    return outputPath;
}

/**
 * Main processing function that routes to the appropriate filter
 */
/**
 * Main processing function that routes to the appropriate filter
 */
async function processImage(inputPath, processingTypes, intensity = null) {
    const ext = path.extname(inputPath);
    const finalOutputPath = inputPath.replace(ext, `_processed${ext}`);

    // Ensure processingTypes is an array
    const types = Array.isArray(processingTypes) ? processingTypes : [processingTypes];

    // We need a temp path for intermediate steps if there are multiple filters
    let currentInputPath = inputPath;
    let isIntermediate = false; // Flag to know if we need to cleanup temp files

    try {
        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            const isLast = i === types.length - 1;

            // For the last filter, write to final output. For others, write to a temp file (which is effectively just overwriting or creating a new temp)
            // Ideally, we'd pipe streams, but Sharp instances are easiest to chain by file or buffer.
            // Simplified approach: Re-read the file for each step. 
            // Better approach: Use Sharp's chainable methods if possible, but our architecture separates them.
            // So we will use a temporary output for intermediate steps.

            const stepOutputPath = isLast ? finalOutputPath : inputPath.replace(ext, `_temp_${Date.now()}_${i}${ext}`);

            switch (type) {
                case 'grayscale':
                    await applyGrayscale(currentInputPath, stepOutputPath);
                    break;
                case 'sepia':
                    await applySepia(currentInputPath, stepOutputPath);
                    break;
                case 'blur':
                    await applyBlur(currentInputPath, stepOutputPath, intensity || 5);
                    break;
                case 'sharpen':
                    await applySharpen(currentInputPath, stepOutputPath);
                    break;
                case 'brightness':
                    await adjustBrightness(currentInputPath, stepOutputPath, intensity || 20);
                    break;
                case 'contrast':
                    await adjustContrast(currentInputPath, stepOutputPath, intensity || 20);
                    break;
                case 'edge':
                    await applyEdgeDetection(currentInputPath, stepOutputPath);
                    break;
                case 'vintage':
                    await applyVintage(currentInputPath, stepOutputPath);
                    break;
                case 'invert':
                    await applyInvert(currentInputPath, stepOutputPath);
                    break;
                case 'pixelate':
                    await applyPixelate(currentInputPath, stepOutputPath, intensity || 10);
                    break;
                // AI features removed as per request
                default:
                    // Just copy if it's the only step, or key logic for "original"
                    if (types.length === 1 && type === 'original') {
                        const fs = require('fs');
                        fs.copyFileSync(currentInputPath, stepOutputPath);
                    } else if (currentInputPath !== stepOutputPath) {
                        const fs = require('fs');
                        fs.copyFileSync(currentInputPath, stepOutputPath);
                    }
                    break;
            }

            // Cleanup previous intermediate file
            if (isIntermediate && currentInputPath !== inputPath) {
                const fs = require('fs');
                try { fs.unlinkSync(currentInputPath); } catch (e) { }
            }

            // Update current input for next iteration
            currentInputPath = stepOutputPath;
            isIntermediate = !isLast;
        }

        return finalOutputPath;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

module.exports = {
    processImage,
    applyGrayscale,
    applySepia,
    applyBlur,
    applySharpen,
    adjustBrightness,
    adjustContrast,
    applyEdgeDetection,
    applyVintage,
    applyInvert,
    applyPixelate,
    applyAnimeStyle,
    applyCartoonStyle
};
