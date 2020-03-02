// Initializes the `options` service on path `/options`
const createService = require('feathers-knex');
const createModel = require('../../models/options.model');
const hooks = require('./options.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'options',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/options', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('options');

  service.hooks(hooks);
};
