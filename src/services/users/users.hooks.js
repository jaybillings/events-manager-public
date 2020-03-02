const {authenticate} = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const commonHooks = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const accountService = require('../authmanagement/notifier');
const setTimestamp = require('../../hooks/timestamp');
const addRoleParams = require('../../hooks/addRoleParams');
const addUUIDParam = require('../../hooks/addUUIDParam');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const all = ['admin', 'super_user', 'user'];
const adminOnly = ['admin'];
// TODO: Restrict edits to own user for user and super_user

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt'), checkPermissions({roles: all})],
    get: [authenticate('jwt'), checkPermissions({roles: all})],
    create: [hashPassword(), verifyHooks.addVerification(), addUUIDParam('api_key'), setTimestamp('created_at'), setTimestamp('updated_at')],
    update: [commonHooks.disallow('external')],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          false,
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        ),
        hashPassword(),
        authenticate('jwt'),
        checkPermissions({roles: all}),
        setTimestamp('updated_at')
      )
    ],
    remove: [authenticate('jwt'), checkPermissions({roles: adminOnly})]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [addRoleParams()],
    get: [addRoleParams()],
    create: [
      context => {
        accountService(context.app).notifier('resendVerifySignup', context.result);
      },
      verifyHooks.removeVerification()
    ],
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
