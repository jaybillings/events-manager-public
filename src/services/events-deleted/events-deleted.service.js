// Initializes the `events-deleted` service on path `/events-deleted`
const createService = require('feathers-knex');
const createModel = require('../../models/events-deleted.model');
const hooks = require('./events-deleted.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'events-deleted',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/events-deleted', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('events-deleted');

  service.hooks(hooks);
};
