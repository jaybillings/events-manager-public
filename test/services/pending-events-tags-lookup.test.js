const assert = require('assert');
const app = require('../../src/app');

describe('\'pending-events-tags-lookup\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-events-tags-lookup');

    assert.ok(service, 'Registered the service');
  });
});
