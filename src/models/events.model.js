/* eslint-disable no-console */

/**
 * Defines the events schema.
 *
 * The events schema stores the UUIDs for the linked organization and linked venue. UUIDs are used so events that are
 * published before the linked schema will retain their links.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.uuid('uuid').unique().notNullable();

  table.string('name').notNullable();
  table.date('start_date').notNullable();
  table.date('end_date').notNullable();
  table.uuid('venue_uuid').notNullable();
  table.uuid('org_uuid').notNullable();
  table.text('description');
  table.string('email');
  table.string('url');
  table.string('phone');
  table.string('hours');
  table.string('ticket_url');
  table.string('ticket_phone');
  table.string('ticket_prices');
  table.boolean('flag_ongoing');

  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'events';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
