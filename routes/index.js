const express = require('express');
const router = express.Router();

const routes = require( '../api/controllers/index' );


/*         main page           */
router.get('/',routes.index);


/*        store school form to db            */
router.get('/departments', loggedIn, routes.departments );
router.post('/departments', loggedIn, routes.departments_form );


function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


module.exports = router;