// A hook that aggregates data for the API
// Run before FIND

class apiRunner {
  constructor(app) {
    this.eventsService = app.service('events');
    this.venuesService = app.service('venues');
    this.orgsService = app.service('organizers');
    this.hoodsService = app.service('neighborhoods');
    this.tagsService = app.service('tags');
    this.liveEventsService = app.service('events-live');
    this.deletedEventsService = app.service('events-deleted');
    this.eventsTagsLookupService = app.service('events-tags-lookup');
  }

  async fetchLiveEvents() {
    const liveEventResults = await this.liveEventsService.find({paginate: false});

    if (!liveEventResults || liveEventResults.total === 0) throw Error('No results returned from live events fetch.');

    return liveEventResults.map(row => {
      return row.event_id;
    });
  }

  async collateAllData(eventsResults) {
    let eventsList = [], venues = {}, orgs = {}, hoods = {};

    for (let event of eventsResults) {
      let venue = {}, org = {}, tags = [];

      if (!Object.keys(venues).includes(event.venue_uuid)) {
        const venueResults = await this.venuesService.find({query: {'uuid': event.venue_uuid, $limit: 1}});

        if (venueResults.total) {
          venue = venueResults.data[0];
          venues[venue.uuid] = venue;

          if (!Object.keys(hoods).includes(venue.hood_uuid)) {
            const hoodResults = await this.hoodsService.find({query: {'uuid': venue.hood_uuid, $limit: 1}});
            const hood = hoodResults.total ? hoodResults.data[0] : null;
            if (hood) hoods[hood.uuid] = hood;
          }

          venue.neighborhood = hoods[venue.hood_uuid].name;
        }
      }

      if (!Object.keys(org).includes(event.org_uuid)) {
        const orgResults = await this.orgsService.find({query: {'uuid': event.org_uuid, $limit: 1}});
        if (orgResults.total) {
          org = orgResults.data[0];
          orgs[org.uuid] = org;
        }
      }

      const lookupResults = await this.eventsTagsLookupService.find({query: {event_uuid: event.uuid}, paginate: false});
      for (let lookupRow of lookupResults) {
        const tagResults = await this.tagsService.find({query: {uuid: lookupRow.tag_uuid, $limit: 1}});
        if (tagResults.total) tags.push(tagResults.data[0].name);
      }

      if (tags) event.categories = tags;
      eventsList.push(event);
    }

    return {
      ExportDate: new Date().toISOString(),
      ResultDetails: {
        BusinessCount: Object.keys(orgs).length,
        VenueCount: Object.keys(venues).length,
        EventCount: eventsList.length,
        BeDynamicExport: {
          Businesses: Object.values(orgs),
          Venues: Object.values(venues),
          Events: eventsList
        }
      }
    };
  }

  async selectEventsByID(idList) {
    const fetchResults = await this.eventsService.find({query: {uuid: {$in: idList}}});

    if (!fetchResults || fetchResults.total === 0) throw new Error('Events fetch returned no data.');

    return this.collateAllData(fetchResults.data);
  }

  async selectEventsLive(lastUpdated = '') {
    let liveEventIDs;

    try {
      liveEventIDs = await this.fetchLiveEvents();
    } catch(err) {
      throw err;
    }

    let query = {
      id: {$in: liveEventIDs}
    };

    if (lastUpdated) query.updated_at = {$gte: Date.parse(lastUpdated)};

    const eventDetailsResults = await this.eventsService.find({
      query: query, paginate: false
    });

    if (!eventDetailsResults || eventDetailsResults.total === 0) {
      throw Error('No live events returned in event details fetch.');
    }

    return this.collateAllData(eventDetailsResults);
  }


  async selectEventsDropped(lastUpdated = '', returnStale = true) {
    let liveEventIDs;

    try {
      liveEventIDs = await this.liveEventsService.find({paginate: false});
    } catch(err) {
      throw err;
    }

    let eventsQuery = {$select: ['uuid', 'updated_at']};
    let deletionsQuery = {};

    if (returnStale && (returnStale.toString().toLowerCase() !== 'false')) {
      eventsQuery['$or'] = [{end_date: {$lt: Date.now()}}, {id: {$nin: liveEventIDs}}];
    } else {
      eventsQuery.id = {$nin: liveEventIDs};
    }

    if (lastUpdated) {
      eventsQuery.updated_at = {$gte: Date.parse(lastUpdated)};
      deletionsQuery.updated_at = {$gte: Date.parse(lastUpdated)};
    }

    const droppedEventResults = await this.eventsService.find({query: eventsQuery, paginate: false});
    const droppedResultData = droppedEventResults.map(row => {
      return {id: row.uuid, updated_at: row.updated_at};
    });

    const deletedEventResults = await this.deletedEventsService.find({query: deletionsQuery, paginate: false});
    const deletedResultData = deletedEventResults.map(row => {
      return {id: row.event_uuid, updated_at: row.updated_at};
    });

    const allResults = Object.assign({}, droppedResultData, deletedResultData);

    return {
      ExportDate: new Date().toISOString(),
      ResultDetails: {
        EventCount: droppedEventResults.length,
        BeDynamicExport: {
          Events: allResults
        }
      }
    };
  }
}

module.exports = apiRunner;

