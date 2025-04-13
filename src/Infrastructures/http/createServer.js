const Hapi = require('@hapi/hapi');
const config = require('../../Commons/config');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const ClientError = require('../../Commons/exceptions/ClientError');

const createServer = async (container) => {
  const server = Hapi.Server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug
  });

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: translatedError.message
        }).code(translatedError.statusCode);
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      return h.response({
        status: 'error',
        message: 'an error occured on our server side.',
      }).code(500);
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;