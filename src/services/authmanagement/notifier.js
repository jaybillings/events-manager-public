// From [Setting up Email Verification in FeathersJS via Hackernoon](https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2)

module.exports = (app) => {
  const clientPort = app.get('clientPort');
  const clientURL = `http://${app.get('host')}${clientPort ? ':' + clientPort : ''}`;
  const config = app.get('smtp');

  function getLink(type, hash) {
    // TODO: Add client URL into config
    return `${clientURL}/${type}/${hash}`;
  }

  function sendEmail(email) {
    return app.service('mailer').create(email)
      .catch(err => {
        console.error('Error sending email', err);
      });
  }

  return {
    notifier: (type, user, notifierOptions) => {
      let tokenLink, email;

      switch (type) {
      case 'resendVerifySignup': // sending the user the verification email
        tokenLink = getLink('verify', user.verifyToken);
        email = {
          from: config.from,
          to: user.email,
          subject: 'Visit Seattle Events Console - Verify Sign Up',
          html: '<p>An Events Console account has been created for this email address. Please click the following link to finish account creation:</p>'
            + `<p><a href="${tokenLink}">${tokenLink}</a></p>`
            + `<p>Didn't sign up? Please <a href="mailto:${config.supportAddress}">contact Visit Seattle support</a>.</p>`
        };
        return sendEmail(email);
      case 'verifySignup': // confirming verification
        tokenLink = getLink('verify', user.verifyToken);
        email = {
          from: config.from,
          to: user.email,
          subject: 'Visit Seattle Events Console -- Account Validation Confirmation',
          html: '<p>Thank you for verifying your email. Account creation is complete. Log in to your account at <a href="'
            + clientURL + '/login">' + clientURL + '/login</a>.</p>'
        };
        return sendEmail(email);
      case 'sendResetPwd':
        tokenLink = getLink('resetPassword', user.resetToken);
        email = {
          from: config.from,
          to: user.email,
          subject: 'Visit Seattle Events Console -- Reset Password',
          html: '<p>To reset your password, please click on the following link:'
          + `<a href="${tokenLink}">${tokenLink}</a></p>`
          + `<p>Didn't reset your password? Please <a href="mailto:${config.supportAddress}">contact Visit Seattle support</a>.</p>`
        };
        return sendEmail(email);
      case 'resetPwd':
        tokenLink = getLink('reset', user.resetToken);
        email = {
          from: config.from,
          to: user.email,
          subject: 'resetPwd',
          html: 'This needs a body'
        };
        return sendEmail(email);
      case 'passwordChange':
        email = {
          from: config.from,
          to: user.email,
          subject: 'Visit Seattle Events Console -- Password Change Successful',
          html: '<p>Your account password has been successfully changed. You may log in with the new password.</p>'
            + `<p>Didn't reset your password? Please <a href="mailto:${config.supportAddress}">contact Visit Seattle support</a>.</p>`
        };
        return sendEmail(email);
      case 'identityChange':
        tokenLink = getLink('verifyChanges', user.verifyToken);
        email = {};
        return sendEmail(email);
      default:
        break;
      }
    }
  };
};
