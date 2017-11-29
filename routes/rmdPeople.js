const express = require('express');

const router = express.Router();
const routes = require('../api/controllers/rmdPeople');
const Policy = require('../api/policy');
const multiparty = require('connect-multiparty');

multipartyMiddleware = multiparty();

//  projects management
router.get('/get-form/:projID', Policy.rmdPersonTimeLimit, routes.getForm);
router.get('/get-form-answer/:projID/:rmdPersonID/:stuID', Policy.rmdPersonTimeLimit, routes.getFormAns);
router.get('/:projID/:rmdPersonID/:stuID', Policy.rmdPersonTimeLimit, routes.fillInPage);
router.post('/:projID/:rmdPersonID/:stuID', Policy.rmdPersonTimeLimit, multipartyMiddleware,  routes.fillIn);

//  send email if rmd-letter finished
router.get('/:projID/:rmdPersonID/:stuID/a/send-email', Policy.rmdPersonTimeLimit, routes.sendEmail);

module.exports = router;