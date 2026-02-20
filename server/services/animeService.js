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

        // Using SDXL which supports img2img with 'image' and 'prompt_strength'
        const output = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e10c933b006c99470206af455339f4a13ad3b5b15312",
            {
                input: {
                    image: base64Image,
                    prompt: "anime style portrait, cinematic lighting, watercolor texture, soft pastel colors, highly detailed, expressive anime eyes, smooth shading, clean line art, vibrant atmosphere",
                    negative_prompt: "blurry, distorted anatomy, watermark, text, low resolution, artifacts, realistic, photograph",
                    prompt_strength: strength,
                    num_outputs: 1,
                    guidance_scale: 7.5,
                    num_inference_steps: 30
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
