/* eslint-disable no-console */

/**
 * Defines the users schema.
 *
 * @note The password field is optional because api-only accounts are not assigned passwords.
 *
 * @param table
 */
const schema = table => {
  table.increments('id');
  table.string('email').unique().notNullable();
  table.string('password');
  table.uuid('api_key').unique().notNullable();
  table.string('permissions');

  table.boolean('isVerified');
  table.string('verifyToken');
  table.string('verifyShortToken');
  table.date('verifyExpires');
  table.json('verifyChanges');
  table.string('resetToken');
  table.string('resetShortToken');
  table.date('resetExpires');

  table.timestamps(true, true);
};

module.exports = app => {
  const db = app.get('knexClient');
  const tableName = 'users';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};
