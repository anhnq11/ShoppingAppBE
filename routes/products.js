var express = require('express');
var router = express.Router();
var productsController = require('../controller/product.controller');
const isLoggedIn = require('../mdw/isLoggedIn');
const path = require('node:path');

const multer = require('multer')

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage }).single('image');

/* GET products page. */
router.get('/products', isLoggedIn, productsController.listProducts);
// GET categories list
router.get('/categories', isLoggedIn, productsController.listCategories);
// Delete product
router.get('/products/delete/:id', isLoggedIn, productsController.deleteProduct);
// Update product
router.put('/products/update/:id', isLoggedIn, productsController.updateProduct);

/* POST products page. */
router.post('/products', upload, isLoggedIn, productsController.addProduct);

module.exports = router;
