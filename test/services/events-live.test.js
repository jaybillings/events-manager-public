const assert = require('assert');
const app = require('../../src/app');

describe('\'events-live\' service', () => {
  it('registered the service', () => {
    const service = app.service('events-live');

    assert.ok(service, 'Registered the service');
  });
});
