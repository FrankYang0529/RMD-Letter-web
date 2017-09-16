const Projects = require('../models/projects');// department data
const vhost = require('vhost');
const passport = require('../../auth/passport');
const Promise = require('bluebird');
const RecommendedPerson = require('../models/rmdPerson');
const StudentFormAnswer = require('../models/stuFormAns');
const inviteLetter = require('../models/inviteLetter');
const RmdltFormAnswer = require('../models/rmdltFormAns');
const passwordHash = require('password-hash');
const StudentForm = require('../models/stuForms');

// mail config
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'j70915',
    pass: 'lp331234567',
  },
});


/*               not api                   */
exports.index = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      res.format({
        default: () => {
          res.render('subdomains/index', {
            user: req.user,
            announcements: proj.announcement,
          });
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.announcementDetail = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      let target = {};
      proj.announcement.forEach((body) => {
        if (body._id == req.params.announcementID) {
          target = body;
        }
      });
      console.log(target);
      res.format({
        default: () => {
          res.render('subdomains/announcementDetail', {
            user: req.user,
            announcement: target,
          });
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.scheduleView = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return RmdltFormAnswer.find({ projID: proj._id, stuID: req.user._id }).exec();
    })
    .then((rmdlts) => {
      res.format({
        default: () => {
          res.render('subdomains/schedule', {
            user: req.user,
            rmdlts,
          });
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.recommendData = (req, res, next) => {
  const a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  const b = a.then((proj) => {
    return StudentFormAnswer.findOne({ stuID: req.user._id, projID: proj._id }).exec();
  });
  const c = a.then((proj) => {
    return StudentForm.findOne({ projID: proj._id }).exec();
  });

  return Promise.join(b, c, (answers, questions) => {
    res.format({
      default: () => {
        res.render('subdomains/recommendData', {
          user: req.user,
          answers,
          questions,
        });
      },
    });
  });
};

exports.addRmdPersonView = (req, res, next) => {
  res.format({
    default: () => {
      res.render('subdomains/addRmdPerson', {
        user: req.user,
      });
    },
  });
};

exports.studentFormView = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return StudentForm.findOne({ projID: proj._id }).exec();
    })
    .then((questions) => {
      res.format({
        default: () => {
          res.render('subdomains/studentForm', {
            user: req.user,
            questions,
          });
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateStudentFormView = (req, res, next) => {
  const a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  const b = a.then((proj) => {
    return StudentFormAnswer.findOne({ stuID: req.user._id, projID: proj._id }).exec();
  });
  const c = a.then((proj) => {
    return StudentForm.findOne({ projID: proj._id }).exec();
  });

  return Promise.join(b, c, (answers, questions) => {
    res.format({
      default: () => {
        res.render('subdomains/updateStudentForm', {
          user: req.user,
          answers,
          questions,
        });
      },
    });
  });
};

exports.registerPage = (req, res, next) => {
  res.format({
    default: () => {
      res.render('subdomains/register', {
      });
    },
  });
};

exports.login = (req, res, next) => {
  res.format({
    default: () => {
      res.render('subdomains/login', {
      });
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
  req.user.permissionID = req.body.permissionID;
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
      console.log(personList);
      res.format({
        default: () => {
          res.render('subdomains/recommendList', {
            user: req.user,
            personList: personList.person,
          });
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
      const person = {
        name: req.body.name,
        jobTitle: req.body.jobTitle,
        serviceUnit: req.body.serviceUnit,
        email: req.body.email,
        verification: false,
      };
      personList.person.push(person);
      return personList.save();
    })
    .then((personList) => {
      res.redirect('/projects/rmd-person'); // to all verificated recommend people list
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
    lt = `${lt}\n http://localhost:3000/rmd-person/${rmdPersonList.projID}/${req.params.rmdPersonID}/${req.user._id}`;

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
        req.user.sentLetter.push({ rmdPersonID: req.params.rmdPersonID, rmdPersonName: rmdPerson.name });
        req.user.save();
        res.redirect('/users/me');
      }
    });
  });
};

exports.getStudentForm = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return StudentForm.findOne({ projID: proj._id }).exec();
    })
    .then((questions) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(questions));
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getStudentFormAns = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return StudentFormAnswer.findOne({ projID: proj._id, stuID: req.user._id }).exec();
    })
    .then((ans) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(ans));
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.studentForm = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return new StudentFormAnswer({
        projID: proj._id,
        stuID: req.user._id,
        remark: '',
        answers: JSON.parse(req.body.answers),
      }).save();
    })
    .then((proj) => {
      res.redirect('/recommendData');
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateStudentForm = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => {
      return StudentFormAnswer.findOne({ stuID: req.user._id, projID: proj._id }).exec();
    })
    .then((answer) => {
      answer.answers = JSON.parse(req.body.answers);
      return answer.save();
    })
    .then((proj) => {
      res.redirect('/recommendData');
    })
    .catch((err) => {
      res.send(err);
    });
};