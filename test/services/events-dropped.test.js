const assert = require('assert');
const app = require('../../src/app');

describe('\'events-deleted\' service', () => {
  it('registered the service', () => {
    const service = app.service('events-deleted');

    assert.ok(service, 'Registered the service');
  });
});
