// Initializes the `organizers` service on path `/organizers`
const createService = require('feathers-knex');
const createModel = require('../../models/organizers.model');
const hooks = require('./organizers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'organizers',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/organizers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('organizers');

  service.hooks(hooks);
};
