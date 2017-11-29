const RmdLtFormAnswer = require('../models/rmdltFormAns');
const RmdLtForm = require('../models/rmdltForms');
const StudentFormAns = require('../models/stuFormAns');
const Promise = require('bluebird');
const Projects = require('../models/projects');
const StudentForm = require('../models/stuForms');
const StudentAccounts = require('../models/stuAccount');
const RecommendedPerson = require('../models/rmdPerson');
const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();

// mail config
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your account',
    pass: 'your password',
  },
});

exports.fillInPage = (req, res, next) => {
  const a = Projects.findById(req.params.projID).exec();
  const b = RmdLtFormAnswer.findOne({ stuID: req.params.stuID, projID: req.params.projID, rmdPersonID: req.params.rmdPersonID }).exec();
  const c = RmdLtForm.findOne({ projID: req.params.projID }).exec();
  const d = StudentFormAns.findOne({ projID: req.params.projID, stuID: req.params.stuID }).exec();
  const e = StudentForm.findOne({ projID: req.params.projID}).exec();
  const f = StudentAccounts.findById(req.params.stuID).exec(); 

  return Promise.join(a, b, c, d, e, f, (proj, answers, questions, studentAns, studentQues ,student) => {
    res.format({
      default: () => {
        res.render('subdomains/rmdPersonView', {
          answers,
          proj,
          questions,
          studentAns,
          studentQues,
          student: student.displayName,
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
        if (file) {
          const stream = fs.createReadStream(file.path);

          const params = {
            Bucket: 'rmd-letter',
            Key: `${req.params.rmdPersonID}/${file.originalFilename}`, //  檔案名稱
            ACL: 'public-read',  //  檔案權限
            Body: stream,
            ContentType: file.type,
          };

          answers[index].file_url = `https://s3.us-east-2.amazonaws.com/rmd-letter/${req.params.rmdPersonID}/${file.originalFilename}`;
          answers[index].text = file.originalFilename;

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
                return res.send(err);
              }
            });
        } else {
          answers[index].file_url = '';
          answers[index].text = '';
        }
      }
      if (index === answers.length - 1) {
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

exports.sendEmail = (req, res, next) => {
  const a = Projects.findById(req.params.projID).exec();
  const b = StudentAccounts.findById(req.params.stuID).exec();
  const c = RecommendedPerson.findOne({ projID: req.params.projID }).exec();

  return Promise.join(a, b, c, (proj, student, rmdPersonList) => {
      const rmdPerson = rmdPersonList.person.id(req.params.rmdPersonID); // get 'person' subdocument

      // mail config
      const mailOptions = {
        from: 'your account',
        to: student.email,
        subject: `${proj.titleZh}通知`,
        html: `<h3>${student.displayName}同學 您好：</h3><br>
               <p><b>${rmdPerson.name}</b> 已經回復您的推薦信請求<p>
               <p>可以上推薦信網站再次確認<p><br>
               <p><a href="http://${proj.subdomainName}.localhost:3000/progress">${proj.titleZh}系統</a></p><br>
               <p style="color:red;">※此封郵件為系統發送之通知郵件，請勿直接回覆此郵件。</p>`,
      };
      console.log('send success');
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    })


};