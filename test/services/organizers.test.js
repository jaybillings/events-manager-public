const assert = require('assert');
const app = require('../../src/app');

describe('\'organizers\' service', () => {
  it('registered the service', () => {
    const service = app.service('organizers');

    assert.ok(service, 'Registered the service');
  });
});
