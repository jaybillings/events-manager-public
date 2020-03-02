const assert = require('assert');
const app = require('../../src/app');

describe('\'pending-organizers\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-organizers');

    assert.ok(service, 'Registered the service');
  });
});
