const routes = require('./routes');
const UsersHandler = require('./handlers');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
