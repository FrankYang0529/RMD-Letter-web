const express = require('express');
const router = express.Router();
const passport = require('passport');

const users = require('../api/controllers/users');


/*              register                 */
router.get('/', users.index);
router.post('/', users.register);


/*          user profile             */
router.get('/me', loggedIn, users.profile);


/*           update profile           */
router.post('/me', loggedIn, users.update_profile);


/*          login / logout           */
router.get('/login', users.login);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), users.login_form);
router.get('/logout', users.logout);


/*          projects management         */
router.get('/projects', loggedIn, users.projects);
router.post('/projects', loggedIn, users.projects_edition);  //  create project or update it


function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;
