const passport = require('../../auth/passport');
const Account = require('../models/account');
const Promise = require('bluebird');

//    not api

exports.index = function (req, res, next) {
  res.format({
    default: () => {
      //TODO
      res.render('projectList', {
        log: 'logout',
        username: req.user.username,
        name: req.user.displayName,
        gravatar: req.user.gravatar,
        email: req.user.email
      });
    }
  });
};

exports.login = function (req, res, next) {
  res.format({
    default: () => {
      res.render('login', {
      });
    }
  });
};


//    api

exports.register = function (req, res, next) {
  const register = Promise.promisify(Account.register);
  register.call(Account, new Account({
    username: req.body.username,
    displayName: req.body.displayName,
    gravatar: "https://www.npmjs.com/package/gravatar",//req.body.gravatar,
    email: req.body.email,
    type: 'department',
  }), req.body.password)
    .then(function (account) {
      const auth = Promise.promisify(passport.authenticate('local'));
      return auth.call(passport, req, res);
    })
    .then(function (auth) {
      return req.session.save();
    })
    .then(function (session) {
      res.redirect('/users/login');
    })
    .catch(function (err) {
      console.log(err);
      res.redirect('/users/login');
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
};

exports.profile = function (req, res, next) {
  res.format({
    // 'application/json': function () {
    //   res.send(req.user);
    //},
    default: () => {
      //TODO
      res.render('userManage', {
        username: req.user.username,
        name: req.user.displayName,
        gravatar: req.user.gravatar,
        email: req.user.email
      });
    }
  });
};

exports.updateProfile = function (req, res, next) {
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
  }
  req.user.displayName = req.body.displayName;
  req.user.email = req.body.email;
  req.user.gravatar = req.body.gravatar;

  req.user.save()
    .then(function (user) {
      res.redirect('/users/me');
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
      res.redirect('/projects');
    });
  })(req, res, next);
};

exports.loginForm = function (req, res, next) {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/users/me');
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