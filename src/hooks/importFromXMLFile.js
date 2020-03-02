// Middleware that imports data from XML files sourced from BeDynamic

const fs = require('fs');
const xml2js = require('xml2js');

/**
 * `importInternal` contains code for importing data from properly formatted XML files.
 */
const importInternal = {
  specialEndDate: new Date('2121-01-01').valueOf(), // TODO: COE on VS needs to know new special date
  /**
   * `emitErrors` outputs errors to the client.
   *
   * @param {*} errors
   * @param service - The service that should emit the event.
   */
  emitErrors: function (errors, service) {
    if (!errors[0]) errors = [errors];

    for (let error of errors) {
      const responseObj = {status: 'error', rawError: error};
      if (error.message) responseObj.message = error.message;
      if (error.code) responseObj.code = error.code;
      service.emit('status', responseObj);
    }
  },
  /**
   * `processEvents` handles the importing of events.
   *
   * `processEvents` handles creating new events and parsing data from the events block.
   * Linked venues and organizers are added with their ID as-is, without checking to see if it is valid.
   * Linked tags are processed and associated via a function triggered here.
   *
   * @param {Array} events
   * @param context
   * @var {Array} tagsToCreate
   * @returns {Promise<tagsToCreate>} - Array of tuples, ie. [[{string} tagName, {string} result.uuid], ...]
   */
  processEvents: async function (events, context) {
    const pendingEventsService = context.app.service('pending-events');
    let tagsToCreate = [];
    let eventError = null;

    context.service.emit('status', {status: 'step_start', message: 'Event import starting...'});

    for (let eventRecord of events[0]['Event']) {
      try {
        const result = await this.createEvent(eventRecord, pendingEventsService);

        if (result.uuid && eventRecord['Classifications']) {
          eventRecord['Classifications'].forEach(row => {
            const tagName = row['Classification'][0]['$']['Name'];
            tagsToCreate.push([tagName, result.uuid]);
          });
        }
      } catch (error) {
        if (error.code !== 'SQLITE_CONSTRAINT') {
          // Assuming unique is the only constraint we'll hit, so these are silenced (or they will hit often)
          // TODO: Probably a better way to do this
          eventError = error;
          break;
        }
      }
    }

    if (eventError) return Promise.reject(eventError);

    context.service.emit('status', {status: 'step_success', message: 'Event import complete.'});

    return Promise.resolve(tagsToCreate);
  },
  /**
   * `processVenuesAndHoods` handles the importing of venues and neighborhoods.
   *
   * `processVenuesAndHoods` parses data from the venues block. It triggers a function that will create or find
   * the linked neighborhood, since this is only included as a name.
   *
   * @note Neighborhoods must be processed before venues are created, so venues will be created with the proper UUID.
   *
   * @param {Array} venues
   * @param context
   * @returns {Promise<*>}
   */
  processVenuesAndHoods: async function (venues, context) {
    const pendingVenuesService = context.app.service('pending-venues');
    let venuesToCreate = [];
    let hoodError = null;
    let linkedHoodUUID;

    context.service.emit('status', {status: 'step_start', message: 'Neighborhood import starting...'});

    for (let venueRecord of venues[0]['Venue']) {
      try {
        linkedHoodUUID = await this.fetchOrCreateNeighborhood(venueRecord['Neighborhood'][0], context);
      } catch (err) {
        hoodError = err;
        break;
      }

      const venueData = {
        uuid: venueRecord['$'] ? venueRecord['$']['Id'] : null,
        name: venueRecord['Name'] ? venueRecord['Name'][0] : null,
        description: venueRecord['Description'] ? venueRecord['Description'][0].trim() : null,
        email: venueRecord['Email'] ? venueRecord['Email'][0] : null,
        url: venueRecord['VenueUrl'] ? venueRecord['VenueUrl'][0] : null,
        phone: venueRecord['Phone'] ? venueRecord['Phone'][0] : null,
        hood_uuid: linkedHoodUUID || null
      };

      if (venueRecord['Address']) {
        venueData.address_street = venueRecord['Address'][0]['Address'] ? venueRecord['Address'][0]['Address'][0] : null;
        venueData.address_city = venueRecord['Address'][0]['City'] ? venueRecord['Address'][0]['City'][0] : null;
        venueData.address_state = venueRecord['Address'][0]['State'] ? venueRecord['Address'][0]['State'][0] : null;
        venueData.address_zip = venueRecord['Address'][0]['PostalCode'] ? venueRecord['Address'][0]['PostalCode'][0] : null;
      }

      venuesToCreate.push(venueData);
    }

    if (hoodError) return Promise.reject(hoodError);

    context.service.emit('status', {status: 'step_success', message: 'Neighborhood import complete.'});
    context.service.emit('status', {status: 'step_start', message: 'Venue import starting...'});

    return pendingVenuesService.create(venuesToCreate)
      .then(() => {
        context.service.emit('status', {status: 'step_success', message: 'Venue import complete.'});
      })
      .catch(err => {
        if (err.code !== 'SQLITE_CONSTRAINT') return Promise.reject(err);
        context.service.emit('status', {status: 'step_success', message: 'Venue import complete.'});
      });
  },
  /**
   * `processOrganizers` handles the importing of organizers (e.g. businesses).
   *
   * @param {Array} orgs
   * @param context
   * @returns {Promise<*>}
   */
  processOrganizers: async function (orgs, context) {
    const pendingOrgsService = context.app.service('pending-organizers');
    const orgsToCreate = [];

    context.service.emit('status', {status: 'step_start', message: 'Organizer import starting...'});

    for (let orgRecord of orgs[0]['Business']) {
      const orgData = {
        uuid: orgRecord['$'] ? orgRecord['$']['Id'] : null,
        name: orgRecord['Name'] ? orgRecord['Name'][0] : null,
        phone: orgRecord['Phone'] ? orgRecord['Phone'][0] : null,
        url: orgRecord['Url'] ? orgRecord['Url'][0] : null,
        description: orgRecord['Description'] ? orgRecord['Description'][0].trim() : null
      };

      orgsToCreate.push(orgData);
    }

    return pendingOrgsService.create(orgsToCreate)
      .then(() => {
        context.service.emit('status', {status: 'step_success', message: 'Organizer import complete.'});
      })
      .catch(err => {
        if (err.code !== 'SQLITE_CONSTRAINT') return Promise.reject(err);
        context.service.emit('status', {status: 'step_success', message: 'Organizer import complete.'});
      });
  },
  /**
   * `processTags` handles the importing of tags.
   *
   *  `processTags` handles the creation of pending tags as well as the creation of tag-event links.
   *  It takes in a crafted dataset, rather than an XML data block.
   *
   * @param {Array<Array>} tagMappings - Array of tuple arrays, ie. [[tagName, eventID], ...]
   * @param context
   * @returns {Promise<*>}
   */
  processTags: async function (tagMappings, context) {
    const eventsTagsLookupService = context.app.service('pending-events-tags-lookup');
    let tagNameUUIDMap = {};
    let lookupData = [];
    let tagError = null;

    context.service.emit('status', {status: 'step_start', message: 'Tag import starting...'});

    for (let [tagName, eventUUID] of tagMappings) {
      if (!tagNameUUIDMap[tagName]) {
        try {
          const tagUUID = await this.fetchOrCreateTag(tagName, context);
          tagUUID && (tagNameUUIDMap[tagName] = tagUUID);
        } catch (err) {
          if (err.code !== 'SQLITE_CONSTRAINT') {
            tagError = err;
            break;
          }
        }
      }

      lookupData.push({tag_uuid: tagNameUUIDMap[tagName], event_uuid: eventUUID});
    }

    if (tagError) return Promise.reject(tagError);

    return eventsTagsLookupService.create(lookupData)
      .then(() => {
        context.service.emit('status', {status: 'step_success', message: 'Tag import complete.'});
      })
      .catch(err => {
        if (err.code !== 'SQLITE_CONSTRAINT') return Promise.reject(err);
        context.service.emit('status', {status: 'step_success', message: 'Tag import complete.'});
      });
  },
  /**
   * `createEvent` creates a single pending event.
   *
   * @param eventRecord
   * @param service
   * @returns {Promise<*>}
   */
  createEvent: function (eventRecord, service) {
    const eventData = {
      uuid: eventRecord['$'] ? eventRecord['$']['Id'] : null,
      name: eventRecord['Name'] ? eventRecord['Name'][0] : null,
      start_date: eventRecord['StartDate'] ? new Date(eventRecord['StartDate'][0]).valueOf() : null,
      end_date: eventRecord['EndDate'] ? new Date(eventRecord['EndDate'][0]).valueOf() : this.specialEndDate,
      description: eventRecord['Description'] ? eventRecord['Description'][0].trim() : null,
      url: eventRecord['EventUrl'] ? eventRecord['EventUrl'][0] : null,
      phone: eventRecord['Phone'] ? eventRecord['Phone'][0] : null,
      hours: eventRecord['Time'] ? eventRecord['Time'][0] : null,
      ticket_prices: eventRecord['PriceRange'] ? eventRecord['PriceRange'][0] : null,
      flag_ongoing: eventRecord['Ongoing'] ? eventRecord['Ongoing'][0] === 'true' : false,
      venue_uuid: eventRecord['VenueId'] ? eventRecord['VenueId'][0] : null,
      org_uuid: eventRecord['BusinessId'] ? eventRecord['BusinessId'][0] : null
    };

    return service.create(eventData);
  },
  /**
   * `fetchOrCreateTag` attempts to find a preexisting tag. If one can't be found, it creates a new tag.
   *
   * @param {String} tagName
   * @param context
   * @returns {Promise<null|*>}
   */
  fetchOrCreateTag: async function (tagName, context) {
    const tagLookupService = context.app.service('vs-bd-tag-lookup');
    const tagsService = context.app.service('tags');
    const pendingTagsService = context.app.service('pending-tags');
    const query = {name: tagName.toLowerCase()};

    try {
      const bdLookupResult = await tagLookupService.find({query: {bd_keyword_name: tagName}});
      if (bdLookupResult.total) return bdLookupResult.data[0].vs_tag_uuid;

      const liveTagResult = await tagsService.find({query});
      if (liveTagResult.total) return liveTagResult.data[0].uuid;

      const pendingTagResult = await pendingTagsService.find({query});
      if (pendingTagResult.total) return pendingTagResult.data[0].uuid;

      const pendingTagCreateResult = await pendingTagsService.create(query);
      if (pendingTagCreateResult && pendingTagCreateResult !== {}) return pendingTagCreateResult.uuid; // TODO: Check this

      return null;
    } catch (err) {
      throw new Error(err);
    }
  },
  /**
   * `fetchOrCreateNeighborhood` attempts to find a preexisting neighborhood. If one can't be found, it creates
   * a new neighborhood.
   *
   * @param {String} hoodName
   * @param context
   * @returns {Promise<null|*>}
   */
  fetchOrCreateNeighborhood: async function (hoodName, context) {
    const hoodLookupService = context.app.service('vs-bd-neighborhood-lookup');
    const hoodsService = context.app.service('neighborhoods');
    const pendingHoodsService = context.app.service('pending-neighborhoods');
    const query = {name: hoodName};

    try {
      const bdLookupResult = await hoodLookupService.find({query: {bd_region_name: hoodName}});
      if (bdLookupResult.total) return bdLookupResult.data[0].vs_hood_id;

      const liveHoodResult = await hoodsService.find({query});
      if (liveHoodResult.total) return liveHoodResult.data[0].uuid;

      const pendingHoodResult = await pendingHoodsService.find({query});
      if (pendingHoodResult.total) return pendingHoodResult.data[0].uuid;

      const pendingHoodCreateResult = await pendingHoodsService.create(query);
      if (pendingHoodCreateResult && pendingHoodCreateResult !== {}) return pendingHoodCreateResult.uuid;

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = () => {
  return async context => {
    const fileToImport = context.params.fromMiddleware.filename;
    const parser = new xml2js.Parser();

    if (fileToImport === 'undefined') {
      throw new Error('No file located while running importDataFromFile.');
    }

    fs.readFile(fileToImport, (err, data) => {
      if (err) {
        throw new Error('Error when reading from file.');
      }

      parser.parseString(data, (err, result) => {
        if (err) return Promise.reject('Error when parsing XML data to string.');

        const importedData = result['ExportData']['ResultsDetails'][0]['BeDynamicExport'][0];

        importInternal
          .processOrganizers(importedData['Businesses'], context)
          .then(() => {
            return importInternal.processVenuesAndHoods(importedData['Venues'], context);
          })
          .then(() => {
            return importInternal.processEvents(importedData['Events'], context);
          })
          .then(tagData => {
            return importInternal.processTags(tagData, context);
          })
          .then(() => {
            context.service.emit('status', {status: 'success', message: 'Import complete.'});
          })
          .catch(err => {
            importInternal.emitErrors(err, context.service);
            context.service.emit('status', {
              status: 'fail',
              message: 'Import halted on error. Please resolve the error and try again.'
            });
          });
      });
    });

    return Promise.resolve(context);
  };
};
