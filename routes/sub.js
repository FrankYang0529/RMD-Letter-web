const express = require('express');
const router = express.Router();
const subroutes = require('../api/controllers/subdomain');


router.get('/', subroutes.index);


module.exports = router;