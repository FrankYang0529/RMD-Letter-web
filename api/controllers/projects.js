const Projects = require('../models/projects'); // department data
const StuForms = require('../models/stuForms');
const RmdltForms = require('../models/rmdltForms');
const InviteLetter = require('../models/inviteLetter');

//  not  api
exports.createPage = function (req, res, next) {
  res.render('projectCreate', {
    title: '',
    body: '',
    error: '',
    subdomainName: '',
    error: ''
  });
};

exports.editPage = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec()
    .then(function (proj) {
      res.render('projectEdit', {
        titleZh: proj.titleZh,
        hbr: proj.hbr,
        proj
      });
    })
    .catch(function (err) {
      console.log(err);
    });
};

//  api

exports.projectList = function (req, res, next) {
  Projects.find({ ownerID: req.user.username }).exec()
    .then(function (proj) {
      res.format({
        'application/json': function () {
          res.send(proj);
        },
        'default': function () {
          /* TODO
          res.render('projectList', {
            projects
          });
          */
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.projDetail = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec()
    .then(function (proj) {
      res.format({
        'application/json': function () {
          res.send(proj);
        },
        'default': function () {
          /* TODO
          res.render('projectDetail', {
            titleZh: user.titleZh,
            hbr: user.hbr,
            subdomainName: user.subdomainName,
            projID: req.params.projID
          });
          */
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.projCreate = function (req, res, next) {
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
    subdomainName: req.body.subdomainName
  }).save(function (err,proj) { //  存入db
    if (err) return next(err);

    new InviteLetter({
      projID: proj._id,
      title: proj.titleZh + "推薦信填寫",
      content: "學生請老師填寫推薦信\n 謝謝!"
    }).save();

    res.redirect('/');  //  回到主畫面
  });



};

exports.projHbrEdit = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec()
    .then(function (proj) {
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
    .then(function (proj) {
      res.redirect('/projects/' + proj._id);  //  回到detail
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.projTitleZhEdit = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec()
    .then(function (proj) {
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
    .then(function (proj) {
      res.redirect('/projects/' + proj._id);  //  回到detail
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.projSubdomainEdit = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec()
    .then(function (proj) {
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
    .then(function (proj) {
      res.redirect('/projects/' + proj._id);  //  回到detail
    })
    .catch(function (err) {
      console.log(err);
    });
};

exports.projDelete = function (req, res, next){
  Projects.findOne({ _id: req.params.projID }).remove().exec()
    .then(function (proj) {
      res.redirect('/projects');
    })
    .catch(function (err) {
      res.send('delete error');
    });
};

exports.createStuForm = function (req, res, next) {
  new StuForms({
    projID: req.params.projID,
    title: req.body.title,
    questions: req.body.questions
  }).save(function (err) { //  存入db
    if (err) return next(err);
    res.redirect('/projects/'+req.params.projID+'/student-form');
  });
};

exports.updateStuForm = function (req, res, next) {
  StuForms.findOne({ projID: req.params.projID }).exec()
    .then(function (form) {
      form.title = req.body.title;
      form.questions = req.body.questions;

      return form.save();
    })
    .then(function(form) {
      res.redirect('/projects/'+req.params.projID+'/student-form');
    })
    .catch(function (err) {
      res.send(err);
    });
}

exports.stuFormDetail = function (req, res, next) {
  StuForms.findOne({ projID: req.params.projID }).exec()
    .then(function (form) {
      res.format({
        'application/json': function () {
          res.send(form);
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

exports.createRmdltForm = function (req, res, next) {
  new RmdltForms({
    projID: req.params.projID,
    title: req.body.title,
    questions: req.body.questions
  }).save(function (err) { //  存入db
    if (err) return next(err);
    res.redirect('/projects/'+req.params.projID+'/rmdletter-form');
  });
};

exports.updateRmdltForm = function (req, res, next) {
  RmdltForms.findOne({ projID: req.params.projID }).exec()
    .then(function (form) {
      form.title = req.body.title;
      form.questions = req.body.questions;

      return form.save();
    })
    .then(function(form) {
      res.redirect('/projects/'+req.params.projID+'/rmdletter-form');
    })
    .catch(function (err) {
      res.send(err);
    });
}

exports.rmdltFormDetail = function (req, res, next) {
  RmdltForms.findOne({ projID: req.params.projID }).exec()
    .then(function (form) {
      res.format({
        'application/json': function () {
          res.send(form);
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

exports.inviteltDetail = function (req, res, next) {
  InviteLetter.findOne({ projID:req.params.projID }).exec()
    .then(function(letter) {
      res.format({
        'application/json': function () {
          res.send(letter);
        },
        'default': function () {
          /* TODO
          res.render('letterDetail', {
            letter
          });
          */
        }
      });
    })
    .catch(function(err) {
      res.send(err);
    });
}

exports.updateInvitelt = function (req, res, next) {
  InviteLetter.findOne({ projID:req.params.projID }).exec()
    .then(function(letter) {
      letter.title = req.body.title;
      letter.content = req.body.content;

      return letter.save();
    })
    .then(function(letter) {
      res.redirect('/projects/'+req.params.projID+'/invite-letter');
    })
    .catch(function(err) {  //  assume that will display invitation-letter's detail, so there can absolutly find one in database
      res.send(err);
    });
}