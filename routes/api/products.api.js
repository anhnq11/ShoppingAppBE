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

router.get('/status', productsController.listInvoicesStatus);
// Lấy danh sách sản phẩm
router.post('/products', productsController.createNewProducts);
router.get('/allproducts', productsController.getAllProducts);
router.get('/products', productsController.getProducts);
router.post('/products', productsController.createNewProducts);
router.put('/products', productsController.updateProducts);
router.get('/newproducts', productsController.listNewProducts);

router.get('/payment_methods', productsController.listPaymentMethods);

// Thể loại
router.post('/categories', productsController.addCategories);
router.get('/categories', productsController.listCategories);
router.put('/categories', productsController.updateCategories);

// Lấy danh sách giỏ hàng
router.get('/carts', productsController.getListCart);

// Thêm/Update sản phẩm vào giỏ hàng
router.post('/carts', productsController.addQuantityToCart);

// Update/Xóa sản phẩm vào giỏ hàng
router.put('/carts', productsController.removeQuantityToCart);

// Xóa sản phẩm trong giỏ hàng
router.delete('/carts/item', productsController.deleteProductsFromCart);

// Xóa giỏ hàng
// router.delete('/carts', productsController.deleteCart);

// Thanh toán giỏ hàng. Tạo hóa đơn
router.post('/invoices', productsController.addToInvoices);
router.get('/invoices', productsController.getInvoices);
router.get('/getTotalRevenue', productsController.getTotalRevenue);
router.post('/invoicesStatus', productsController.updateInvoicesStatus);

router.get('/recentOrder', productsController.recentOrder);

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
