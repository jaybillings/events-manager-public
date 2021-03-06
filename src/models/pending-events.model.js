/* eslint-disable no-console */

/**
 * Defines the pending-events schema.
 *
 * The pending-events schema stores the UUIDs for the linked organization and linked venue. UUIDs are used so pending
 * events can be linked to pending or live schema.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.uuid('uuid').unique().notNullable();

  table.string('name').notNullable();
  table.date('start_date').notNullable();
  table.date('end_date').notNullable();
  table.uuid('venue_uuid');
  table.uuid('org_uuid');
  table.text('description');
  table.string('email');
  table.string('url');
  table.string('phone');
  table.string('hours');
  table.string('ticket_url');
  table.string('ticket_prices');
  table.string('ticket_phone');
  table.boolean('flag_ongoing');

  table.timestamps(true, true);
};

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'pending-events';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
