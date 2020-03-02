const csvtojson = require('csvtojson');
const uuidv1 = require('uuid/v1');

const importInternal = {
  processData: async function (json, service) {
    const listingData = Object.assign({}, json); // Don't overwrite original data

    // Convert date string to UTC integer value
    if (listingData.start_date) listingData.start_date = new Date(listingData.start_date).valueOf();
    if (listingData.end_date) listingData.end_date = new Date(listingData.end_date).valueOf();

    // Coerce flag_ongoing to boolean
    if (listingData.flag_ongoing) listingData.flag_ongoing = !!parseInt(listingData.flag_ongoing);

    // Generate UUID, if needed
    if (!listingData.uuid) listingData.uuid = uuidv1();

    // Remove tags
    if (listingData.tags) delete (listingData.tags);

    return await service.create(listingData);
  },

  addTagAssociations: async function (id, tags, name, context) {
    const tagsArr = tags.split(',');
    const lookupService = context.app.service('pending-events-tags-lookup');
    const importerService = context.app.service('importer');

    tagsArr.forEach(tag => {
      try {
        lookupService.create({pending_event_id: id, tag_uuid: tag}).then(() => {
          importerService.emit('status', {status: 'info', details: `Tag association created for ${name}`});
        });
      } catch (err) {
        importerService.emit('status', {
          status: 'error',
          details: `Error creating tag association with uuid ${tag}: ${JSON.stringify(err)}`
        });
      }
    });
  }
};

module.exports = () => {
  return async context => {
    const fileToImport = context.params.fromMiddleware.filename;
    const schemaName = context.params.query.schema;

    if (typeof schemaName === 'undefined') {
      return Promise.reject('Incorrect path given. Must include schema.');
    }

    const serviceName = `pending-${schemaName}`;
    const ingestionService = context.app.service(serviceName);

    if (typeof fileToImport === 'undefined') {
      return Promise.reject('No file located while running importDataFromFile.');
    }

    // Grab tag

    csvtojson({ignoreEmpty: true})
      .fromFile(fileToImport)
      .subscribe((json) => {
        return new Promise((resolve) => {
          importInternal.processData(json, ingestionService, schemaName)
            .then(
              (results) => {
                context.service.emit('status', {status: 'success', details: `${json.name} ingested successfully.`});
                if (json.tags) {
                  importInternal.addTagAssociations(results.id, json.tags, results.name, context);
                }
                resolve();
              },
              // Resolve on error, but emit the status -- a single invalid row shouldn't stop the whole thing
              (errors) => {
                if (!errors[0]) errors = [errors];
                errors.forEach((err) => {
                  context.service.emit('status', {status: 'error', details: `${err.schemaPath} ${err.message}`});
                });
                resolve();
              }
            );
        });
      }, (err) => {
        return Promise.reject(`Error encountered while converting data to JSON: ${err.message}`);
      });

    return Promise.resolve(context);
  };
};
