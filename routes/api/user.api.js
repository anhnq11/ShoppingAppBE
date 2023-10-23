var express = require('express');
var router = express.Router();
var userController = require('../../controller/api/api.user.controller');

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


/* GET List Role. */
router.get('/roles', userController.listRoles);
// GET List Role.
// router.get('/users', userController.listUsers);

// Delete product
// router.delete('/products/delete/:id', userController.de);
// Update product
// router.put('/products/update/:id', userController.updateProduct);

/* POST Đăng ký tài khoản từ Client */
router.post('/regis', upload, userController.createNewUser);

/* Đăng nhập */
router.get('/login', userController.login);

/* Kiểm tra Username */
router.get('/checkRegis', userController.findUser);

// Thêm địa chỉ mới
router.post('/address', userController.addNewAddress);

// Lấy danh sách địa chỉ của người dùng
router.get('/address', userController.getAddress);

// Lấy danh sách địa chỉ của người dùng
router.delete('/address', userController.deleteAddress);

module.exports = router;
