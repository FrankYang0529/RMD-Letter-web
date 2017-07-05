const Account = require('../api/models/stuAccount');
const passwordHash = require('password-hash');
const vhost = require('vhost');

exports.loggedIn = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

exports.sessionLoggedIn = function (req, res, next) {
  if (req.session.username && req.session.subdomain == req.vhost[0]) {
    Account.findOne({ subdomain: req.session.subdomain, username: req.session.username }).exec()
    .then(function (user) {
      if (req.session.password == user.password) {
        next();
      } else {
        req.session.destroy();
        res.redirect('users/login');
      }
    })
  } else {
    req.session.destroy();
    res.redirect('/users/login');
  }
}