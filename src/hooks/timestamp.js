// A hook that adds timestamps to data objects
// Run before

module.exports = (name) => {
  return async context => {
    if (Array.isArray(context.data)) {
      context.data.forEach(row => {
        row[name] = new Date().valueOf();
      });
    } else {
      context.data[name] = new Date().valueOf();
    }
    return context;
  };
};
