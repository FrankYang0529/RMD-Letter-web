const Projects = require('../models/projects'); // department data
const StuForms = require('../models/stuForms');
const RmdLtForms = require('../models/rmdltForms');
const InviteLetter = require('../models/inviteLetter');
const RecommendedPerson = require('../models/rmdPerson');
const StuAccount = require('../models/stuAccount');
const StuFormAns = require('../models/stuFormAns');
const RmdLtFormAns = require('../models/rmdltFormAns');

// not  api
exports.createPage = (req, res, next) => {
  res.render('projectCreate', {
    title: '',
    body: '',
    error: '',
    subdomainName: '',
  });
};

exports.editPage = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      res.render('projectEdit', {
        titleZh: proj.titleZh,
        hbr: proj.hbr,
        proj,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//  api

exports.projectList = (req, res, next) => {
  Projects.find({ ownerID: req.user.username }).exec()
    .then((projs) => {
      res.format({
        'application/json': () => {
          res.send(projs);
        },
        default: () => {
          /* TODO
          res.render('projectList', {
            projects
          });
          */
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projDetail = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      res.format({
        'application/json': () => {
          res.send(proj);
        },
        default: () => {
          /* TODO
          res.render('projectDetail', {
            titleZh: user.titleZh,
            hbr: user.hbr,
            subdomainName: user.subdomainName,
            projID: req.params.projID
          });
          */
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projCreate = (req, res, next) => {
  if (req.body.titleZh.length < 1 || req.body.hbr.length < 1) {    //  error handle
    /*
    res.render('projectCreate', {
      titleZh: req.body.titleZh,
      hbr: req.body.hbr,
      subdomainName: req.body.subdomainName
    });
    */
  }

  new Projects({
    ownerID: req.user.username,
    titleZh: req.body.titleZh,
    hbr: req.body.hbr,
    subdomainName: req.body.subdomainName,
  }).save((err, proj) => { //  存入db
    if (err) return next(err);

    new InviteLetter({
      projID: proj._id,
      title: `${proj.titleZh}推薦信填寫`,
      content: '學生請老師填寫推薦信\n 謝謝!',
    }).save();

    new RecommendedPerson({
      projID: proj._id,
      person: [],
    }).save();

    return res.redirect('/');  //  回到主畫面
  });
};

exports.projHbrEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.hbr.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          hbr: req.body.hbr,
          proj
        });
        */
      }
      proj.hbr = req.body.hbr;

      return proj.save();
    })
    .then((proj) => {
      res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projTitleZhEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.titleZh.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          titleZh: req.body.TitleZh,
          proj
        });
        */
      }
      proj.titleZh = req.body.titleZh;

      return proj.save();
    })
    .then((proj) => {
      res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projSubdomainEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.subdomainName.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          subdomainName: req.body.subdomainName,
          proj
        });
        */
      }
      proj.subdomainName = req.body.subdomainName;

      return proj.save();
    })
    .then((proj) => {
      res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projDelete = (req, res, next) => {
  Projects.findById(req.params.projID).remove().exec()
    .then((proj) => {
      res.redirect('/projects');
    })
    .catch((err) => {
      res.send('delete error');
    });
};

exports.createStuForm = (req, res, next) => {
  new StuForms({
    projID: req.params.projID,
    title: req.body.title,
    questions: req.body.questions,
  }).save((err) => { //  存入db
    if (err) return next(err);
    return res.redirect(`/projects/${req.params.projID}/student-form`);
  });
};

exports.updateStuForm = (req, res, next) => {
  StuForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      form.title = req.body.title;
      form.questions = req.body.questions;

      return form.save();
    })
    .then((form) => {
      res.redirect(`/projects/${req.params.projID}/student-form`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.stuFormDetail = (req, res, next) => {
  StuForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      res.format({
        'application/json': () => {
          res.send(form);
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

exports.createRmdLtForm = (req, res, next) => {
  new RmdLtForms({
    projID: req.params.projID,
    title: req.body.title,
    questions: req.body.questions,
  }).save((err) => { //  存入db
    if (err) return next(err);
    return res.redirect(`/projects/${req.params.projID}/rmdletter-form`);
  });
};

exports.updateRmdLtForm = (req, res, next) => {
  RmdLtForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      form.title = req.body.title;
      form.questions = req.body.questions;

      return form.save();
    })
    .then((form) => {
      res.redirect(`/projects/${req.params.projID}/rmdletter-form`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.rmdLtFormDetail = (req, res, next) => {
  RmdLtForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      res.format({
        'application/json': () => {
          res.send(form);
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

exports.inviteltDetail = (req, res, next) => {
  InviteLetter.findOne({ projID: req.params.projID }).exec()
    .then((letter) => {
      res.format({
        'application/json': () => {
          res.send(letter);
        },
        default: () => {
          /* TODO
          res.render('letterDetail', {
            letter
          });
          */
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateInvitelt = (req, res, next) => {
  InviteLetter.findOne({ projID: req.params.projID }).exec()
    .then((letter) => {
      letter.title = req.body.title;
      letter.content = req.body.content;

      return letter.save();
    })
    .then((letter) => {
      res.redirect(`/projects/${req.params.projID}/invite-letter`);
    })
    .catch((err) => {  //  assume that will display invitation-letter's detail, so there can absolutly find one in database
      res.send(err);
    });
};

exports.rmdPersonList = (req, res, next) => {
  RecommendedPerson.findOne({ projID: req.params.projID }).exec()
    .then((personList) => {
      res.format({
        'application/json': () => {
          res.send(personList);
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
  RecommendedPerson.findOne({ projID: req.params.projID }).exec()
    .then((personList) => {
      personList.person.push(req.body.person);
      return personList.save();
    })
    .then((personList) => {
      res.redirect(`/projects/${req.params.projID}/rmd-person`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.modifyVerification = (req, res, next) => {
  RecommendedPerson.findOne({ projID: req.params.projID }).exec()
    .then((personList) => {
      personList.person.forEach((person) => {
        if (person._id === req.params.personID) {
          person.verification = req.body.verification;
        }
      });

      return personList.save();
    })
    .then((person) => {
      res.redirect(`/projects/${req.params.projID}/rmd-person`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.studentList = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => StuAccount.find({ subdomain: proj.subdomainName }).exec())
    .then((students) => {
      res.format({
        'application/json': () => {
          res.send(students);
        },
        default: () => {
          /* TODO
          res.render('formDetail', {
            form
          });
          */
        },
      });
    });
};

exports.filledStudentForm = (req, res, next) => {
  StuFormAns.findOne({ stuID: req.params.stuID, projID: req.params.projID }).exec()
    .then((ans) => {
      res.format({
        'application/json': () => {
          res.send(ans);
        },
        default: () => {
          /* TODO
          res.render('formDetail', {
            form
          });
          */
        },
      });
    });
};

exports.studentRmdLetter = (req, res, next) => {
  RmdLtFormAns.findOne({ stuID: req.params.stuID, projID: req.params.projID }).exec()
    .then((ans) => {
      res.format({
        'application/json': () => {
          res.send(ans);
        },
        default: () => {
          /* TODO
          res.render('formDetail', {
            form
          });
          */
        },
      });
    });
};
