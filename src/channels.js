module.exports = function (app) {
  if (!app.channel || typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult, {connection}) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      const user = connection.user;


      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Add admins to the admin channel
      if (user.isAdmin) {
        app.channel('admins').join(connection);
      }

      // Easily organize users by email and userid for things like messaging
      app.channel(`emails/${user.email}`).join(connection);
      app.channel(`userIds/${user.id}`).join(connection);
    }
  });

  app.on('logout', (authResult, {connection}) => {
    if (connection) {
      // When logging out, leave all channels before joining anonymous channel
      app.channel(app.channels).leave(connection);
      app.channel('anonymous').join(connection);
    }
  });

  // eslint-disable-next-line no-unused-vars
  app.publish((data, hook) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    //console.log('Publishing all events to authenticated users.'); // eslint-disable-line
    return app.channel('authenticated');
  });

  // eslint-disable-next-line no-unused-vars
  app.service('users').publish((data, hook) => {
    console.log('Publishing user events to admin channel.'); // eslint-disable-line
    return app.channel('admins');
  });

  // TODO: Non data related events should only be posted to admin
  // Here you can also add service specific event publishers
  // e..g the publish the `users` service `created` event to the `admins` channel
};
