// Initializes the `pending-organizers` service on path `/pending-organizers`
const createService = require('feathers-knex');
const createModel = require('../../models/pending-organizers.model');
const hooks = require('./pending-organizers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-organizers',
    events: ['status'],
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pending-organizers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-organizers');

  service.hooks(hooks);
};
