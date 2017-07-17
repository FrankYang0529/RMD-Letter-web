const Projects = require('../models/projects');// department data
const Account = require('../models/stuAccount');
const vhost = require('vhost');
const passport = require('../../auth/passport');
const Promise = require('bluebird');
const RecommendedPerson = require('../models/rmdPerson');
const StudentForm = require('../models/stuForms');
const StudentFormAnswer = require('../models/stuFormAns');
const inviteLetter = require('../models/inviteLetter');
const passwordHash = require('password-hash');

// mail config
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your email account',
    pass: 'your email password'
  }
});


/*               not api                   */
exports.index = function (req, res, next) {
  console.log('user: '+req.user);
  console.log(req.vhost[0]);
  res.format({
    'default': function () {
      res.send(req.user);
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

exports.auth = function (req, res, next) {
  // generate the authenticate method and pass the req/res
  passport.authenticate('stu-local-login', function (err, user, info) {
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
      res.send('duplicate email');
    });
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

  req.user.password = passwordHash.generate(req.body.password);
  req.user.save()
    .then(function (user) {
      res.redirect('/');
    })
    .catch(function (err) {
      res.send('error');
    });
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
  const a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  const b = a.then(function (proj) {
      return inviteLetter.findOne({ projID: proj._id }).exec();
    });
  const c = a.then(function (proj) {
      return RecommendedPerson.findOne({ projID: proj._id }).exec();
    })

  return Promise.join(b, c, function(letter, rmdPersonList) {
    const lt = letter.content;
    const rmdPerson = rmdPersonList.person.id(req.params.rmdPersonID); // get 'person' subdocument

    lt.replace(/\[@學生名稱\]/g,req.user.displayName);
    lt.replace(/\[@教授名稱\]/g,rmdPerson.name);

    // mail config
    const mailOptions = {
      from: 'j70915@gmail.com',
      to: rmdPerson.email,
      subject: letter.title,
      text: lt
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/users/me');
      }
    });
  })
}

exports.studentForm = function (req, res, next) {
  new StudentFormAnswer(req.answer).save();
}