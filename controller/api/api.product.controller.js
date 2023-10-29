var myModels = require('../../models/product.model');
var cartModel = require('../../models/cart.model');
var invoiceModel = require('../../models/invoice.model');
var favoursModel = require('../../models/favourites.model');
var fs = require('fs');
const { log } = require('console');

exports.listCategories = async (req, res, next) => {
    try {
        let listCategories = await myModels.categoryModel.find();
        if (listCategories.length > 0) {
            res.status(200).json({ status: 'success', data: listCategories });
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

// Danh sách sản phẩm

exports.listProducts = async (req, res, next) => {
    try {
        let listProducts = await myModels.productModel.find().populate('id_cat', 'name');
        if (listProducts.length > 0) {
            res.status(200).json(listProducts);
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

// Giỏ hàng
exports.addQuantityToCart = async (req, res, next) => {
    try {
        let myCart = await cartModel.cartModel.findOne({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            color: req.body.color,
            size: req.body.size
        });
        if (myCart == null) {
            // Add to cart
            const newCart = {
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                price: req.body.price,
                color: req.body.color,
                size: req.body.size
            }
            const result = await cartModel.cartModel.create(newCart);
            res.status(200).json(result);
        } else {
            // Update quantity
            let quantity = myCart.quantity;
            quantity++;
            const result = await cartModel.cartModel.findByIdAndUpdate(myCart._id, {
                $set: {
                    user_id: req.body.user_id,
                    product_id: req.body.product_id,
                    quantity: quantity,
                    price: req.body.price,
                    color: req.body.color,
                    size: req.body.size
                }
            }, { new: true }); // Thêm tùy chọn new: true để trả về giỏ hàng đã cập nhật
            res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.removeQuantityToCart = async (req, res, next) => {
    try {
        let mQuantity = req.body.quantity;
        
        if (mQuantity >= 2) {
            mQuantity--;
            // Update quantity
            const result = await cartModel.cartModel.findByIdAndUpdate(req.body._id, {
                $set: { quantity: mQuantity }
            }, { new: true });

            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(500).json({ status: 'error', message: 'Failed to update cart' });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.deleteProductsFromCart = async (req, res, next) => {
    try {
        // Delete from cart
        const rs = await cartModel.cartModel.findByIdAndDelete(req.body._id);
        if (rs) {
            return res.status(200).json({ status: 'delete success' });
        } else {
            return res.status(500).json({ status: 'error', message: 'Failed to delete cart' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.getListCart = async (req, res, next) => {
    try {
        let myCart = await cartModel.cartModel.find({ user_id: req.query.user_id }).populate('product_id')
        if (myCart.length != 0) {
            res.status(200).json(myCart);
        }
        else {
            res.status(201).json({ status: 'Null' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.deleteCart = async (req, res, next) => {
    try {
        let rs = await cartModel.cartModel.deleteMany({ user_id: req.query.user_id }).populate('product_id')
        if (rs) {
            return res.status(200).json({ status: 'delete success' });
        } else {
            return res.status(500).json({ status: 'error', message: 'Failed to delete cart' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Hóa đơn

exports.addToInvoices = async (req, res, next) => {
    try {
        // Add to invoices list
        const newInvoice = {
            user_id: req.body.user_id,
            username: req.body.username,
            phonenum: req.body.phonenum,
            listCart: req.body.listCart,
            totalAmount: req.body.totalAmount,
            createdAt: req.body.createdAt,
            userAddress: req.body.address,
            status: req.body.status
        }
        const result = await invoiceModel.invoiceModel.create(newInvoice);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.getInvoices = async (req, res, next) => {
    try {
        let myInvoices = await invoiceModel.invoiceModel.find({ user_id: req.query.user_id });
        if (myInvoices.length != 0) {
            res.status(200).json(myInvoices);
        }
        else {
            res.status(404).json({ status: 'Null' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Sản phẩm yêu thích

// Get 
exports.getFavours = async (req, res, next) => {
    try {
        let myFavours = await favoursModel.favoursModel.findOne({ user_id: req.query.user_id, product_id: req.query.product_id });
        if (myFavours !== undefined) {
            res.status(200).json(myFavours);
        }
        else {
            res.status(404).json({ status: 'Null' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Get list of favours
exports.getListFavours = async (req, res, next) => {
    try {
        let myFavours = await favoursModel.favoursModel.find({ user_id: req.query.user_id }).populate('product_id');
        if (myFavours.length !== 0) {
            myFavours.reverse();
            res.status(200).json(myFavours);
        }
        else {
            res.status(404).json({ status: 'Null' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Add
exports.addFavour = async (req, res, next) => {
    try {
        // Add to favour
        const newFavours = {
            user_id: req.body.user_id,
            product_id: req.body.product_id
        }
        const result = await favoursModel.favoursModel.create(newFavours);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Delete

exports.deleteFavour = async (req, res, next) => {
    try {
        let rs = await favoursModel.favoursModel.deleteMany({ _id: req.query._id });
        if (rs) {
            return res.status(200).json({ status: 'delete success' });
        } else {
            return res.status(500).json({ status: 'error', message: 'Failed to delete cart' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}



