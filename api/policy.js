const Account = require('../api/models/stuAccount');
const passwordHash = require('password-hash');
const vhost = require('vhost');
const Projects = require('../api/models/projects');

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

exports.timeLimit = function (req, res, next) {
  console.log(new Date());
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
  .then((proj) => {
    proj.endTime.setDate(proj.endTime.getDate() + 1);
    if (proj.endTime < new Date()) {
      res.render('subdomains/outOfDate',{
        proj,
        user: req.user,
      });
    } else {
      console.log('OKOKOK');
      next();
    }
  })
  .catch((err) => {
    res.send(err);
  });
}