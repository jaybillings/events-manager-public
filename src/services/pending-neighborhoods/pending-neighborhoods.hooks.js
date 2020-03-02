// Hooks that run for the pending-neighborhoods service
const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const validateSchema = require('../../hooks/validateSchema');
const setTimestamp = require('../../hooks/timestamp');
const addUUIDParam = require('../../hooks/addUUIDParam');

const all = ['admin', 'super_user', 'user'];

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [checkPermissions({roles: all})],
    get: [checkPermissions({roles: all})],
    create: [checkPermissions({roles: all}), addUUIDParam(), validateSchema('pending-neighborhoods'), setTimestamp('created_at'), setTimestamp('updated_at')],
    update: [checkPermissions({roles: all}), validateSchema('pending-neighborhoods'), setTimestamp('updated_at')],
    patch: [checkPermissions({roles: all}), validateSchema('pending-neighborhoods'), setTimestamp('updated_at')],
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
