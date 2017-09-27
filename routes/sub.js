const express = require('express');
const router = express.Router();

const subroutes = require('../api/controllers/subdomain');
const Policy = require('../api/policy');
const passport = require('../auth/passport');
const multiparty = require('connect-multiparty');

multipartyMiddleware = multiparty();

router.get('/', subroutes.index);
router.get('/recommendData', Policy.studentLoggedIn, subroutes.recommendData); //  get self student-form data
router.get('/projects/addRmdPerson', Policy.studentLoggedIn, subroutes.addRmdPersonView);

//  get announcement detail
router.get('/announcement/:announcementID', subroutes.announcementDetail);

//  get recommended letter schedule
router.get('/progress', Policy.studentLoggedIn, subroutes.scheduleView);

//  register
router.get('/users', subroutes.registerPage);
router.post('/users', passport.authenticate('stu-local-signup', {
    successRedirect: '/',
    failureRedirect: '/users',
    failureFlash: true,
  })
);
router.put('/users', subroutes.changePassword);

//  login/logout
router.get('/users/login', subroutes.login);
router.post('/users/login', subroutes.auth, subroutes.loginForm);
router.get('/users/logout', subroutes.logout);

//  profile
router.get('/users/me', Policy.studentLoggedIn, subroutes.profile);
router.put('/users/me', Policy.studentLoggedIn, subroutes.update_profile);

//  add recommended person
router.get('/projects/rmd-person', Policy.studentLoggedIn, subroutes.rmdPersonList);
router.post('/projects/rmd-person', Policy.studentLoggedIn, subroutes.addRmdPerson);

//  Send Recommend Letter Invitation
router.get('/projects/:rmdPersonID/send-letter', Policy.studentLoggedIn, subroutes.sentLetter);

//  get student sent letter (for blocking too many letter had sent)
router.get('/projects/letter-number', Policy.studentLoggedIn, subroutes.letterNumber);

//  Fill in student form
router.get('/fill-student-form', Policy.studentLoggedIn, subroutes.studentFormView);
router.get('/update-student-form', Policy.studentLoggedIn, subroutes.updateStudentFormView);
router.get('/projects/student-form', Policy.studentLoggedIn, subroutes.getStudentForm); //  get student form question for ajax
router.get('/projects/student-form-answer', Policy.studentLoggedIn, subroutes.getStudentFormAns); //  get student form answer for ajax
router.post('/projects/student-form', Policy.studentLoggedIn, multipartyMiddleware, subroutes.studentForm);
router.put('/projects/student-form', Policy.studentLoggedIn, multipartyMiddleware, subroutes.updateStudentForm);

module.exports = router;