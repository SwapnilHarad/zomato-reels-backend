const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs'); // Add this import

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(fileBuffer, fileName) {
    try {
        // USE imagekit.files.upload AND wrap the buffer in toFile()
        const result = await imagekit.files.upload({
            file: await toFile(fileBuffer, fileName), 
            fileName: fileName,
        });
        return result;
    } catch (error) {
        console.error("ImageKit Service Error:", error);
        throw error; // Throw so the controller catches it
    }
}

module.exports = { uploadFile };