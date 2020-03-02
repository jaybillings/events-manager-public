// A hook that adds a UUID to schema objects
// Run before CREATE

const uuidv1 = require('uuid/v1');

module.exports = (paramName = 'uuid') => {
  return async context => {
    if (context.data[0]) {
      context.data.forEach(row => {
        if (!row[paramName] || row[paramName] === '') {
          row[paramName] = uuidv1();
        }
      });
    } else {
      if (!context.data[paramName] || context.data[paramName] === '') {
        context.data[paramName] = uuidv1();
      }
    }
  };
};
