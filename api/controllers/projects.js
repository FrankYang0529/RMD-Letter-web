const Projects = require('../models/projects'); // department data
const StuForms = require('../models/stuForms');
const RmdLtForms = require('../models/rmdltForms');
const InviteLetter = require('../models/inviteLetter');
const RecommendedPerson = require('../models/rmdPerson');
const StuAccount = require('../models/stuAccount');
const StuFormAns = require('../models/stuFormAns');
const RmdLtFormAns = require('../models/rmdltFormAns');
const Promise = require('bluebird');
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

// not  api
exports.createPage = (req, res, next) => {
  res.render('projectCreate', {
    email: req.user.email,
    title: '',
    body: '',
    error: '',
    subdomainName: '',
  });
};

exports.editPage = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      res.format({
        // 'application/json': () => {
        //   res.send(proj);
        // },
        default: () => {
          // TODO
          res.render('announce', {
            proj, 
            project: proj,
            projID: req.params.projID
          });
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//  api

exports.projectList = (req, res, next) => {
  Projects.find({ ownerID: req.user.username }).exec()
    .then((projs) => {
       res.format({
        // 'application/json': () => {
        //   res.send(projs);
        // },
        default: () => {
          /* TODO*/
          res.render('projectList', {
            username: req.user.username,
            projects: projs
          });
          
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projDetail = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      res.format({
        // 'application/json': () => {
        //   res.send(proj);
        // },
        default: () => {
          res.render('projectEdit', {
            project: proj,
            projID: req.params.projID
          });
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projCreate = (req, res, next) => {

  if (req.body.titleZh.length < 1) {    //  error handle
    
    res.render('projectCreate', {
      titleZh: req.body.titleZh,
      hbr: req.body.hbr,
      subdomainName: req.body.subdomainName
    });
    
  }

  new Projects({
    ownerID: req.user.username,
    titleZh: req.body.titleZh,
    announcement: [],//req.body.announcement,
    email: req.body.email,
    phone: req.body.phone,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    rmdTime: req.body.rmdTime,
    subdomainName: req.body.subdomainName,
    isDeployed: false,
  }).save((err, proj) => { //  存入db
    if (err) return next(err);

    new InviteLetter({
      projID: proj._id,
      title: `${proj.titleZh}推薦信填寫`,
      content: '[@學生名稱] 請 [@推薦人名稱]老師填寫推薦信\n謝謝!\n請注意截止日期至：[@推薦信截止日期]。',
    }).save();

    new RecommendedPerson({
      projID: proj._id,
      person: [],
    }).save();

    return res.redirect('/projects');  //  回到主畫面
  });
};

exports.projAddPost = (req, res, next) => {
  console.log(req.body);
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      //if (req.body.announcement.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          hbr: req.body.hbr,
          proj
        });
        */
      //}
      console.log(req.files);
      if (JSON.stringify(req.files) !== '{}') {
        const file = req.files.file;
        const stream = fs.createReadStream(file.path);

        const params = {
            Bucket: 'rmd-letter',
            Key: `${req.params.projID}/${file.originalFilename}`, //  檔案名稱
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
              //  上傳完畢或是碰到錯誤
            if (err) {
              console.log(err);
            } else {
              proj.announcement.push({
                title: req.body.title,
                text: req.body.text,
                file: `https://s3.us-east-2.amazonaws.com/rmd-letter/${req.params.projID}/${file.originalFilename}`,
                timestamp: req.body.timestamp,
              });
              // console.log(proj.announcement);
            }
            return proj.save();
            fs.unlink(file.path, (error) => {
              if (err) {
                console.error(error);
              }
              console.log('Temp File Delete');
            });
          });
      } else {
        proj.announcement.push(req.body);
        // console.log(proj.announcement);
        return proj.save();
      }
      
    })
    .then((proj) => {
      res.send('success');
      // res.redirect(`/projects/${proj._id}/edit`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.projAnnouncementEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      // if (req.body.announcement.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          hbr: req.body.hbr,
          proj
        });
        */
      // }
      proj.announcement.forEach((body, index) => {

        if (body == null){
          return;
        }
        if (body._id == req.params.announcementID) { // must be == not ===
          proj.announcement[index].title = req.body.title;
          proj.announcement[index].text = req.body.text;

          if (JSON.stringify(req.files) !== '{}') {
            const file = req.files.file;
            const stream = fs.createReadStream(file.path);

            const params = {
              Bucket: 'rmd-letter',
              Key: `${req.params.projID}/${file.originalFilename}`, //  檔案名稱
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
                  proj.announcement[index].file = `https://s3.us-east-2.amazonaws.com/rmd-letter/${req.params.projID}/${file.originalFilename}`;
                  return proj.save();
                }
              });
          } else {
            return proj.save();
          }
        }
      });
    })
    .then((proj) => {
      res.send('OK');  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projTitleZhEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.titleZh.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          titleZh: req.body.TitleZh,
          proj
        });
        */
      }
      proj.titleZh = req.body.titleZh;

      return proj.save();
    })
    .then((proj) => {
      // res.redirect(`/projects/${proj._id}`);  //  回到detail
      res.send('success');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projSubdomainEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.subdomainName.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          subdomainName: req.body.subdomainName,
          proj
        });
        */
      }
      proj.subdomainName = req.body.subdomainName;

      return proj.save();
    })
    .then((proj) => {
      // res.redirect(`/projects/${proj._id}`);  //  回到detail
      res.send('success');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projPhoneEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.phone.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          titleZh: req.body.TitleZh,
          proj
        });
        */
      }
      proj.phone = req.body.phone;

      return proj.save();
    })
    .then((proj) => {
      res.send('success');
      //res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projEmailEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.email.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          titleZh: req.body.TitleZh,
          proj
        });
        */
      }
      proj.email = req.body.email;

      return proj.save();
    })
    .then((proj) => {
      res.send('success');
      //res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projDeadlineEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.startTime.length < 1 || req.body.endTime.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          titleZh: req.body.TitleZh,
          proj
        });
        */
      }
      proj.startTime = req.body.startTime;
      proj.endTime = req.body.endTime;

      return proj.save();
    })
    .then((proj) => {
      res.send('success');
      // res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projRMDTimeEdit = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      if (req.body.rmdTime.length < 1) {    //  must to filled the blank
        /*
        res.render('projectEdit', {
          titleZh: req.body.TitleZh,
          proj
        });
        */
      }
      proj.rmdTime = req.body.rmdTime;
      return proj.save();
    })
    .then((proj) => {
      res.send('success');
      // res.redirect(`/projects/${proj._id}`);  //  回到detail
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.projDeployed = (req, res, next) => {
  Projects.findById(req.params.projID).exec()
    .then((proj) => {
      proj.isDeployed = true;

      return proj.save();
    })
    .then((proj) => {
      // res.redirect(`/projects/${proj._id}`);  //  回到detail
      res.send('success');
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.projDelete = (req, res, next) => {
  Projects.findById(req.params.projID).remove().exec()
    .then((proj) => {
      res.redirect('/projects');
    })
    .catch((err) => {
      res.send('delete error');
    });
};

exports.createStuForm = (req, res, next) => {
  new StuForms({
    projID: req.params.projID,
    title: req.body.title,
    questions: JSON.parse(req.body.questions),//req.body.questions,
  }).save((err) => { //  存入db
    if (err) return next(err);
    return res.redirect(`/projects/${req.params.projID}/student-form`);
  });
};

exports.updateStuForm = (req, res, next) => {
  StuForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      form.title = req.body.title;
      form.questions = JSON.parse(req.body.questions);

      return form.save();
    })
    .then((form) => {
      res.send('success');
      // res.redirect(`/projects/${req.params.projID}/student-form`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.stuFormDetail = (req, res, next) => {
  StuForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      console.log(form);
      res.format({
        // 'application/json': () => {
        //   res.send(form);
        // },
        default: () => {
          if (form == null){
            res.render('studentFormCreate', {
              projID: req.params.projID
            });
          }
          else{
            res.render('studentForm', {
              form,
              projID: req.params.projID
            });
          }
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.createRmdLtForm = (req, res, next) => {
  new RmdLtForms({
    projID: req.params.projID,
    title: req.body.title,
    questions: JSON.parse(req.body.questions),
  }).save((err) => { //  存入db
    if (err) return next(err);
    // res.send('success');
    return res.redirect(`/projects/${req.params.projID}/rmdletter-form`);
  });
};

exports.updateRmdLtForm = (req, res, next) => {
  // console.log(JSON.parse(req.body));
  RmdLtForms.findOne({ projID: req.params.projID }).exec()
    .then((form) => {
      form.title = req.body.title;
      form.questions = JSON.parse(req.body.questions);

      return form.save();
    })
    .then((form) => {
      // console.log()
      // res.redirect(`/projects/${req.params.projID}/rmdletter-form`);
      res.send('success');
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.rmdLtFormDetail = (req, res, next) => {

  const a = RmdLtForms.findOne({ projID: req.params.projID }).exec();
  const b = InviteLetter.findOne({ projID: req.params.projID }).exec();

  return Promise.join(a, b, (form, letter) => {
    res.format({
      default: () => {
        if (form == null){
          res.render('rmdFormCreate', {
            letter,
            projID: req.params.projID
          });
        }
        else{
          res.render('rmdForm', {
            form,
            letter,
            projID: req.params.projID
          });
        }
      },
    });
  });

  // RmdLtForms.findOne({ projID: req.params.projID }).exec()
  //   .then((form) => {
  //     console.log(form);
  //     res.format({
  //       // 'application/json': () => {
  //       //   res.send(form);
  //       // },
  //       default: () => {
  //         if (form == null){
  //           res.render('rmdFormCreate', {
  //             projID: req.params.projID
  //           });
  //         }
  //         else{
  //           res.render('rmdForm', {
  //             form,
  //             projID: req.params.projID
  //           });
  //         }
  //       },
  //     });
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
};

exports.inviteltDetail = (req, res, next) => {
  InviteLetter.findOne({ projID: req.params.projID }).exec()
    .then((letter) => {
      res.format({
        'application/json': () => {
          res.send(letter);
        },
        default: () => {
          /* TODO
          res.render('letterDetail', {
            letter
          });
          */
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateInvitelt = (req, res, next) => {

  InviteLetter.findOne({ projID: req.params.projID }).exec()
    .then((letter) => {
      console.log(letter);
      letter.title = req.body.title;
      letter.content = req.body.content;

      return letter.save();
    })
    .then((letter) => {
      res.send('success');
      // res.redirect(`/projects/${req.params.projID}/rmdletter-form`);
    })
    .catch((err) => {  //  assume that will display invitation-letter's detail, so there can absolutly find one in database
      res.send(err);
    });
};

exports.rmdPersonList = (req, res, next) => {
  RecommendedPerson.findOne({ projID: req.params.projID }).exec()
    .then((personList) => {
      res.format({
        // 'application/json': () => {
        //   res.send(personList);
        // },
        default: () => {
           // TODO
          res.render('rmdPersonList', {
            personList,
            projID: req.params.projID
          });
        },
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.addRmdPerson = (req, res, next) => {
  if(req.body.verification == undefined){
    req.body.verification = false;
  }
  RecommendedPerson.findOne({ projID: req.params.projID }).exec()
    .then((personList) => {
      // console.log(personList.person);
      var rmdPerson = {
        name: req.body.name,
        email: req.body.email,
        serviceUnit: req.body.serviceUnit,
        jobTitle: req.body.jobTitle,
        phone: req.body.phone,
        verification: req.body.verification
      };
      // console.log(rmdPerson);
      personList.person.push(rmdPerson);
      // console.log(personList.person);
      return personList.save();
    })
    .then((personList) => {
      // res.send('success');
      res.redirect(`/projects/${req.params.projID}/rmd-person`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.modifyVerification = (req, res, next) => {
  RecommendedPerson.findOne({ projID: req.params.projID }).exec()
    .then((personList) => {
      personList.person.forEach((person) => {
        if (person._id == req.params.personID) {
          person.verification = req.body.verification;
        }
      });
      return personList.save();
    })
    .then((person) => {
      res.send('success');
      // res.redirect(`/projects/${req.params.projID}/rmd-person`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.studentList = (req, res, next) => {
  const a =  Projects.findById(req.params.projID).exec()
    .then((proj) => StuAccount.find({ subdomain: proj.subdomainName }).exec());    
  const b = StuForms.find({ projID: req.params.projID }).exec();
  const c = RmdLtForms.find({ projID: req.params.projID }).exec();
  const d = StuFormAns.find({ projID: req.params.projID }).exec();
  const e = RmdLtFormAns.find({ projID: req.params.projID }).exec();

  return Promise.join(a, b, c, d, e, (students, studentform, letterform, studentdata, lettercontent) => {
    res.format({
      default: () => {
        res.render('apply', {
          projID: req.params.projID,
          students,
          studentform,
          letterform,
          studentdata,
          lettercontent
        });
      },
    });
  });
  // Projects.findById(req.params.projID).exec()
  //   .then((proj) => StuAccount.find({ subdomain: proj.subdomainName }).exec())
  //   .then((students) => {
  //     res.format({
  //       // 'application/json': () => {
  //       //   res.send(students);
  //       // },
  //       default: () => {
  //         // TODO
  //         res.render('apply', {
  //           projID: req.params.projID,
  //           students
  //         });
          
  //       },
  //     });
  //   });
};

exports.filledStudentForm = (req, res, next) => {
  StuFormAns.findOne({ stuID: req.params.stuID, projID: req.params.projID }).exec()
    .then((ans) => {
      res.format({
        'application/json': () => {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(ans));
        },
        default: () => {
          /* TODO
          res.render('學生資料', {
            form
          });
          */
        },
      });
    });
};

exports.fillStudentRemark = (req, res, next) => {
  StuFormAns.findOne({ stuID: req.params.stuID, projID: req.params.projID }).exec()
    .then((ans) => {
      ans.remark = req.body.remark;
      return ans.save();
    })
    .then((ans) => {
      res.send("success");
      // res.redirect(`/projects/${req.params.projID}/${req.params.stuID}/student-form`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateStudentRemark = (req, res, next) => {
  StuFormAns.findOne({ stuID: req.params.stuID, projID: req.params.projID }).exec()
    .then((ans) => {
      ans.remark = req.body.remark;
      return ans.save();
    })
    .then((ans) => {
      res.send("success");
      // res.redirect(`/projects/${req.params.projID}/${req.params.stuID}/student-form`);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.studentRmdLetter = (req, res, next) => {
  RmdLtFormAns.find({ stuID: req.params.stuID, projID: req.params.projID }).exec()
    .then((ans) => {
      res.format({
        'application/json': () => {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(ans));
        },
        default: () => {
          /* TODO
          res.render('formDetail', {
            form
          });
          */
        },
      });
    });
};
