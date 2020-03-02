// Initializes the `venues` service on path `/venues`
const createService = require('feathers-knex');
const createModel = require('../../models/venues.model');
const hooks = require('./venues.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'venues',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/venues', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('venues');

  service.hooks(hooks);
};
