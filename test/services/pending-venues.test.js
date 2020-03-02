const assert = require('assert');
const app = require('../../src/app');

describe('\'pending-venues\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-venues');

    assert.ok(service, 'Registered the service');
  });
});
