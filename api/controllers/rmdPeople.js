const RmdLtFormAnswer = require('../models/rmdltFormAns');
const RmdLtForm = require('../models/rmdltForms');
const StudentFormAns = require('../models/stuFormAns');
const Promise = require('bluebird');
const Projects = require('../models/projects');
const StudentForm = require('../models/stuForms');

exports.fillInPage = (req, res, next) => {
  const a = Projects.findById(req.params.projID).exec();
  const b = RmdLtFormAnswer.findOne({ stuID: req.params.stuID, projID: req.params.projID, rmdPersonID: req.params.rmdPersonID }).exec();
  const c = RmdLtForm.findOne({ projID: req.params.projID }).exec();
  const d = StudentFormAns.findOne({ projID: req.params.projID, stuID: req.params.stuID }).exec();
  const e = StudentForm.findOne({ projID: req.params.projID}).exec();

  return Promise.join(a, b, c, d, e, (proj, answers, questions, studentAns, studentQues) => {
    res.format({
      default: () => {
        res.render('subdomains/rmdPersonView', {
          answers,
          proj,
          questions,
          studentAns,
          studentQues,
        });
      },
    });
  });
};

exports.getForm = (req, res, next) => {
  RmdLtForm.findOne({ projID: req.params.projID }).exec()
  .then((questions) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(questions));
  })
  .catch((err) => {
    res.send(err);
  });
};

exports.getFormAns = (req, res, next) => {
  RmdLtFormAnswer.findOne({ stuID: req.params.stuID, projID: req.params.projID, rmdPersonID: req.params.rmdPersonID }).exec()
  .then((answers) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(answers));
  })
  .catch((err) => {
    res.send(err);
  });
};

exports.fillIn = (req, res, next) => {
  new RmdLtFormAnswer({
    projID: req.params.projID,
    stuID: req.params.stuID,
    rmdPersonID: req.params.rmdPersonID,
    answers: JSON.parse(req.body.answers),
  }).save((err) => { //  存入db
    if (err) return next(err);
    return res.send('done');
  });
};

exports.updateAns = (req, res, next) => {
  RmdLtFormAnswer.findOne({ stuID: req.params.stuID, projID: req.params.projID, rmdPersonID: req.params.rmdPersonID }).exec()
  .then((answers) => {
    answers.answers = JSON.parse(req.body.answers);
    answers.save();
  })
  .catch((err) => {
    res.send(err);
  });
};