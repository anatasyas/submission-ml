const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] > 0.5 ? score[0] : 1 - score[0];

        const result = confidenceScore > 0.5 ? 'Cancer' : 'Non-cancer';
        const suggestion = result === 'Cancer' 
            ? 'Segera periksa ke dokter!' 
            : 'Penyakit kanker tidak terdeteksi.';

        return { result, confidenceScore, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
