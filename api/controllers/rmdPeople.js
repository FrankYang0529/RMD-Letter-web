const RmdLtFormAnswer = require('../models/rmdltFormAns');
const RmdLtForm = require('../models/rmdltForms');
const StudentFormAns = require('../models/stuFormAns');
const Promise = require('bluebird');
const Projects = require('../models/projects');
const StudentForm = require('../models/stuForms');
const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();


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
  const answers = JSON.parse(req.body.answers);

  if (JSON.stringify(req.files) !== '{}') {
    answers.forEach((answer, index) => {
      if (answer.file_url === 'file') {
        const file = req.files[answer.question_id];
        const stream = fs.createReadStream(file.path);

        const params = {
          Bucket: 'rmd-letter',
          Key: `${req.params.rmdPersonID}/${file.originalFilename}`, //  檔案名稱
          ACL: 'public-read',  //  檔案權限
          Body: stream,
          ContentType: file.type,
        };


        s3.upload(params).on('httpUploadProgress', (progress) => {
            //  上傳進度
          console.log(`${progress.loaded} of ${progress.total} bytes`);
        })
          .send((err, data) => {
              // delete temp file
            fs.unlink(file.path, (error) => {
              if (err) {
                console.error(error);
              }
              console.log('Temp File Delete');
            });
              //  上傳完畢或是碰到錯誤
            if (err) {
              console.log(err);
            } else {
              answers[index].file_url = `https://s3.us-east-2.amazonaws.com/rmd-letter/${req.params.rmdPersonID}/${file.originalFilename}`;
              answers[index].text = file.originalFilename;
              new RmdLtFormAnswer({
                projID: req.params.projID,
                stuID: req.params.stuID,
                rmdPersonID: req.params.rmdPersonID,
                answers,
              }).save((err) => { //  存入db
                if (err) return next(err);
                res.send('OK');
              });
            }
          });
      }
    });
  } else {
    new RmdLtFormAnswer({
      projID: req.params.projID,
      stuID: req.params.stuID,
      rmdPersonID: req.params.rmdPersonID,
      answers,
    }).save((err) => { //  存入db
      if (err) return next(err);
      res.send('OK');
    });
  }

};