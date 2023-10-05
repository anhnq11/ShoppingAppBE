var userModel = require('../../models/user.model');
var addressModel = require('../../models/address.model');
var fs = require('fs');
const { log } = require('console');

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

        console.log(req.body);
        // const file = req.file;
        // const imagePath = fs.readFileSync(file.path);
        // const base64Image = imagePath.toString("base64");
        // const mimeType = file.mimetype;
        // const imageBase64 = `data:${mimeType};base64,${base64Image}`;
        const newUser = {
            fullname: req.body.fullname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            // image: imageBase64,
        }
        const result = await userModel.userModel.create(newUser);
        if (result) {
            const user = await userModel.userModel.findOne({ username: req.body.username, password: req.body.password }).populate('id_role', 'name');
            res.status(200).json(user);
        }
        else{
            res.status(404);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        await userModel.userModel.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                id_role: req.body.id_role,
            }
        })
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
        const user = await userModel.userModel.findOne({ username: req.query.username }).populate('id_role', 'name');
        if (!user || (user.password != req.query.password)) {
            msg = 'Tên đăng nhập hoặc mật khẩu không chính xác!'
            return res.status(404).json({ msg: msg });
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

// Check valid username
exports.findUser = async (req, res, next) => {
    try {
        const user = await userModel.userModel.findOne({ username: req.query.username })
        if (user) {
            return res.status(404).json({ msg: 'User found' });
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
        else{
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
    log(req.query)
    try {
        let myAddress = await addressModel.addressModel.find(
            { user_id: req.query.user_id}
            );
        if (myAddress.length > 0) {
            res.status(200).json({ status: 'success', data: myAddress });
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

