/* eslint-disable no-console */

/**
 * Defines the vs-bd-tag-lookup schema.
 *
 * The `name` parameter is text and should be unique, since each BD classification may only map to a single VS tag. It
 * is linked via ID foreign key to the live tag that should be used in place of the classification. The UUID is also
 * included to prevent an additional lookup.
 *
 * @note We do not preserve BD classifications for export.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');

  table.string('bd_keyword_name').unique().notNullable();
  table.integer('vs_tag_id').notNullable();
  table.uuid('vs_tag_uuid').notNullable();

  table.foreign('vs_tag_id', 'fk_vs_tag_id').references('tags.id').onDelete('CASCADE');

  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'vs-bd-tag-lookup';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
