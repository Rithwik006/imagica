const Replicate = require('replicate');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
    console.log('Fetching latest AnimeGANv2 version from Replicate...');
    try {
        const modelOwner = "412392713";
        const modelName = "animeganv2";
        const model = await replicate.models.get(modelOwner, modelName);
        const versions = await replicate.models.versions.list(modelOwner, modelName);

        if (versions && versions.results.length > 0) {
            const latestVersion = versions.results[0].id;
            console.log('Success! Latest version found.');
            console.log('Model:', modelOwner + "/" + modelName);
            console.log('Latest Version Hash:', latestVersion);
        } else {
            console.log('No versions found for this model.');
        }
    } catch (error) {
        console.error('Error fetching version:', error.message);
    }
}

test();
