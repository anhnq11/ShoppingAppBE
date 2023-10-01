var express = require('express');
var router = express.Router();
var userController = require('../controller/user.controller');
const isLoggedIn = require('../mdw/isLoggedIn')

/* GET users page. */
router.get('/users', isLoggedIn, userController.listUsers);
/* GET user details page. */
router.get('/users/:id', isLoggedIn, userController.userDetails);

// GET categories list
router.get('/profile', isLoggedIn, userController.getProfile);
// Delete product
// router.get('/products/delete/:id', productsController.deleteProduct);
// Update product
// router.put('/products/update/:id', productsController.updateProduct);

/* POST products page. */
router.post('/users', isLoggedIn, userController.addUser);

module.exports = router;
