const Projects = require('../models/projects');// department data
const Account = require('../models/stuAccount');
const vhost = require('vhost');
//const passport = require('../../auth/stuPassport');
const Promise = require('bluebird');
const RecommendedPerson = require('../models/rmdPerson');
const StudentForm = require('../models/stuForms');
const StudentFormAnswer = require('../models/stuFormAns');
const inviteLetter = require('../models/inviteLetter');
const passwordHash = require('password-hash');

/*               not api                   */
exports.index = function (req, res, next) {
  console.log('user:' + req.session.username);
  console.log(req.vhost[0]);
  res.format({
    'default': function () {
      res.send(req.vhost[0]);
      // TODO
      // res.render('register', {
      // });
    }
  });
};


exports.userIndex = function (req, res, next) {
  res.format({
    'default': function () {
      res.send("user index");
      // TODO
      // res.render('register', {
      // });
    }
  });
};

exports.login = function (req, res, next) {
  res.format({
    'default': function () {
      res.send("login page");
      // TODO
      // res.render('register', {
      // });
    }
  });
};

/*                 api                    */

exports.register = function (req, res, next) {
  Account.find({ subdomain: req.vhost[0] }).exec()
    .then(function (account) {
      account.forEach(function (acc) {
        if (acc.email == req.body.email || acc.username == req.body.username) {
          throw err;
        }
      })

      new Account({
        username: req.body.username,
        displayName: req.body.displayName,
        password: passwordHash.generate(req.body.password),
        gravatar: req.body.gravatar,
        email: req.body.email,
        subdomain: req.vhost[0]
      }).save(function (err,user) {
        if (err) { res.send('err happened'); }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.displayName = user.displayName;
        req.session.password = user.password;
        req.session.subdomain = user.subdomain;
        req.session.gravatar = user.gravatar;
        res.redirect('/');
      });
    })
    .catch(function (err) {
      res.send('register error');
    })
};

exports.auth = function (req, res, next) {
  Account.findOne({ subdomain: req.vhost[0], username: req.body.username }).exec()
    .then(function (user) {
      if (user && passwordHash.verify(req.body.password, user.password)) {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.displayName = user.displayName;
        req.session.password = user.password;
        req.session.subdomain = user.subdomain;
        req.session.gravatar = user.gravatar;
        res.redirect('/');
      } else {
        res.redirect('/users/login');
      }
    })
};

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

exports.profile = function (req, res, next) {
  res.format({
    'application/json': function () {
      res.send(req.session);
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

  Account.findOne({ subdomain: req.vhost[0], username: req.session.username }).exec()
    .then(function (user) {
      user.email = req.body.email;
      user.displayName = req.body.displayName;
      user.gravatar = req.body.gravatar;

      return user.save();
    })
    .then(function (user) {
      req.session.email = req.body.email;
      req.session.displayName = req.body.displayName;
      req.session.gravatar = req.body.gravatar;

      res.redirect('/users/me');
    })
    .catch(function (user) {
      res.send('duplicate email');
    })
};

exports.changePassword = function (req, res, next) {
  if (req.body.password.length < 1) { // error handle
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

  Account.findOne({ subdomain: req.vhost[0], username: req.session.username }).exec()
    .then(function (user) {
      req.session.password = passwordHash.generate(req.body.password);
      user.password = req.session.password;

      return user.save();
    })
    .then(function (user) {
      res.redirect('/');
    })
};

exports.rmdPersonList = function (req, res, next) {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then(function (proj) {
      return RecommendedPerson.findOne({ projID: proj._id }).exec()
    })
    .then(function (personList) {
      const verificatedPersonList = personList.person.filter(function (person) {
        console.log(person);
        return person.verification == true;
      });

      res.format({
        'application/json': function () {
          res.send(verificatedPersonList);
        },
        'default': function () {
          /* TODO
          res.render('formDetail', {
            form
          });
          */
        }
      });
    })
    .catch(function (err) {
      res.send(err);
    });
}

exports.addRmdPerson = function (req, res, next) {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then(function (proj) {
      return RecommendedPerson.findOne({ projID: proj._id }).exec()
    })
    .then(function (personList) {
      personList.person.push(req.body.person);
      return personList.save();
    })
    .then(function(personList) {
      res.redirect('/'); //to all verificated recommend people list
    })
    .catch(function (err) {
      res.send(err);
    });
}

exports.sentLetter = function (req, res, next) {
  var a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  var b = a.then(function (proj) {
      return inviteLetter.findOne({ projID: proj._id }).exec();
    });
  var c = RecommendedPerson.findOne({ _id: rmdPersonID }).exec();
  return Promise.join(b, c, function(letter, rmdPerson) {
    const lt = letter.content;
    lt.replace(/\[@學生名稱\]/g,req.displayName);
    lt.replace(/\[@教授名稱\]/g,rmdPerson.name);
    /*
    sent lt to the email: rmdPerson.email
    */
  })
}

exports.studentForm = function (req, res, next) {
  new StudentFormAnswer(req.answer).save();
}