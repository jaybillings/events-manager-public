const assert = require('assert');
const app = require('../../src/app');

describe('\'vs-bd-neighborhood-lookup\' service', () => {
  it('registered the service', () => {
    const service = app.service('vs-bd-neighborhood-lookup');

    assert.ok(service, 'Registered the service');
  });
});
