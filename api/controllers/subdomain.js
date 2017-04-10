const Projects = require('../models/projects');// department data
const Account = require('../models/stuAccount');
const vhost = require('vhost');
const passport = require('../../auth/stuPassport');


/*               not api                   */

exports.index = function (req, res, next) {
  console.log('user:' + req.user);
  console.log(req.vhost[0]);
  Projects.findOne({ subdomainName: req.vhost[0] }).exec().then(function (user) {
    if (user) {
      if (req.user) {
        res.render('school', {
          titleZh: user.titleZh,
          hbr: user.hbr,
          log: 'logout',
          displayName: req.user.displayName
        });
      } else {
        res.render('school', {
          titleZh: user.titleZh,
          hbr: user.hbr,
          log: 'login',
          displayName: ''
        });
      }
    } else {
      res.send('error');
    }
  })
  .catch(function (err) {
    res.send(err);
  });
};

exports.userIndex = function (req, res, next) {
  res.render('stuRegister', {
  });
};

exports.login = function (req, res, next) {
  res.render('login', {
    user: 'stu'
  });
};

/*                 api                    */

exports.register = function (req, res, next) {
  const register = Promise.promisify(Account.register);
  register.call(Account, new Account({
    username: req.body.username,
    displayName: req.body.displayName,
    gravatar: req.body.gravatar,
    email: req.body.email,
    projID: req.vhost[0]
  }), req.body.password)
    .then(function (account) {
      const auth = Promise.promisify(passport.authenticate('stu-local'));
      return auth.call(passport, req, res);
    })
    .then(function (auth) {
      return req.session.save();
    })
    .then(function (session) {
      res.redirect('/');
    })
    .catch(function (err) {
      console.log(err);
      res.redirect('/users');
    });
};

exports.auth = function (req, res, next) {
  // generate the authenticate method and pass the req/res
  passport.authenticate('stu-local', function (err, user, info) {
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

exports.profile = function (req, res, next) {
  res.format({
    'application/json': function () {
      res.send(req.user);
    },
    'default': function () {
      /* TODO
      res.render('studentProfile', {
        username: req.user.username,
        name: req.user.displayName,
        email: req.user.email
      });
      */
    }
  });
}

exports.update_profile = function (req, res, next) {
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