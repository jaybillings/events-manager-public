/* eslint-disable no-console */

/**
 * Defines the pending-neighborhoods schema.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.uuid('uuid').unique().notNullable();
  table.string('name').notNullable();
  table.timestamps(true, true);
};

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'pending-neighborhoods';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
