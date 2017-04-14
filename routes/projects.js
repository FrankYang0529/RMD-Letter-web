const express = require('express');
const router = express.Router();

const routes = require('../api/controllers/projects');
const Policy = require('../api/policy');

//  projects management
router.get('/', Policy.loggedIn, routes.projectList);
router.get('/create', Policy.loggedIn, routes.createPage);  //  create project
router.post('/', Policy.loggedIn, routes.projCreate);


//  project detail
router.get('/:projID', Policy.loggedIn, routes.projDetail);
router.put('/:projID', Policy.loggedIn, routes.projHbrEdit);
router.get('/:projID/edit', Policy.loggedIn, routes.editPage);

router.put('/:projID/titleZh', Policy.loggedIn, routes.projTitleZhEdit);
router.put('/:projID/subdomain', Policy.loggedIn, routes.projSubdomainEdit);

router.delete('/:projID', Policy.loggedIn, routes.projDelete);


//  self definite student forms
router.get('/:projID/student-form', Policy.loggedIn, routes.stuFormDetail);
router.post('/:projID/student-form', Policy.loggedIn, routes.createStuForm);
router.put('/:projID/student-form', Policy.loggedIn, routes.updateStuForm);


//  self definite recommend letter forms
router.get('/:projID/rmdletter-form', Policy.loggedIn, routes.rmdltFormDetail);
router.post('/:projID/rmdletter-form', Policy.loggedIn, routes.createRmdltForm);
router.put('/:projID/rmdletter-form', Policy.loggedIn, routes.updateRmdltForm);


//  the email that mail to the recommended person
router.get('/:projID/invite-letter', Policy.loggedIn, routes.inviteltDetail);
router.put('/:projID/invite-letter', Policy.loggedIn, routes.updateInvitelt);

module.exports = router;