// Hooks that run on the events service
const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const setTimestamp = require('../../hooks/timestamp');
const validateSchema = require('../../hooks/validateSchema');
const queryWithJoin = require('../../hooks/queryWithJoin');
const addUUIDParam = require('../../hooks/addUUIDParam');

// TODO: On create/update/patch, normalize timezone
const all = ['admin', 'super_user', 'user'];
const elevated = ['admin', 'super_user'];

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [checkPermissions({roles: all}), queryWithJoin('events')],
    get: [checkPermissions({roles: all})],
    create: [checkPermissions({roles: elevated}), addUUIDParam(), validateSchema('events'), setTimestamp('created_at'), setTimestamp('updated_at')],
    update: [checkPermissions({roles: elevated}), validateSchema('events'), setTimestamp('updated_at')],
    patch: [checkPermissions({roles: elevated}), validateSchema('events'), setTimestamp('updated_at')],
    remove: [checkPermissions({roles: elevated})]
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
