const express = require('express');

const router = express.Router();
const routes = require('../api/controllers/rmdPeople');

//  projects management
router.get('/:projID/:stuID', routes.fillInPage);
router.post('/:projID/:stuID', routes.fillIn);

module.exports = router;
