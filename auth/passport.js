const Passport = require('passport').Passport,
  passport = new Passport();
const LocalStrategy = require('passport-local').Strategy;


const Account = require('../api/models/account');
const Projects = require('../api/models/projects');
const StuAccount = require('../api/models/stuAccount');
const Promise = require('bluebird');
const passwordHash = require('password-hash');


passport.use('department-local',new LocalStrategy(Account.authenticate()));


passport.use('stu-local-login', new LocalStrategy({
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

passport.use('stu-local-signup', new LocalStrategy({
      passReqToCallback : true
    }, //allows us to pass back the request to the callback
    function(req, username, password, done) {
      StuAccount.find({ subdomain: req.vhost[0] }).exec()
        .then(function (account) {
          account.forEach(function (acc) {
            if (acc.email == req.body.email || acc.username == req.body.username) {
              throw err;
            }
          })

          new StuAccount({
            username: req.body.username,
            displayName: req.body.displayName,
            password: passwordHash.generate(req.body.password),
            gravatar: req.body.gravatar,
            email: req.body.email,
            subdomain: req.vhost[0]
          }).save(function (err,user) {
            if (err) { res.send('err happened'); }

            return done(null, user);
          });
        })
        .catch(function (err) {
          return done(null, false, { message: 'Duplicate username at the same subdomain' });
        })
  }
));

passport.serializeUser(function(user, done) {
  if (user.hasOwnProperty('salt')) {
    var key = {
      id: user._id,
      type: 'department'
    }
    done(null, key);
  } else {
    var key = {
      id: user._id,
      type: 'student'
    }
    done(null, key);
  }
});

passport.deserializeUser(function(key, done) {
  console.log(key);
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