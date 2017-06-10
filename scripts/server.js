/* eslint-disable import/no-extraneous-dependencies */
const good = require('good');
const hapi = require('hapi');
const pify = require('pify');
/* eslint-enable import/no-extraneous-dependencies */
const url = require('url');

const config = require('../config/index.json');
const generateMocks = require('./generate-mocks');

const mocks = generateMocks();
const server = new hapi.Server({
  debug: {
    request: '*',
  },
});
const register = pify(server.register.bind(server));
const parsedApiBase = url.parse(config.apiBase);

const registerRoute = (serv, options, next) => {
  serv.route({
    /**
     * @param {Object} request
     * @param {Function} reply
     */
    handler({ params }, reply) {
      const pageCount = parseInt(params.pageCount, 10);
      const pageNumber = parseInt(params.pageNumber, 10);
      const products = mocks.products;
      const start = (pageNumber - 1) * pageCount;

      return reply(Object.assign({}, mocks, {
        pageNumber,
        pageSize: pageCount,
        products: products.slice(
          start,
          Math.min(products.length, start + pageCount)
        ),
      }));
    },
    method: 'GET',
    path: '/{pageNumber}/{pageCount}',
  });
  next();
};

registerRoute.attributes = {
  name: 'products',
};

server.connection({
  host: parsedApiBase.hostname,
  port: parsedApiBase.port,
  routes: {
    cors: {
      credentials: true,
      origin: ['*'],
    },
  },
});

register({
  register: good,
  options: {
    reporters: {
      myConsoleReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }],
      }, {
        module: 'good-console',
      }, 'stdout'],
    },
  },
})
  .then(() => register(
    {
      register: registerRoute,
    },
    {
      routes: {
        prefix: `${parsedApiBase.pathname}/${config.apiKey}`,
      },
    }
  ))
  .then(() => pify(server.start.bind(server))())
  /* eslint-disable no-console */
  .then(
    () => console.log(`Server running at: ${server.info.uri}`),
    (error) => {
      console.error(error);
      process.exit(1);
    }
  );
  /* eslint-enable no-console */

module.exports = server;

