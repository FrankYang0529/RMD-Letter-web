const Passport = require('passport').Passport,
  stuPassport = new Passport();
const LocalStrategy = require('passport-local').Strategy;

const Projects = require('../api/models/projects');
const StuAccount = require('../api/models/stuAccount');
const Promise = require('bluebird');
const passwordHash = require('password-hash');


//stuPassport.use('stu-local-login', new LocalStrategy(StuAccount.authenticate()));

stuPassport.use('stu-local-login', new LocalStrategy({
      passReqToCallback : true
    },
    function (req, username, password, done) {
        StuAccount.findOne({ subdomain: req.vhost[0], username: req.body.username }).exec()
          .then(function (user) {
            if (passwordHash.verify(req.body.password, user.password)) {
              //req.session.id = user._id;
              //res.redirect('/');
              return done(null, user);
            } else {
              //res.redirect('user/login');
              return done(null, false, { message: 'Duplicate username at the same subdomain' });
            }
          })
  }
));

stuPassport.serializeUser(StuAccount.serializeUser());
stuPassport.deserializeUser(StuAccount.deserializeUser());

module.exports = stuPassport;