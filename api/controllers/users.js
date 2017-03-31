const Promise = require('bluebird');
const passport = require('../../auth/passport');
const Account = require('../models/account');

/*               not  api                 */

exports.index = function (req, res, next) {
  res.format({
    'default': function () {
      // TODO
      // res.render('register', {
      // });
    }
  });
};

exports.login = function (req, res, next) {
  res.format({
    'default': function () {
      /* TODO
      res.render('login', {
      });
      */
    }
  });
};


/*                  api                    */

exports.register = function (req, res, next) {
  Account.register(
    new Account({
      username: req.body.username,
      displayName: req.body.displayName,
      gravatar: req.body.gravatar,
      email: req.body.email
    }), req.body.password, (err, account) => {
      if (err) {
        console.log(err);
        if (err.name === 'MongoError') {
          return res.redirect('/users');
        }
        return res.redirect('/users');
      }
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
    });
};

exports.changePassword = function (req, res, next) {
  const setPassword = Promise.promisify(req.user.setPassword);
  setPassword.call(req.user, req.body.newPassword)
    .then(() => {
      return req.user.save();
    })
    .then((user) => {
      res.redirect('/');
    })
    .catch(function(err) {
      next(err);
    });

  // passport.authenticate('local', function (err, user, info) {
  //   if (err) { return next(err); }
  //   if (!user) { return res.redirect('/users/login'); }

  //   // req / res held in closure
  //   req.logIn(user, function (err) {
  //     if (err) { return next(err); }

  //     Account.findOne({ username: req.body.username }).then(function(sanitizedUser) {
  //         if (sanitizedUser) {
  //             sanitizedUser.setPassword(req.body.newPassword, function() {
  //                 sanitizedUser.save();
  //                 res.redirect('/');
  //             });
  //         } else {
  //             res.redirect('/users/login');
  //         }
  //     },function(err) {
  //         console.error(err);
  //     })
  //   });
  // })(req, res, next);
};

exports.profile = function (req, res, next) {
  /* find the user data from db */
  res.format({
    'application/json': function () {
      res.send({
        username: req.user.username,
        name: req.user.displayName,
        gravatar: req.user.gravatar,
        email: req.user.email
      });
    },
    'default': function () {
      /* TODO
      res.render('users', {
        username: req.user.username,
        name: req.user.displayName,
        gravatar: req.user.gravatar,
        email: req.user.email
      });
      */
    }
  });
};

exports.updateProfile = function (req, res, next) {
  /*    find the user data from db    */
  Account.findOne({ username: req.user.username }).exec().then(function (user) {
    if (user) {
      if (req.body.displayName.length < 1 || req.body.email.length < 1 || req.body.gravatar.length < 1) { // error handle
        /*
        res.render('users', {
          username: req.user.username,
          name: req.body.name,
          email: req.body.email,
          gravatar: req.body.gravatar,
          error: '*字號的填寫處不能為空!'
        });
        */
      } else {
        user.username = req.user.username;
        user.displayName = req.body.displayName;
        user.email = req.body.email;
        user.gravatar = req.body.gravatar;

        user.save(function (err) {
          if (err) {
            console.error('ERROR!');
          }
          res.redirect('/');//  回到主畫面
        });
      }
    }
  })
  .catch(function (err) {
    console.log(err);
  });
};



exports.auth = function (req, res, next) {
  // generate the authenticate method and pass the req/res
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/users/login'); }

    // req / res held in closure
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  })(req, res, next);
};

exports.loginForm = function (req, res, next) {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.logout = function (req, res, next) {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};