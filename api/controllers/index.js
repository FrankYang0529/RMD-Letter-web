const Projects = require('../models/projects'); // department data

//  not  api

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