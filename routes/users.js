const express = require('express');
const router = express.Router();

const users = require('../api/controllers/users');
const Policy = require('./policy');

/*              register                 */
router.get('/', users.index);
router.post('/', users.register);
router.put('/', users.changePassword);


/*          user profile             */
router.get('/me', Policy.loggedIn, users.profile);


/*           update profile           */
router.put('/me', Policy.loggedIn, users.updateProfile);


/*          login / logout           */
router.get('/login', users.login);
router.post('/login', users.auth, users.loginForm);
router.get('/logout', users.logout);


module.exports = router;
