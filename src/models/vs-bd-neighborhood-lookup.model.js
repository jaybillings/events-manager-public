/* eslint-disable no-console */

/**
 * Defines the vs-bd-neighborhood-lookup model.
 *
 * The `name` parameter is text and should be unique, since each BD region may only map to a single VS neighborhood. It
 * is liked via ID foreign key to the live neighborhood that should be used in place of the region. The UUID is included
 * to prevent an additional lookup.
 *
 * @note We do not preserve BD regions for export.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');

  table.string('bd_region_name').unique().notNullable();
  table.integer('vs_hood_id').notNullable();
  table.uuid('vs_hood_uuid').notNullable();

  table.foreign('vs_hood_id', 'fk_vs_hood_id').references('neighborhoods.id').onDelete('CASCADE');

  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'vs-bd-neighborhood-lookup';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
