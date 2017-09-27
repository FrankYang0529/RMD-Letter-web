const Projects = require('../models/projects'); // department data

//  not  api

exports.index = (req, res, next) => {
  if (req.user) {  //   if user is logged in
    res.redirect('/users/me');
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