const express = require('express');
const router = express.Router();
const subroutes = require( '../api/controllers/subdomain' );
const Department = require('../api/models/department');  //department data


router.get('/', subroutes.index);


module.exports = router;