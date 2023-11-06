var express = require('express');
var router = express.Router();
var productsController = require('../../controller/api/api.product.controller');

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

// Lấy danh sách sản phẩm
router.get('/products', productsController.listProducts);

router.get('/payment_methods', productsController.listPaymentMethods);

// Get list categories
// router.get('/categories', productsController.listCategories);

// Lấy danh sách giỏ hàng
router.get('/carts', productsController.getListCart);

// Thêm/Update sản phẩm vào giỏ hàng
router.post('/carts', productsController.addQuantityToCart);

// Update/Xóa sản phẩm vào giỏ hàng
router.put('/carts', productsController.removeQuantityToCart);

// Xóa sản phẩm trong giỏ hàng
router.delete('/carts/item', productsController.deleteProductsFromCart);

// Xóa giỏ hàng
router.delete('/carts', productsController.deleteCart);

// Thanh toán giỏ hàng. Tạo hóa đơn
router.post('/invoices', productsController.addToInvoices);

// Lấy danh sách giỏ hàng
router.get('/invoices', productsController.getInvoices);

router.put('/invoices', productsController.updateInvoices);

// Get favourite
router.get('/favours/details', productsController.getFavours);

// Get favourite
router.get('/favours', productsController.getListFavours);

// Add favourite
router.post('/favours', productsController.addFavour);

// Delete favourite
router.delete('/favours', productsController.deleteFavour);


module.exports = router;
