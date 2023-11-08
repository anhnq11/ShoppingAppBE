var userModel = require('../../models/user.model');
var addressModel = require('../../models/address.model');
var fs = require('fs');
const { log } = require('console');
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.listRoles = async (req, res, next) => {
    try {
        let listRoles = await userModel.roleModel.find();
        if (listRoles.length > 0) {
            res.status(200).json({ status: 'success', data: listRoles });
        }
        else {
            res.status(404).json({ status: 'Null' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Create a new user account
exports.createNewUser = async (req, res, next) => {
    try {
        const { fullname, phonenum, password } = req.body;

        if (!fullname || !phonenum || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(password, salt);

        const newUser = {
            fullname,
            phonenum,
            password: hash,
        };

        const result = await userModel.userModel.create(newUser);

        if (result) {
            const user = await userModel.userModel.findOne({ phonenum, password: hash }).populate('id_role', 'name');
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { _id, fullname, phonenum, email, image } = req.body;

        const updatedUser = await userModel.userModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    fullname,
                    phonenum,
                    email,
                    image,
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

// Đăng nhập
exports.login = async (req, res, next) => {
    try {
        let msg = '';
        const { phonenum, password } = req.body;
        if (!phonenum || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const user = await userModel.userModel.findOne({ phonenum: req.body.phonenum }).populate('id_role', 'name');
        const rsComparePw = await bcrypt.compare(password, user.password);
        if (!user || !rsComparePw) {
            msg = 'Số điện thoại hoặc mật khẩu không chính xác!'
            return res.status(209).json({ msg: msg });
        }
        else {
            msg = 'Success!'
            return res.status(200).json(user);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Check valid phonenum
exports.findUser = async (req, res, next) => {
    try {
        const user = await userModel.userModel.findOne({ phonenum: req.query.phonenum })
        if (user) {
            return res.status(201).json({ msg: 'User found' });
        }
        else {
            return res.status(200).json({ msg: 'User not found' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Thêm địa chỉ mới
exports.addNewAddress = async (req, res, next) => {
    try {
        const newAddress = {
            user_id: req.body.user_id,
            addressname: req.body.addressname,
            address: req.body.address,
            address_details: req.body.address_details,
            is_default: req.body.is_default,
        }
        const result = await addressModel.addressModel.create(newAddress);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json({ status: 'error', message: 'Thêm địa chỉ thất bại!' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Lấy địa chỉ của User
exports.getAddress = async (req, res, next) => {
    try {
        let myAddress = await addressModel.addressModel.find(
            { user_id: req.query.user_id }
        ).sort({ is_default: -1 })
        if (myAddress.length > 0) {
            res.status(200).json(myAddress);
        }
        else {
            res.status(404).json({ status: 'Null' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.deleteAddress = async (req, res, next) => {
    console.log(req.query);
    try {
        const rs = await addressModel.addressModel.findByIdAndDelete(req.query._id);
        if (rs) {
            return res.status(200).json({ status: 'delete success' });
        } else {
            return res.status(404).json({ status: 'error', message: 'Failed to delete cart' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
