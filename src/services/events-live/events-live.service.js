// Initializes the `events-live` service on path `/events-live`
const createService = require('feathers-knex');
const createModel = require('../../models/events-live.model');
const hooks = require('./events-live.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'events-live',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/events-live', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('events-live');

  service.hooks(hooks);
};
