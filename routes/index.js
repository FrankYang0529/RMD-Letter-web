const express = require('express');
const router = express.Router();

const routes = require('../api/controllers/index');
const Policy = require('./policy');

/*         main page           */
router.get('/', routes.index);


/*          projects management         */
router.get('/projects', Policy.loggedIn, routes.projectList);
router.get('/projects/create', Policy.loggedIn, routes.createPage);  //  create project
router.post('/projects', Policy.loggedIn, routes.projCreate);


/*          project detail              */
router.get('/projects/:projID', Policy.loggedIn, routes.project);
router.put('/projects/:projID', Policy.loggedIn, routes.projHbrEdit);
router.get('/projects/:projID/edit', Policy.loggedIn, routes.editPage);

router.put('/projects/:projID/titleZh', Policy.loggedIn, routes.projTitleZhEdit);
router.put('/projects/:projID/title', Policy.loggedIn, routes.projTitleEdit);

router.delete('/projects/:projID', Policy.loggedIn, routes.projDelete);



module.exports = router;