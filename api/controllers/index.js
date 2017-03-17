const Department = require('../models/department'); // department data

exports.index = (req, res, next) => {
  if (req.user) {  //   if user is logged in
    Department.find().exec().then(function (school) {
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
    Department.find().exec().then(function (school) {
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