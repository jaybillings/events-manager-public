// Initializes the `mailer` service on path `/mailer`
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const smptpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  const config = app.get('smtp');
  const options = {
    pool: true,
    host: config.host,
    port: config.port,
    secure: false,
    auth: {
      user: config.user,
      pass: config.pass
    }
  };

  // do not fail on invalid certs
  if (config.insecureTLS) options.tls = {rejectUnauthorized: false};

  app.use('/mailer', Mailer(smptpTransport(options)));

  const service = app.service('mailer');
  service.hooks(hooks);
};
