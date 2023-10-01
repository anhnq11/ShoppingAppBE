var myModels = require('../models/user.model');
// Lấy danh sách quyền người dùng
exports.listRoles = async (req, res, next) => {
    try {
        let listRoles = await myModels.roleModel.find();
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
// Lấy danh sách tài khoản người dùng
exports.listUsers = async (req, res, next) => {
    try {
        // Lọc theo giá tiền
        let filter = null;
        // if(typeof(req.query.price) != 'undefined') {
        //     filter = { price: req.query.price };
        // }
        let listRoles = await myModels.roleModel.find();
        let listUsers = await myModels.userModel.find(filter).populate('id_role', 'name');
        if (listUsers.length > 0) {
            res.render('users', {
                listUsers: listUsers,
                listRoles: listRoles
            });
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
// Xem chi tiết tài khoản người dùng
exports.userDetails = async (req, res, next) => {
    try {
        console.log(req.params);
        let user = await myModels.userModel.findById(req.params.id).populate('id_role', 'name');
        console.log(user);
            res.render('userDetails', {
                user: user,
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
// Thêm tài khoản mới
exports.addUser = async (req, res, next) => {
    try {
        const user = {
            fullname: req.body.fullname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            id_role: req.body.id_role,
        }
        const result = await myModels.userModel.create(user);
        res.redirect("/users/users");
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
// Cập nhật thông tin tài khoản
exports.updateUser = async (req, res, next) => {
    try {
        await myModels.userModel.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                id_role: req.body.id_role,
            }
        })
        res.status(200).json({ status: 'success' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
// Xem thông chi tiết tài khoản
exports.getProfile = async (req, res, next) => {
    try {
        let user = req.session.user;
        res.render('profile', {
            user: user,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
