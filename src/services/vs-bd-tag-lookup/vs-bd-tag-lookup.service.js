// Initializes the `vs-bd-tag-lookup` service on path `/vs-bd-tag-lookup`
const createService = require('feathers-knex');
const createModel = require('../../models/vs-bd-tag-lookup.model');
const hooks = require('./vs-bd-tag-lookup.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vs-bd-tag-lookup',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vs-bd-tag-lookup', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vs-bd-tag-lookup');

  service.hooks(hooks);
};
