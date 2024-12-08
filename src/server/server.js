require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;
        if (response.isBoom) {
            if (response.output.statusCode === 413) {
                return h.response({
                    status: 'fail',
                    message: 'Payload content length greater than maximum allowed: 1000000',
                }).code(413);
            }
            if (response.output.statusCode === 400) {
                return h.response({
                    status: 'fail',
                    message: 'Terjadi kesalahan dalam melakukan prediksi',
                }).code(400);
            }
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();
