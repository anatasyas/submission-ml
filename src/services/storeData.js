const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    const db = new Firestore();
    const predictions = db.collection('predictions');
    await predictions.doc(id).set(data);
}

module.exports = storeData;
