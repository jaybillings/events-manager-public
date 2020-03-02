/* eslint-disable no-console */

/**
 * Defines the events-deleted schema.
 *
 * The events-deleted schema contains one foreign key -- the ID of the LIVE event that should be considered dropped.
 * The unique constraint is used b/c there should only be one row per event.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.string('event_uuid').unique();
  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'events-deleted';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
