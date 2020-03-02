const addAllowedKeys = require('../../hooks/addAllowedKeys');
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [addAllowedKeys(), authenticate('apiKey')],
    get: []
  },

  after: {
    all: [],
    get: []
  },

  error: {
    all: [],
    get: []
  }
};
