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
const AWS = require('aws-sdk');
const fs = require('fs');
const flash = require('connect-flash');
const s3 = new AWS.S3();

// mail config
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your account',
    pass: 'your password',
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
            proj,
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
            proj,
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
  const projs = Projects.findOne({ subdomainName: req.vhost[0] }).exec();

  return projs
    .then((proj) => RmdltFormAnswer.find({ projID: proj._id, stuID: req.user._id }).exec())
    .then((rmdlts) => {
      res.format({
        default: () => {
          res.render('subdomains/schedule', {
            user: req.user,
            proj: projs.value(),
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
  const b = a.then((proj) => StudentFormAnswer.findOne({ stuID: req.user._id, projID: proj._id }).exec());
  const c = a.then((proj) => StudentForm.findOne({ projID: proj._id }).exec());

  return Promise.join(a, b, c, (proj, answers, questions) => {
    res.format({
      default: () => {
        res.render('subdomains/recommendData', {
          user: req.user,
          answers,
          proj,
          questions,
        });
      },
    });
  });
};

exports.addRmdPersonView = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
  .then((proj) => {
    res.format({
      default: () => {
        res.render('subdomains/addRmdPerson', {
          user: req.user,
          proj,
        });
      },
    });
  });
};

exports.studentFormView = (req, res, next) => {
  const projs = Projects.findOne({ subdomainName: req.vhost[0] }).exec();

  return projs
    .then((proj) => StudentForm.findOne({ projID: proj._id }).exec())
    .then((questions) => {
      res.format({
        default: () => {
          res.render('subdomains/studentForm', {
            user: req.user,
            proj: projs.value(),
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
  const b = a.then((proj) => StudentFormAnswer.findOne({ stuID: req.user._id, projID: proj._id }).exec());
  const c = a.then((proj) => StudentForm.findOne({ projID: proj._id }).exec());

  return Promise.join(a, b, c, (proj, answers, questions) => {
    res.format({
      default: () => {
        res.render('subdomains/updateStudentForm', {
          user: req.user,
          proj,
          answers,
          questions,
        });
      },
    });
  });
};

exports.registerPage = (req, res, next) => {
  let err = req.flash('error');
  if (err[0] === 'Missing credentials') {
    err[0] = '請確認所有欄位都已填寫完畢';
  }

  res.format({
    default: () => {
      res.render('subdomains/register', {
        err,
      });
    },
  });
};

exports.login = (req, res, next) => {
  res.format({
    default: () => {
      res.render('subdomains/login', {
        err: req.flash('error'),
      });
    },
  });
};

//   api

exports.auth = (req, res, next) => {
  // generate the authenticate method and pass the req/res
  passport.authenticate('stu-local-login', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error', '登入失敗');
      return res.redirect('/users/login'); 
    }

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
    default: () => {
      res.render('subdomains/profile', {
        user: req.user,
      });
    },
  });
};

exports.update_profile = (req, res, next) => {
  if (req.body.displayName.length < 1 || req.body.email.length < 1) { // error handle
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
  //  req.user.gravatar = req.body.gravatar;

  req.user.save()
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
  const projs = Projects.findOne({ subdomainName: req.vhost[0] }).exec();

  return projs
    .then((proj) => RecommendedPerson.findOne({ projID: proj._id }).exec())
    .then((personList) => {
      console.log(personList);
      res.format({
        default: () => {
          res.render('subdomains/recommendList', {
            user: req.user,
            proj: projs.value(),
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
    .then((proj) => RecommendedPerson.findOne({ projID: proj._id }).exec())
    .then((personList) => {
      const person = {
        name: req.body.name,
        jobTitle: req.body.jobTitle,
        serviceUnit: req.body.serviceUnit,
        email: req.body.email,
        phone: req.body.phone,
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

exports.letterNumber = (req, res, next) => {
  res.send({ number: req.user.sentLetter.length });
};

exports.sentLetter = (req, res, next) => {
  const a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  const b = a.then((proj) => inviteLetter.findOne({ projID: proj._id }).exec());
  const c = a.then((proj) => RecommendedPerson.findOne({ projID: proj._id }).exec());

  return Promise.join(b, c, (letter, rmdPersonList) => {
    let lt = letter.content;
    const rmdPerson = rmdPersonList.person.id(req.params.rmdPersonID); // get 'person' subdocument

    lt = lt.replace(/\[@學生名稱\]/g, req.user.displayName);
    lt = lt.replace(/\[@教授名稱\]/g, rmdPerson.name);
    lt = `${lt}\n http://localhost:3000/rmd-person/${rmdPersonList.projID}/${req.params.rmdPersonID}/${req.user._id}`;

    // mail config
    const mailOptions = {
      from: 'j70915@gmail.com',
      to: rmdPerson.email,
      subject: letter.title,
      text: lt,
    };
    console.log('send success');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        req.user.sentLetter.push({ rmdPersonID: req.params.rmdPersonID, rmdPersonName: rmdPerson.name, sendTime: new Date() });
        req.user.save();
      }
    });
  });
};

exports.getStudentForm = (req, res, next) => {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec()
    .then((proj) => StudentForm.findOne({ projID: proj._id }).exec())
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
    .then((proj) => StudentFormAnswer.findOne({ projID: proj._id, stuID: req.user._id }).exec())
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
      const answers = JSON.parse(req.body.answers);

      if (JSON.stringify(req.files) !== '{}') {
        answers.forEach((answer, index) => {
          if (answer.file_url === 'file') {
            const file = req.files[answer.question_id];
            const stream = fs.createReadStream(file.path);


            const params = {
              Bucket: 'rmd-letter',
              Key: `${proj._id}/${req.user._id}/${file.originalFilename}`, //  檔案名稱
              ACL: 'public-read',  //  檔案權限
              Body: stream,
              ContentType: file.type,
            };


            s3.upload(params).on('httpUploadProgress', (progress) => {
                //  上傳進度
              console.log(`${progress.loaded} of ${progress.total} bytes`);
            })
              .send((err, data) => {
                  // delete temp file
                fs.unlink(file.path, (error) => {
                  if (err) {
                    console.error(error);
                  }
                  console.log('Temp File Delete');
                });
                  //  上傳完畢或是碰到錯誤
                if (err) {
                  console.log(err);
                } else {
                  answers[index].file_url = `https://s3.us-east-2.amazonaws.com/rmd-letter/${proj._id}/${req.user._id}/${file.originalFilename}`;
                  answers[index].text = file.originalFilename;
                  return new StudentFormAnswer({
                    projID: proj._id,
                    stuID: req.user._id,
                    remark: '',
                    answers,
                  }).save();
                }
              });
          }
        });
      } else {
        return new StudentFormAnswer({
          projID: proj._id,
          stuID: req.user._id,
          remark: '',
          answers,
        }).save();
      }
    })
    .then((proj) => {
      res.redirect('/recommendData');
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateStudentForm = (req, res, next) => {
  const a = Projects.findOne({ subdomainName: req.vhost[0] }).exec();
  const b = a.then((proj) => StudentFormAnswer.findOne({ stuID: req.user._id, projID: proj._id }).exec());

  return Promise.join(a, b, (proj, answerList) => {
    const answers = JSON.parse(req.body.answers);
    if (JSON.stringify(req.files) !== '{}') {
      answers.forEach((answer, index) => {
        if (answer.file_url === 'file') {
          const file = req.files[answer.question_id];
          const stream = fs.createReadStream(file.path);

          const params = {
            Bucket: 'rmd-letter',
            Key: `${proj._id}/${req.user._id}/${file.originalFilename}`, //  檔案名稱
            ACL: 'public-read',  //  檔案權限
            Body: stream,
            ContentType: file.type,
          };

          s3.upload(params, (err) => { console.log('in'); console.log(err); }).on('httpUploadProgress', (progress) => {
            //  上傳進度
            console.log(`${progress.loaded} of ${progress.total} bytes`);
          })
            .send((err, data) => {
              // delete temp file
              fs.unlink(file.path, (error) => {
                if (err) {
                  console.error(error);
                }
                console.log('Temp File Delete');
              });
              //  上傳完畢或是碰到錯誤
              if (err) {
                console.log(err);
              } else {
                answers[index].file_url = `https://s3.us-east-2.amazonaws.com/rmd-letter/${proj._id}/${req.user._id}/${file.originalFilename}`;
                answers[index].text = file.originalFilename;
                answerList.answers = answers;
                return answerList.save();
              }
            });
        }
      });
    } else {
      answerList.answers = answers;
      return answerList.save();
    }
  })
  .then((proj) => {
    res.rend('OK');
  })
  .catch((err) => {
    res.send(err);
  });
};
