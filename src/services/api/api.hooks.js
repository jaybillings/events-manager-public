const addAllowedKeys = require('../../hooks/addAllowedKeys');
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [addAllowedKeys(), authenticate('apiKey')],
    find: []
  },

  after: {
    all: [],
    find: []
  },

  error: {
    all: [],
    find: []
  }
};
