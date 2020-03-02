const assert = require('assert');
const app = require('../../src/app');

describe('\'events_tags_lookup\' service', () => {
  it('registered the service', () => {
    const service = app.service('events-tags-lookup');

    assert.ok(service, 'Registered the service');
  });
});
