const Projects = require('../models/projects');// department data
const vhost = require('vhost');
const passport = require('../../auth/passport');
const Promise = require('bluebird');
const RecommendedPerson = require('../models/rmdPerson');
const StudentFormAnswer = require('../models/stuFormAns');
const inviteLetter = require('../models/inviteLetter');
const passwordHash = require('password-hash');

// mail config
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your email account',
    pass: 'your email password',
  },
});


/*               not api                   */
exports.index = (req, res, next) => {
  console.log(`user: ${req.user}`);
  console.log(req.vhost[0]);
  res.format({
    default: () => {
      res.send(req.user);
      // TODO
      // res.render('register', {
      // });
    },
  });
};


exports.userIndex = (req, res, next) => {
  res.format({
    default: () => {
      res.send('user index');
      // TODO
      // res.render('register', {
      // });
    },
  });
};

exports.login = (req, res, next) => {
  res.format({
    default: () => {
      res.send('login page');
      // TODO
      // res.render('register', {
      // });
    },
  });
};

//   api

exports.auth = (req, res, next) => {
  // generate the authenticate method and pass the req/res
  passport.authenticate('stu-local-login', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/users/login'); }

    // req / res held in closure
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.loginForm = (req, res, next) => {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  });
};


exports.logout = (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  });
};

exports.profile = (req, res, next) => {
  res.format({
    'application/json': () => {
      res.send(req.user);
    },
    default: () => {
      /* TODO
      res.render('studentProfile', {
        username: req.user.username,
        name: req.user.displayName,
        email: req.user.email
      });
      */
    },
  });
};

exports.update_profile = (req, res, next) => {
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
    .then((user) => {
      res.redirect('/users/me');
    })
    .catch((err) => {
      res.send('duplicate email');
    });
};

exports.changePassword = (req, res, next) => {
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
    .then((user) => {
      res.redirect('/');
    })
    .catch((err) => {
      res.send('error');
    });
};

exports.rmdPersonList = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return RecommendedPerson.findOne({ projID: proj._id }).exec();
    })
    .then((personList) => {
      const verificatedPersonList = personList.person.filter((person) => {
        console.log(person);
        return person.verification === true;
      });

      res.format({
        'application/json': () => {
          res.send(verificatedPersonList);
        },
        default: () => {
          /* TODO
          res.render('formDetail', {
            form
          });
          */
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.addRmdPerson = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return RecommendedPerson.findOne({ projID: proj._id }).exec();
    })
    .then((personList) => {
      personList.person.push(req.body.person);
      return personList.save();
    })
    .then((personList) => {
      res.redirect('/'); // to all verificated recommend people list
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.sentLetter = (req, res, next) => {
  const a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  const b = a.then((proj) => {
    return inviteLetter.findOne({ projID: proj._id }).exec();
  });
  const c = a.then((proj) => {
    return RecommendedPerson.findOne({ projID: proj._id }).exec();
  });

  return Promise.join(b, c, (letter, rmdPersonList) => {
    let lt = letter.content;
    const rmdPerson = rmdPersonList.person.id(req.params.rmdPersonID); // get 'person' subdocument

    lt.replace(/\[@學生名稱\]/g, req.user.displayName);
    lt.replace(/\[@教授名稱\]/g, rmdPerson.name);
    lt = `${lt}\n http://localhost:3000/rmd-person/${rmdPersonList.projID}/${req.user._id}`;

    // mail config
    const mailOptions = {
      from: 'j70915@gmail.com',
      to: rmdPerson.email,
      subject: letter.title,
      text: lt,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        res.redirect('/users/me');
      }
    });
  });
};

exports.studentForm = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return new StudentFormAnswer({
        projID: proj._id,
        stuID: req.user._id,
        answers: req.body.answers,
      }).save();
    })
    .then((proj) => {
      res.redirect('/users/me');
    })
    .catch((err) => {
      res.send(err);
    });
};
