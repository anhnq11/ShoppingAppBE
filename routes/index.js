var express = require('express');
var router = express.Router();
var homeController = require('../controller/home.controller');
const isLoggedIn = require('../mdw/isLoggedIn');

/* GET home page. */
router.get('/', homeController.getIndex)

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET logout page. */
router.get('/logout', isLoggedIn, homeController.logout)

/* POST login page. */
router.post('/login', homeController.login)

/* GET home page. */
router.get('/regis', function(req, res, next) {
  res.render('regis', { title: 'Express' });
});

module.exports = router;
