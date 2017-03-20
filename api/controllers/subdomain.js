const Projects = require('../models/projects');// department data
const vhost = require('vhost');

exports.index = function (req, res, next) {
  Projects.findOne({ subdomainName: req.vhost[0] }).exec().then(function (user) {
    if (user) {  //  if find the data , go to edit page
      res.render('school', {
        title: user.title,
        body: user.body,
        error: ''
      }); //  if find the data , go to edit page
    } else {
      res.send('error');
    }
  })
  .catch(function (err) {
    console.log(err);
  });
};