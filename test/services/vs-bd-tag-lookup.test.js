const assert = require('assert');
const app = require('../../src/app');

describe('\'vs-bd-tag-lookup\' service', () => {
  it('registered the service', () => {
    const service = app.service('vs-bd-tag-lookup');

    assert.ok(service, 'Registered the service');
  });
});
