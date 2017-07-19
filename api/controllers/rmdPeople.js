const RmdLtFormAnswer = require('../models/rmdltFormAns');

exports.fillInPage = function (req, res, next) {
  res.send('fill in page');
}

exports.fillIn = function (req, res, next) {
  new RmdLtFormAnswer({
    projID: req.params.projID,
    stuID: req.params.stuID,
    answers: req.body.answers
  }).save(function (err) { //  存入db
        if (err) return next(err);
        res.send('done');
  });
}