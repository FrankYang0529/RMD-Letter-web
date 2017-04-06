const express = require('express');
const router = express.Router();

const routes = require('../api/controllers/index');

/*         main page           */
router.get('/', routes.index);


module.exports = router;