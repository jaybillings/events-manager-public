/* eslint-disable no-console */

/**
 * Defines the events-tags-lookup schema.
 *
 * The events-tags-lookup schema represents the many-to-many connections between live events and live tags.
 * Since there are no foreign keys, these rows will need to be deleted manually on event or tag deletion.
 */

const schema = table => {
  table.increments('id');
  table.uuid('event_uuid').notNullable();
  table.uuid('tag_uuid').notNullable();

  table.unique(['event_uuid', 'tag_uuid']);

  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'pending-events-tags-lookup';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
