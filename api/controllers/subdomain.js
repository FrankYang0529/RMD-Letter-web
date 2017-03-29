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
  Account.register(
    new Account({
      username: req.body.username,
      displayName: req.body.displayName,
      gravatar: req.body.gravatar,
      email: req.body.email,
      projID: req.vhost[0]
    }), req.body.password, (err, account) => {
      if (err) {
        console.log(err);
        if (err.name === 'MongoError') {
          return res.redirect('/users'); // email invalid
        }
        return res.redirect('/users');
      }
      passport.authenticate('stu-local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
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
      res.send({
        username: req.user.username,
        name: req.user.displayName,
        email: req.user.email
      });
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
  Account.findOne({ username: req.user.username }).exec().then(function (user) {
    if (user) {
      if (req.body.name.length < 1 || req.body.email.length < 1 || req.body.gravatar.length < 1) {
        res.format({
          'application/json': function () {
            res.send({
              username: req.user.username,
              name: req.user.displayName,
              email: req.user.email
            });
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
      } else {
        user.username = req.user.username;
        user.displayName = req.body.name;
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
