/* eslint-disable no-console */

/**
 * Defines the pending-venues schema.
 *
 * The pending-venues schema stores the UUID for the linked neighborhood. UUIDs are used so pending venues can be linked
 * to pending or live schema.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.uuid('uuid').unique().notNullable();

  table.string('name').notNullable();
  table.uuid('hood_uuid');
  table.text('description');
  table.string('address_street');
  table.string('address_city');
  table.string('address_state');
  table.string('address_zip');
  table.string('email');
  table.string('url');
  table.string('phone');

  table.timestamps(true, true);
};

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'pending-venues';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
