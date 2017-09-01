const express = require('express');
const router = express.Router();

const subroutes = require('../api/controllers/subdomain');
const Policy = require('../api/policy');
const passport = require('../auth/passport');

router.get('/', subroutes.index);
router.get('/recommendData', subroutes.recommendData); //  get self student-form data
router.get('/projects/addRmdPerson', subroutes.addRmdPersonView);

//  get announcement detail
router.get('/announcement/:announcementID', subroutes.announcementDetail);

//  register
router.get('/users', subroutes.registerPage);
router.post('/users', passport.authenticate('stu-local-signup', {
    successRedirect: '/',
    failureRedirect: '/users'
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

//Fill in student form
router.get('/fill-student-form', Policy.studentLoggedIn, subroutes.studentFormView);
router.get('/update-student-form', Policy.studentLoggedIn, subroutes.updateStudentFormView);
router.post('/projects/student-form', Policy.studentLoggedIn, subroutes.studentForm);


module.exports = router;