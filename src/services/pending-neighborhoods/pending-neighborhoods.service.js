// Initializes the `pending-neighborhoods` service on path `/pending-neighborhoods`
const createService = require('feathers-knex');
const createModel = require('../../models/pending-neighborhoods.model');
const hooks = require('./pending-neighborhoods.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-neighborhoods',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pending-neighborhoods', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-neighborhoods');

  service.hooks(hooks);
};
