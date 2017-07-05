const express = require('express');
const router = express.Router();

const subroutes = require('../api/controllers/subdomain');
const Policy = require('../api/policy');
//const passport = require('../auth/stuPassport');

router.get('/', subroutes.index);

//  register
router.get('/users', subroutes.userIndex);
router.post('/users', subroutes.register);
router.put('/users', subroutes.changePassword);

//  login/logout
router.get('/users/login', subroutes.login);
router.post('/users/login', subroutes.auth);
router.get('/users/logout', subroutes.logout);


//  profile
router.get('/users/me', Policy.sessionLoggedIn, subroutes.profile);
router.put('/users/me', Policy.sessionLoggedIn, subroutes.update_profile);

//  add recommended person
router.get('/projects/rmd-person', Policy.sessionLoggedIn, subroutes.rmdPersonList);
router.post('/projects/rmd-person', Policy.sessionLoggedIn, subroutes.addRmdPerson);

//  Send Recommend Letter Invitation
router.get('/projects/:rmdPersonID/send-letter', Policy.sessionLoggedIn, subroutes.sentLetter);

//Fill in student form
router.post('/projects/student-form', Policy.sessionLoggedIn, subroutes.studentForm);



module.exports = router;