const express = require('express');

const router = express.Router();
const routes = require('../api/controllers/rmdPeople');
const multiparty = require('connect-multiparty');

multipartyMiddleware = multiparty();

//  projects management
router.get('/get-form/:projID', routes.getForm);
router.get('/get-form-answer/:projID/:rmdPersonID/:stuID', routes.getFormAns);
router.get('/:projID/:rmdPersonID/:stuID', routes.fillInPage);
router.post('/:projID/:rmdPersonID/:stuID', multipartyMiddleware,  routes.fillIn);

module.exports = router;
