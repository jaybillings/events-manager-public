module.exports = (schemaType) => {
  return async context => {
    // Venues
    if (schemaType === 'venues' && context.data.hood_uuid) {
      return context.app.service('neighborhoods').find({
        query: {
          uuid: context.data.hood_uuid,
          $select: ['id']
        }
      }).then(results => {
        if (results.total > 0) {
          context.data.hood_id = results.data[0].id;
          delete (context.data.hood_uuid);
        }
        // TODO: Make services emit own info
        context.app.service('importer').emit('status', {
          status: 'error',
          details: 'No ID could be found -- all child schema must be live before publishing.'
        });
        return context;
      });
    }
    // Events
    else if (schemaType === 'events' && context.data.venue_uuid && context.data.org_uuid) {
      return Promise.all([
        context.app.service('venues').find({
          query: {
            uuid: context.data.venue_uuid,
            $select: ['id']
          }
        }),
        context.app.service('organizers').find({
          query: {
            uuid: context.data.org_uuid,
            $select: ['id']
          }
        })
      ]).then(resultSet => {
        if (resultSet[0].total) {
          context.data.venue_id = resultSet[0].data[0].id;
          delete (context.data.venue_uuid);
        }
        if (resultSet[1].total) {
          context.data.org_id = resultSet[1].data[0].id;
          delete (context.data.org_uuid);
        }
        return context;
      });
    }
    // Events Tags Lookup
    else if (schemaType === 'events-tags-lookup' && context.data.tag_uuid) {
      return context.app.service('tags').find({
        query: {uuid: context.data.tag_uuid, $select: ['id']}
      }).then(results => {
        context.data.tag_id = results.data[0].id;
        delete (context.data.tag_uuid);
        return context;
      });
    } else {
      return context;
    }
  };
};
