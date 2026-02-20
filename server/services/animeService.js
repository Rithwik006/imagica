const Replicate = require('replicate');
const fs = require('fs');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Converts an image to anime style using Replicate's Img2Img model.
 * 
 * @param {string} imagePath - Local path to the uploaded image.
 * @param {number} strength - Denoising strength (0.3 - 0.8).
 * @returns {Promise<string>} - The URL of the generated anime image.
 */
async function convertToAnime(imagePath, strength = 0.55) {
    try {
        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error('REPLICATE_API_TOKEN is not defined in environment variables');
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        console.log('[AnimeService] Starting conversion. Strength:', strength);
        console.log('[AnimeService] Using model: stability-ai/sdxl');

        // Using a more recent stable SDXL version
        const output = await replicate.run(
            "stability-ai/sdxl:77fd0e4e5ee6162a04684b5c71a3372c3d04d80a379116e0339d1b032d8a5628",
            {
                input: {
                    image: base64Image,
                    prompt: "masterpiece, anime style, high quality, detailed anime eyes, vibrant colors, cinematic lighting, smooth lineart",
                    negative_prompt: "realistic, photograph, blurry, low quality, distorted, watermark",
                    prompt_strength: strength,
                    num_outputs: 1,
                    guidance_scale: 7.5,
                    num_inference_steps: 30
                }
            }
        );

        if (!output || (Array.isArray(output) && output.length === 0)) {
            throw new Error('Replicate returned an empty output');
        }

        const resultUrl = Array.isArray(output) ? output[0] : output;
        console.log('[AnimeService] Conversion successful. Output URL:', resultUrl);
        return resultUrl;
    } catch (error) {
        console.error('[AnimeService] Error during conversion:', error.message);
        if (error.response) {
            try {
                const errorBody = await error.response.text();
                console.error('[AnimeService] Replicate API Error Details:', errorBody);
            } catch (e) {
                console.error('[AnimeService] Could not parse error body');
            }
        }
        throw error;
    }
}

module.exports = { convertToAnime };
