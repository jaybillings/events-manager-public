const assert = require('assert');
const app = require('../../src/app');

describe('\'importer\' service', () => {
  it('registered the service', () => {
    const service = app.service('importer');

    assert.ok(service, 'Registered the service');
  });
});
