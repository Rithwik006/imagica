const axios = require('axios');
const fs = require('fs');

/**
 * Converts an image to anime style using Hugging Face's Inference API.
 * This is a free alternative to Replicate.
 * 
 * @param {string} imagePath - Local path to the uploaded image.
 * @returns {Promise<string>} - The local path or buffer for the generated image.
 */
async function convertToAnime(imagePath) {
    try {
        const HF_TOKEN = process.env.HF_TOKEN; // Optional but recommended
        const modelId = "TachibanaYoshino/AnimeGANv2"; // Popular and fast

        console.log('[AnimeService] Starting conversion using Hugging Face:', modelId);

        const imageData = fs.readFileSync(imagePath);

        const response = await axios({
            url: `https://router.huggingface.co/hf-inference/models/${modelId}`,
            method: 'POST',
            data: imageData,
            headers: {
                ...(HF_TOKEN ? { 'Authorization': `Bearer ${HF_TOKEN}` } : {}),
                'Content-Type': 'application/octet-stream'
            },
            responseType: 'arraybuffer'
        });

        // The response from Hugging Face is the image binary itself
        const resultBuffer = Buffer.from(response.data);

        // We'll return the buffer directly, and the route will handle saving it
        // Or we can save it to a temp file here. Let's return the buffer.
        console.log('[AnimeService] Conversion successful via Hugging Face.');
        return resultBuffer;
    } catch (error) {
        console.error('[AnimeService] Error during HF conversion:', error.message);
        if (error.response) {
            console.error('[AnimeService] HF Status:', error.response.status);
            console.error('[AnimeService] HF Data:', error.response.data.toString());
        }
        throw error;
    }
}

module.exports = { convertToAnime };

