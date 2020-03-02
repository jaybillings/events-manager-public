// Initializes the `importer` service on path `/importer`
const createService = require('./importer.class.js');
const hooks = require('./importer.hooks');
const fileUpload = require('express-fileupload');
const saveFileToServer = require('../../middleware/save-file-to-server');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const options = {
    name: 'importer',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/importer', fileUpload(), saveFileToServer(), createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('importer');

  service.hooks(hooks);
};
