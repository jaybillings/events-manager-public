/* eslint-disable no-console */

// options-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.

const schema = table => {
  table.increments();
  table.string('key');
  table.string('value');
};

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'options';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => schema(table))
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
