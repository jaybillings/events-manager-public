// API Key authentication strategy
// Retrieved from [FeathersJS Docs -- Recipe: Custom Auth Strategy](https://docs.feathersjs.com/guides/auth/recipe.custom-auth-strategy.html) on 2019-05-02

const Strategy = require('passport-custom/lib');

module.exports = opts => {
  return async context => {
    const verifier = (req, done) => {
      // Get the key from the request header supplied in opts
      const key = req.params.headers[opts.header];

      // Check if the key is in the allowed keys supplied in opts
      const match = req.params.acceptedKeys.includes(key);

      // User will default to false if no key is present
      const user = match ? 'api' : match;
      return done(null, user);
    };

    // Register the strategy in the app.passport instance
    context.passport.use('apiKey', new Strategy(verifier));

    // Add options for the strategy
    context.passport.options('apiKey', {});
  };
};
