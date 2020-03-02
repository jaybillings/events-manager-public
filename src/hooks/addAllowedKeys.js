// A hook that adds allowed keys to opts
// Run before ALL

module.exports = () => {
  return async context => {
    const usersService = context.app.service('users');

    context.params.acceptedKeys = await usersService.find({}).then(results => {
      return results.data.map(row => {
        return row.api_key;
      });
    });

    return context;
  };
};
