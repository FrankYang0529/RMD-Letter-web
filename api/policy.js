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

//check loggedin for student, need to check that user is in the correct subdomain
exports.studentLoggedIn = function (req, res, next) {
  if (req.user && req.user.subdomain == req.vhost[0]) {
    next();
  } else {
    req.logout();
    res.redirect('/users/login');
  }
}