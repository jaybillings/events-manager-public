const importFromFile = require('../../hooks/importFromXMLFile');
const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    create: [checkPermissions({roles: ['user', 'admin', 'super_user']}), importFromFile()],
  },

  after: {
    all: [],
    create: [],
  },

  error: {
    all: [],
    create: [],
  }
};
