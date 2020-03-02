// Initializes the `neighborhoods` service on path `/neighborhoods`
const createService = require('feathers-knex');
const createModel = require('../../models/neighborhoods.model');
const hooks = require('./neighborhoods.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'neighborhoods',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/neighborhoods', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('neighborhoods');

  service.hooks(hooks);
};
