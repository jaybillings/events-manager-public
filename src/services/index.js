const api = require('./api/api.service.js');
const importer = require('./importer/importer.service.js');
const exporter = require('./exporter/exporter.service.js');
const options = require('./options/options.service.js');

const events = require('./events/events.service.js');
const venues = require('./venues/venues.service.js');
const organizers = require('./organizers/organizers.service.js');
const neighborhoods = require('./neighborhoods/neighborhoods.service.js');
const tags = require('./tags/tags.service.js');

const eventsLive = require('./events-live/events-live.service.js');
const eventsDropped = require('./events-deleted/events-deleted.service.js');
const eventsTagsLookup = require('./events-tags-lookup/events-tags-lookup.service.js');

const pendingEvents = require('./pending-events/pending-events.service.js');
const pendingOrganizers = require('./pending-organizers/pending-organizers.service.js');
const pendingVenues = require('./pending-venues/pending-venues.service.js');
const pendingNeighborhoods = require('./pending-neighborhoods/pending-neighborhoods.service.js');
const pendingTags = require('./pending-tags/pending-tags.service.js');
const users = require('./users/users.service.js');
const vsBdNeighborhoodLookup = require('./vs-bd-neighborhood-lookup/vs-bd-neighborhood-lookup.service.js');
const vsBdTagLookup = require('./vs-bd-tag-lookup/vs-bd-tag-lookup.service.js');
const pendingEventsTagsLookup = require('./pending-events-tags-lookup/pending-events-tags-lookup.service.js');
const mailer = require('./mailer/mailer.service.js');
const authmanagement = require('./authmanagement/authmanagement.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(events);
  app.configure(venues);
  app.configure(organizers);
  app.configure(tags);
  app.configure(eventsTagsLookup);
  app.configure(neighborhoods);
  app.configure(eventsLive);
  app.configure(eventsDropped);
  app.configure(api);
  app.configure(options);
  app.configure(exporter);
  app.configure(pendingEvents);
  app.configure(importer);
  app.configure(pendingOrganizers);
  app.configure(pendingVenues);
  app.configure(pendingNeighborhoods);
  app.configure(pendingTags);
  app.configure(users);
  app.configure(vsBdNeighborhoodLookup);
  app.configure(vsBdTagLookup);
  app.configure(pendingEventsTagsLookup);
  app.configure(mailer);
  app.configure(authmanagement);
};
