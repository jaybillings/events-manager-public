// Initializes the `api` service on path `/api`
const createService = require('./api.class.js');
const hooks = require('./api.hooks');

module.exports = app => {

  const paginate = app.get('paginate');

  const options = {
    name: 'api',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api');

  service.hooks(hooks);
};
