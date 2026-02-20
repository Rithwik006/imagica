const Replicate = require('replicate');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
    console.log('Testing Replicate API Access...');
    console.log('Token:', process.env.REPLICATE_API_TOKEN ? 'Found' : 'Missing');

    try {
        // Just fetch model info to verify the token is valid and active
        const model = await replicate.models.get("stability-ai", "sdxl");
        console.log('Success! API is accessible.');
        console.log('Model Name:', model.name);
        console.log('Username:', model.owner);
    } catch (error) {
        console.error('Error during Replicate test:', error.message);
    }
}

test();
