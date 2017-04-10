const express = require('express');
const router = express.Router();

const subroutes = require('../api/controllers/subdomain');
const Policy = require('../api/policy');

router.get('/', subroutes.index);

/*             register                 */
router.get('/users', subroutes.userIndex);
router.post('/users', subroutes.register);
router.put('/users', subroutes.changePassword);

/*            login/logout             */
router.get('/users/login', subroutes.login);
router.post('/users/login', subroutes.auth, subroutes.loginForm);
router.get('/users/logout', subroutes.logout);


/*            profile                   */
router.get('/users/me', subroutes.profile);
router.put('/users/me', subroutes.update_profile);

module.exports = router;