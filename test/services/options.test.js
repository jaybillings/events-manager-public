const assert = require('assert');
const app = require('../../src/app');

describe('\'options\' service', () => {
  it('registered the service', () => {
    const service = app.service('options');

    assert.ok(service, 'Registered the service');
  });
});
