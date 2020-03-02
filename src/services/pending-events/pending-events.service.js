// Initializes the `pending-events` service on path `/pending-events`
const createService = require('feathers-knex');
const createModel = require('../../models/pending-events.model');
const hooks = require('./pending-events.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-events',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pending-events', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-events');

  service.hooks(hooks);
};
