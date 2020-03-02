const assert = require('assert');
const app = require('../../src/app');

describe('\'neighborhoods\' service', () => {
  it('registered the service', () => {
    const service = app.service('neighborhoods');

    assert.ok(service, 'Registered the service');
  });
});
