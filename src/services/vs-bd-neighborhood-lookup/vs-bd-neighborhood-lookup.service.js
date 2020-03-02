// Initializes the `vs-bd-neighborhood-lookup` service on path `/vs-bd-neighborhood-lookup`
const createService = require('feathers-knex');
const createModel = require('../../models/vs-bd-neighborhood-lookup.model');
const hooks = require('./vs-bd-neighborhood-lookup.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vs-bd-neighborhood-lookup',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vs-bd-neighborhood-lookup', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vs-bd-neighborhood-lookup');

  service.hooks(hooks);
};
