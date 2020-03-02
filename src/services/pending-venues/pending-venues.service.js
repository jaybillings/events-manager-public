// Initializes the `pending-venues` service on path `/pending-venues`
const createService = require('feathers-knex');
const createModel = require('../../models/pending-venues.model');
const hooks = require('./pending-venues.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-venues',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pending-venues', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-venues');

  service.hooks(hooks);
};
