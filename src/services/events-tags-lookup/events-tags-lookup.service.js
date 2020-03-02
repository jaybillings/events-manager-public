// Initializes the `events_tags_lookup` service on path `/events-tags-lookup`
const createService = require('feathers-knex');
const createModel = require('../../models/events-tags-lookup.model');
const hooks = require('./events-tags-lookup.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'events-tags-lookup',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/events-tags-lookup', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('events-tags-lookup');

  service.hooks(hooks);
};
