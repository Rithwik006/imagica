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
        console.log('[AnimeService] Using model: 412392713/animeganv2');

        // Using AnimeGANv2 which is highly reliable for photo-to-anime
        const output = await replicate.run(
            "412392713/animeganv2:bd2cf1a84e18ad44c3d16f567092183fa40ae75715d3f2b63480b65257e4baab",
            {
                input: {
                    image: base64Image,
                    model_name: "Webtoon" // Other options: Shinkai, Hayao, Hosoda
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
