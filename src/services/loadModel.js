const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    const bucketName = process.env.GCS_BUCKET_NAME;
    const modelPath = process.env.MODEL_PATH;

    if (!bucketName || !modelPath) {
        throw new Error('GCS_BUCKET_NAME or MODEL_PATH is not defined in environment variables.');
    }

    const modelUrl = `gs://${bucketName}/${modelPath}`;

    try {
        console.log(`Attempting to load model from: ${modelUrl}`);
        const model = await tf.loadGraphModel(modelUrl);
        console.log('Model loaded successfully!');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

module.exports = loadModel;
