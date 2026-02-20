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

        // Using SDXL which is extremely stable and high-quality
        const output = await replicate.run(
            "stability-ai/sdxl:77fd0e4e5ee6162a04684b5c71a3372c3d04d80a379116e0339d1b032d8a5628",
            {
                input: {
                    image: base64Image,
                    prompt: "anime style portrait, cinematic lighting, watercolor texture, soft pastel colors, highly detailed, expressive anime eyes, smooth shading, clean line art, vibrant atmosphere",
                    refine: "expert_ensemble_refiner",
                    apply_watermark: false,
                    negative_prompt: "blurry, distorted anatomy, watermark, text, low resolution, artifacts, realistic, photograph",
                    prompt_strength: strength,
                    num_outputs: 1,
                    guidance_scale: 7.5,
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
