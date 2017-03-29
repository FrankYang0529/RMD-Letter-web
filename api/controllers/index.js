const Projects = require('../models/projects'); // department data

/*          not    api             */

exports.index = (req, res, next) => {
  if (req.user) {  //   if user is logged in
    Projects.find().exec().then(function (school) {
      res.render('index', {
        log: 'logout',
        name: req.user.displayName,
        school
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  } else {
    Projects.find().exec().then(function (school) {
      res.render('index', {
        log: 'login',
        name: '',
        school
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  }
};

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
  Projects.findOne({ _id: req.params.projID }).exec().then(function (proj) {
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


/*                api                   */

exports.projectList = function (req, res, next) {
  Projects.find({ ownerID: req.user.username }).exec().then(function (projects) {
    const list = [];
    projects.forEach(function (proj) {
      list.push({ _id: proj._id, titleZh: proj.titleZh });
    });
    res.format({
      'application/json': function () {
        res.send(list);
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

exports.project = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec().then(function (user) {
    res.format({
      'application/json': function () {
        res.send({
          titleZh: user.titleZh,
          hbr: user.hbr,
          subdomainName: user.subdomainName,
          _id: req.params.projID
        });
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
  } else {
    new Projects({
      ownerID: req.user.username,
      titleZh: req.body.titleZh,
      hbr: req.body.hbr,
      subdomainName: req.body.subdomainName
    }).save(function (err) { //  存入db
      if (err) return next(err);
      res.redirect('/');  //  回到主畫面
    });
  }
};

exports.projHbrEdit = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec().then(function (proj) {
    if (req.body.hbr.length < 1) {    //  must to filled the blank
      /*
      res.render('projectEdit', {
        hbr: req.body.hbr,
        proj
      });
      */
    } else {
      proj.hbr = req.body.hbr;

      proj.save(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/projects/' + proj._id);  //  回到detail
        }
      });
    }
  })
  .catch(function (err) {
    console.log(err);
  });
};

exports.projTitleZhEdit = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec().then(function (proj) {
    if (req.body.titleZh.length < 1) {    //  must to filled the blank
      /*
      res.render('projectEdit', {
        titleZh: req.body.TitleZh,
        proj
      });
      */
    } else {
      proj.titleZh = req.body.titleZh;

      proj.save(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/projects/' + proj._id);  //  回到detail
        }
      });
    }
  })
  .catch(function (err) {
    console.log(err);
  });
};

exports.projTitleEdit = function (req, res, next) {
  Projects.findOne({ _id: req.params.projID }).exec().then(function (proj) {
    if (req.body.subdomainName.length < 1) {    //  must to filled the blank
      /*
      res.render('projectEdit', {
        subdomainName: req.body.subdomainName,
        proj
      });
      */
    } else {
      proj.subdomainName = req.body.subdomainName;

      proj.save(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/projects/' + proj._id);  //  回到detail
        }
      });
    }
  })
  .catch(function (err) {
    console.log(err);
  });
};

exports.projDelete = function (req, res, next){
  Projects.findOne({ _id: req.params.projID }).remove().exec().then(function (proj) {
    res.redirect('/projects');
  })
  .catch(function (err) {
    res.send('delete error');
  });
};