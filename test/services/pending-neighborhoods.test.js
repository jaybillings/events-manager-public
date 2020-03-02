const assert = require('assert');
const app = require('../../src/app');

describe('\'pending-neighborhoods\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-neighborhoods');

    assert.ok(service, 'Registered the service');
  });
});
