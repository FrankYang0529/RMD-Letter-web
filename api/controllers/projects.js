const Projects = require('../models/projects'); // department data

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
  }).save(function (err) { //  存入db
    if (err) return next(err);
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