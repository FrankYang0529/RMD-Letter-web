const express = require('express');
const router = express.Router();

const routes = require('../api/controllers/index');


/*         main page           */
router.get('/', routes.index);


function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


module.exports = router;