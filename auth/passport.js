const Passport = require('passport').Passport,
  passport = new Passport();
const LocalStrategy = require('passport-local').Strategy;

const Account = require('../api/models/account');
const Projects = require('../api/models/projects');
const StuAccount = require('../api/models/stuAccount');
const Promise = require('bluebird');
const passwordHash = require('password-hash');

// local strategy for department
passport.use('local',new LocalStrategy(Account.authenticate()));


// local strategy for student
passport.use('stu-local-login', new LocalStrategy({
    passReqToCallback : true
  },
  function (req, username, password, done) {
    StuAccount.findOne({ subdomain: req.vhost[0], username: req.body.username }).exec()
      .then(function (user) {
        if (user && passwordHash.verify(req.body.password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'login error' });
        }
      })
  }
));

passport.use('stu-local-signup', new LocalStrategy({
    passReqToCallback : true
  }, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    StuAccount.find({ subdomain: req.vhost[0] }).exec()
      .then(function (accounts) {
        accounts.forEach(function (account) {
          if (account.email === req.body.email) {
            throw '此信箱已經被使用過';
          } else if (account.username === req.body.username) {
            throw '此帳號已經被使用過';
          }
        })

        new StuAccount({
          username: req.body.username,
          displayName: req.body.displayName,
          password: passwordHash.generate(req.body.password),
          gravatar: req.body.gravatar,
          email: req.body.email,
          subdomain: req.vhost[0],
          type: 'student',
          sentLetter: [],
        }).save(function (err,user) {
            if (err) { return done(null, false, { message: '不符合email格式' }); }

            return done(null, user);
          });
        })
        .catch(function (err) {
          return done(null, false, { message: err });
        })
  }
));


passport.serializeUser(function(user, done) {
  done(null, {
    id: user._id,
    type: user.type
  });
});

passport.deserializeUser(function(key, done) {
  //console.log(key);
  if (key.type == 'department') {
    Account.findById(key.id, function (err, user) {
      done(err, user);
    });
  } else {
    StuAccount.findById(key.id, function (err, user) {
      done(err, user);
    });
  }
});

module.exports = passport;