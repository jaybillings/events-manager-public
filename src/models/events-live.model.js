/* eslint-disable no-console */

/**
 * Defines the events-live schema.
 *
 * The events-live schema contains one foreign key -- the ID of the LIVE event that should be considered dropped.
 * The unique constraint is used because each event should have at most one row.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.integer('event_id').unique();
  table.foreign('event_id', 'fk_event_id').references('events.id').onDelete('CASCADE');
  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'events-live';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
