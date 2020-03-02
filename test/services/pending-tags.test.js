const assert = require('assert');
const app = require('../../src/app');

describe('\'pending-tags\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-tags');

    assert.ok(service, 'Registered the service');
  });
});
