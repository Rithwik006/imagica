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
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        console.log('[AnimeService] Starting conversion with strength:', strength);

        // Using Anything-V3-Better-VAE which is a standard for anime
        const output = await replicate.run(
            "cjwbw/anything-v3-better-vae:09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65",
            {
                input: {
                    image: base64Image,
                    prompt: "anime style portrait, cinematic lighting, highly detailed, expressive anime eyes, smooth shading, vibrant atmosphere",
                    negative_prompt: "blurry, distorted anatomy, watermark, text, low resolution, artifacts",
                    strength: strength,
                    num_outputs: 1,
                    guidance_scale: 9,
                    num_inference_steps: 50
                }
            }
        );

        if (!output || !output[0]) {
            throw new Error('No output generated from Replicate');
        }

        console.log('[AnimeService] Conversion successful:', output[0]);
        return output[0];
    } catch (error) {
        console.error('[AnimeService] Error:', error.message);
        throw error;
    }
}

module.exports = { convertToAnime };
