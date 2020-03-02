class exportRunner {
  constructor(app, lastUpdated) {
    const machineDate = lastUpdated ? Date.parse(lastUpdated) : null;
    this.genericQuery = machineDate ? {query: {updated_at: {$gte: machineDate}}, paginate: false}
      : {paginate: false};

    this.eventsService = app.service('events');
    this.venuesService = app.service('venues');
    this.orgsService = app.service('organizers');
    this.hoodsService = app.service('neighborhoods');
    this.tagsService = app.service('tags');
    this.eventsTagsLookupService = app.service('events-tags-lookup');
  }

  async exportAndCollate() {
    const events = await this.eventsService.find(this.genericQuery);
    const venues = await this.venuesService.find(this.genericQuery);
    const orgs = await this.orgsService.find(this.genericQuery);
    const hoods = await this.hoodsService.find(this.genericQuery);
    const tags = await this.tagsService.find(this.genericQuery);
    const lookups = await this.eventsTagsLookupService.find(this.genericQuery);

    const eventTagMap = {};

    lookups.forEach(row => {
      if (eventTagMap[row.event_uuid]) {
        eventTagMap[row.event_uuid].push(row.tag_uuid);
      } else {
        eventTagMap[row.event_uuid] = [row.tag_uuid];
      }
    });

    const eventData = events.map(event => {
      return Object.assign({}, event, {tags: eventTagMap[event.uuid]});
    });

    return {
      ResultDetails: {
        EventCount: eventData.length,
        VenueCount: venues.length,
        NeighborhoodCount: hoods.length,
        OrganizerCount: orgs.length,
        TagCount: tags.length
      },
      ExportData: {
        Events: eventData,
        Venues: venues,
        Organizers: orgs,
        Neighborhoods: hoods,
        Tags: tags
      }
    };
  }

  async exportAllData() {
    const events = await this.eventsService.find(this.genericQuery);
    const venues = await this.venuesService.find(this.genericQuery);
    const orgs = await this.orgsService.find(this.genericQuery);
    const hoods = await this.hoodsService.find(this.genericQuery);
    const tags = await this.tagsService.find(this.genericQuery);
    const lookups = await this.eventsTagsLookupService.find(this.genericQuery);

    return {
      ResultDetails: {
        EventCount: events.length,
        VenueCount: venues.length,
        NeighborhoodCount: hoods.length,
        OrganizerCount: orgs.length,
        TagCount: tags.length
      },
      ExportData: {
        Events: events,
        Venues: venues,
        Organizers: orgs,
        Neighborhoods: hoods,
        Tags: tags,
        EventTagLookup: lookups
      }
    };
  }
}

module.exports = exportRunner;
