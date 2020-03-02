const assert = require('assert');
const app = require('../../src/app');

describe('\'exporter\' service', () => {
  it('registered the service', () => {
    const service = app.service('exporter');

    assert.ok(service, 'Registered the service');
  });
});
