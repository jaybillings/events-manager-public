module.exports = (schemaName) => {
  return async context => {
    const queryParams = context.params.query || null;

    if (!queryParams) return context;

    // Determine if we need to JOIN
    // TODO: Make less brittle. This should look through the whole query to determine whether to join.
    /** @note Suggest using [feathers plus fastJoin](https://feathers-plus.github.io/v1/feathers-hooks-common/#fastjoin) **/

    const doSortJoin = queryParams['$sort'] && Object.keys(queryParams['$sort'])[0].startsWith('fk_');
    let doSearchJoin = false;

    if (queryParams['$or']) {
      for (let param of queryParams['$or']) {
        if (Object.keys(param)[0].startsWith('fk_')) {
          doSearchJoin = true;
          break;
        }
      }
    }

    if (!doSortJoin && !doSearchJoin) return context;

    // Update the query

    const params = context.params;
    const query = context.service.createQuery(params);

    switch (schemaName) {
    case 'events':
      query.leftJoin('fk_venues', 'events.venue_uuid', 'fk_venues.uuid');
      query.leftJoin('fk_orgs', 'events.org_uuid', 'fk_orgs.uuid');
      break;
    case 'pending-events':
      query.leftJoin(query => {
        query.select(['uuid', 'name']).from('venues')
          .union(query => {
            query.select(['uuid', 'name']).from('pending-venues');
          })
          .as('fk_venues');
      }, 'pending-events.venue_uuid', 'fk_venues.uuid');
      query.leftJoin(query => {
        query.select(['uuid', 'name']).from('organizers')
          .union(query => {
            query.select(['uuid', 'name']).from('pending-organizers');
          })
          .as('fk_orgs');
      }, 'pending-events.org_uuid', 'fk_orgs.uuid');
      break;
    case 'venues':
      query.leftJoin('fk_hoods', 'venues.hood_uuid', 'fk_hoods.uuid');
      break;
    case 'pending-venues':
      query.leftJoin(query => {
        query.select(['uuid', 'name']).from('neighborhoods')
          .union(query => {
            query.select(['uuid', 'name']).from('pending-neighborhoods');
          })
          .as('fk_hoods');
      }, 'pending-venues.hood_uuid', 'fk_hoods.uuid');
      break;
    }

    context.params.knex = query;
    return context;
  };
};
