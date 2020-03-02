// A hook that adds parameters indicating user roles
// Run after FIND and GET

module.exports = () => {
  return async context => {
    const userPermissions = (context.result && context.result.permissions) ? context.result.permissions : null;

    if (userPermissions) {
      context.result.isAdmin = userPermissions.includes('admin');
      context.result.isSuperUser = userPermissions.includes('admin') || userPermissions.includes('super_user');
    }

    return context;
  };
};
