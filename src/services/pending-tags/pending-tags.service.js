// Initializes the `pending-tags` service on path `/pending-tags`
const createService = require('feathers-knex');
const createModel = require('../../models/pending-tags.model');
const hooks = require('./pending-tags.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-tags',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pending-tags', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-tags');

  service.hooks(hooks);
};
