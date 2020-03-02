const setTimestamp = require('../../hooks/timestamp');
const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');

const all = ['admin', 'super_user', 'user'];

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [checkPermissions({roles: all})],
    get: [checkPermissions({roles: all})],
    create: [checkPermissions({roles: all}), setTimestamp('created_at'), setTimestamp('updated_at')],
    update: [checkPermissions({roles: all}), setTimestamp('updated_at')],
    patch: [checkPermissions({roles: all}), setTimestamp('updated_at')],
    remove: [checkPermissions({roles: all})]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
