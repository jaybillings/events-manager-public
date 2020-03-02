/* eslint-disable no-console */

/**
 * Defines the tags schema.
 *
 * Tags are transmitted by name only, without UUIDs, so these records exist primarily for linking purposes. A
 * new record is made when a new tag is encountered. For that reason, the name field should be unique.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.uuid('uuid').unique().notNullable();
  table.string('name').unique().notNullable();
  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'tags';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};
