const RmdLtFormAnswer = require('../models/rmdltFormAns');

exports.fillInPage = (req, res, next) => {
  res.send('fill in page');
};

exports.fillIn = (req, res, next) => {
  new RmdLtFormAnswer({
    projID: req.params.projID,
    stuID: req.params.stuID,
    rmdPersonID: req.params.rmdPersonID,
    answers: req.body.answers,
  }).save((err) => { //  存入db
    if (err) return next(err);
    return res.send('done');
  });
};
