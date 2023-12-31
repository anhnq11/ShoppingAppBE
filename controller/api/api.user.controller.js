var userModel = require('../../models/user.model');
var addressModel = require('../../models/address.model');
const bcrypt = require("bcrypt");
const multer = require('multer');

const storage = multer.memoryStorage();

exports.listRoles = async (req, res, next) => {
    try {
        let listRoles = await userModel.roleModel.find();
        if (listRoles.length > 0) {
            res.status(200).json(listRoles);
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

exports.getListUsers = async (req, res, next) => {
    try {
        const list = await userModel.userModel.find().populate('id_role');
        res.status(list.length > 0 ? 200 : 404).json(list.length > 0 ? list : { status: 'Null' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Create a new user account
exports.createNewUser = async (req, res, next) => {
    try {
        const { fullname,
            phonenum,
            password,
            email,
            image,
            id_role
        } = req.body;

        if (!fullname || !phonenum || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(password, salt);

        const newUser = {
            fullname,
            phonenum,
            password: hash,
            email,
            image,
            id_role
        };

        const result = await userModel.userModel.create(newUser);

        if (result) {
            const user = await userModel.userModel.findOne({ phonenum, password: hash }).populate('id_role');
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
        const { _id, fullname, email, image } = req.body;

        const updatedUser = await userModel.userModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    fullname,
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

exports.updateUserRole = async (req, res, next) => {
    try {
        const { _id, id_role } = req.body;

        const updatedUser = await userModel.userModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    id_role,
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

exports.deleteUser = async (req, res, next) => {
    try {
        const rs = await userModel.userModel.findByIdAndDelete(req.query._id);
        if (rs) {
            return res.status(200).json({ status: 'delete success' });
        } else {
            return res.status(404).json({ status: 'error', message: 'Failed to delete user' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Đăng nhập
exports.login = async (req, res, next) => {
    try {
        let msg = '';
        const { phonenum, password } = req.body;
        if (!phonenum || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const user = await userModel.userModel.findOne({ phonenum: req.body.phonenum }).populate('id_role');
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
        const result = await addressModel.addressModel.create(req.body);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ status: 'error', message: 'Thêm địa chỉ thất bại!' });
        }
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Lấy địa chỉ của User
exports.getAddress = async (req, res, next) => {
    try {
        let myAddress = await addressModel.addressModel.find(
            { user_id: req.query.user_id }
        ).sort({ is_default: -1 })
        res.status(200).json(myAddress)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.deleteAddress = async (req, res) => {
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
