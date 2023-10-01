var myModels = require('../models/user.model');

// Đến trang chủ
exports.getIndex = async (req, res, next) => {
    try {
        let msg = null;
        let isLoggedIn = false;
        if (req.session.isLogined === false || req.session.isLogined === undefined || req.session.isLogined === null) {
            isLoggedIn = false;
        }
        else {
            isLoggedIn = true;
        }
        return res.render('index', { isLoggedIn: isLoggedIn, msg: msg});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Đăng nhập hệ thống
exports.login = async (req, res, next) => {
    try {
        let msg = ''
        const user = await myModels.userModel.findOne({ username: req.body.username }).populate('id_role', 'name');
        if(user.id_role.name == 'User'){
            msg = 'Bạn không có quyền truy cập trang web!'
            return res.render('login', { msg: msg });
        }
        else{
            if (!user || (user.password != req.body.password)) {
                msg = 'Tên đăng nhập hoặc mật khẩu không chính xác!'
                return res.render('login', { msg: msg });
            }
            else {
                req.session.isLogined = true;
                req.session.user = user;
                msg = 'Success!'
                return res.redirect('/users/users')
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Đăng xuất
exports.logout = async (req, res, next) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
