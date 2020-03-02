const {disallow} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [ disallow('external')]
  },

  after: {
    all: []
  },

  error: {
    all: []
  }
};
