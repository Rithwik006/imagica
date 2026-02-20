const Replicate = require('replicate');
const dotenv = require('dotenv');
dotenv.config();

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
    console.log('Testing Replicate API...');
    console.log('Token:', process.env.REPLICATE_API_TOKEN ? 'Found' : 'Missing');

    try {
        // Attempting a very reliable model version (SDXL)
        // Using the current latest version for stability-ai/sdxl
        const model = "stability-ai/sdxl:77fd0e4e5ee6162a04684b5c71a3372c3d04d80a379116e0339d1b032d8a5628";

        console.log(`Calling model: ${model}`);

        const output = await replicate.run(
            model,
            {
                input: {
                    prompt: "a cat in anime style",
                    num_inference_steps: 25,
                    guidance_scale: 7.5,
                    num_outputs: 1
                }
            }
        );

        console.log('Success! Output:', output);
    } catch (error) {
        console.error('Error during Replicate test:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', await error.response.text());
        }
    }
}

test();
