const express = require('express');

const router = express.Router();
const routes = require('../api/controllers/rmdPeople');

//  projects management
router.get('/:projID/:rmdPersonID/:stuID', routes.fillInPage);
router.post('/:projID/:rmdPersonID/:stuID', routes.fillIn);

module.exports = router;
