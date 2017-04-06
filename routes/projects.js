const express = require('express');
const router = express.Router();

const routes = require('../api/controllers/projects');
const Policy = require('../api/policy');

//  projects management
router.get('/', Policy.loggedIn, routes.projectList);
router.get('/create', Policy.loggedIn, routes.createPage);  //  create project
router.post('/', Policy.loggedIn, routes.projCreate);


//  project detail
router.get('/:projID', Policy.loggedIn, routes.projDetail);
router.put('/:projID', Policy.loggedIn, routes.projHbrEdit);
router.get('/:projID/edit', Policy.loggedIn, routes.editPage);

router.put('/:projID/titleZh', Policy.loggedIn, routes.projTitleZhEdit);
router.put('/:projID/subdomain', Policy.loggedIn, routes.projSubdomainEdit);

router.delete('/:projID', Policy.loggedIn, routes.projDelete);


module.exports = router;