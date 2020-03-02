const Ajv = require('ajv');
const ajv = new Ajv({coerceTypes: true});
require('ajv-keywords/keywords/transform')(ajv);

const schema = require('../schemas');

module.exports = (schemaType) => {
  return async context => {
    const schemaForContext = schema[schemaType];

    if (!schemaForContext) {
      return Promise.reject(`Improper schema type '${schemaType}' supplied for validation.`);
    }

    // Coerce flag_ongoing, if needed
    if (context.data.flag_ongoing) context.data.flag_ongoing = !!parseInt(context.data.flag_ongoing, 10);

    if (Array.isArray(context.data)) {
      context.data.forEach(row => {
        if (row.flag_ongoing) row.flag_ongoing = !!parseInt(context.data.flag_ongoing, 10);
      });
    }

    const isValid = ajv.validate(schemaForContext, context.data);

    if (!isValid) {
      return Promise.reject(ajv.errors);
    }

    return Promise.resolve(context);
  };
};
