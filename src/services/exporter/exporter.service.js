// Initializes the `exporter` service on path `/exporter`
const createService = require('./exporter.class.js');
const hooks = require('./exporter.hooks');

module.exports = app => {

  const paginate = app.get('paginate');

  const options = {
    name: 'exporter',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/exporter', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('exporter');

  service.hooks(hooks);
};
