const assert = require('assert');
const app = require('../../src/app');

describe('\'pending-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-events');

    assert.ok(service, 'Registered the service');
  });
});
