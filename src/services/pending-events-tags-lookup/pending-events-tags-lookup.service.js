// Initializes the `pending-events-tags-lookup` service on path `/pending-events-tags-lookup`
const createService = require('feathers-knex');
const createModel = require('../../models/pending-events-tags-lookup.model');
const hooks = require('./pending-events-tags-lookup.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-events-tags-lookup',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pending-events-tags-lookup', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-events-tags-lookup');

  service.hooks(hooks);
};
