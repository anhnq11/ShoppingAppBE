var myModels = require('../../models/product.model');
var cartModel = require('../../models/cart.model');
var invoiceModel = require('../../models/invoice.model');
var favoursModel = require('../../models/favourites.model');
const { log } = require('console');

// Thể loại
exports.addCategories = async (req, res, next) => {
    try {
        const rs = await myModels.categoryModel.create(req.body);
        res.status(rs ? 200 : 500).json(rs ? rs : { status: 'error', message: 'Failed to create the invoice.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.listCategories = async (req, res, next) => {
    try {
        let listCategories = await myModels.categoryModel.find();
        if (listCategories.length > 0) {
            res.status(200).json(listCategories);
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

exports.updateCategories = async (req, res) => {
    try {
        const { _id, name } = req.body;

        const rs = await myModels.categoryModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    name,
                }
            },
            { new: true }
        );

        if (!rs) {
            return res.status(404).json({ status: 'error', message: 'Category not found' });
        }
        res.status(200).json(rs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.listInvoicesStatus = async (req, res, next) => {
    try {
        let list = await invoiceModel.orderStatusModel.find();
        if (list.length > 0) {
            res.status(200).json(list);
        }
        else {
            res.status().json({ status: 'Null' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.listPaymentMethods = async (req, res, next) => {
    try {
        let list = await myModels.paymentMethodsModel.find();
        if (list.length > 0) {
            res.status(200).json(list);
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

exports.getAllProducts = async (req, res, next) => {
    try {
        let listProducts = await myModels.productModel.find().populate('id_cat', 'name').sort({ 'status': 1 })
            ;
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

exports.getProducts = async (req, res, next) => {
    try {
        let listProducts = await myModels.productModel.find({ status: false }).populate('id_cat', 'name').sort({ 'status': 1 })
            ;
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

// Danh sách sản phẩm
exports.createNewProducts = async (req, res, next) => {
    try {
        const { name,
            price,
            desc,
            id_cat,
            image,
            createdAt
        } = req.body;

        const newProduct = {
            name,
            price,
            desc,
            id_cat,
            image,
            createdAt
        }

        const result = await myModels.productModel.create(newProduct);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ error: 'Add product fail' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProducts = async (req, res, next) => {
    try {
        const { _id,
            name,
            price,
            desc,
            id_cat,
            image,
            status
        } = req.body;

        const rs = await myModels.productModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    name,
                    price,
                    desc,
                    id_cat,
                    image,
                    status
                }
            },
            { new: true }
        );

        if (!rs) {
            return res.status(201).json({ status: 'error', message: 'Update Fail' });
        }
        res.status(200).json(rs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.listNewProducts = async (req, res, next) => {
    try {
        const listProducts = await myModels.productModel
            .find()
            .populate('id_cat', 'name')
            .sort('-createdAt')
            .limit(3);

        res.status(listProducts.length > 0 ? 200 : 404).json(listProducts.length > 0 ? listProducts : { status: 'No products found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

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

// exports.deleteCart = async (userData, res, next) => {
//     try {
//         let rs = 
//         if (rs) {
//             return res.status(200).json({ status: 'delete success' });
//         } else {
//             return res.status(500).json({ status: 'error', message: 'Failed to delete cart' });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ status: 'error', message: err.message });
//     }
// }

// Hóa đơn
exports.addToInvoices = async (req, res, next) => {
    try {
        const createdInvoice = await invoiceModel.invoiceModel.create(req.body);
        if (createdInvoice) {
            await cartModel.cartModel.deleteMany({ user_id: req.body.user_id }).populate('product_id')
            res.status(200).json(createdInvoice)
        }
        else {
            res.status(500).json({ status: 'error', message: 'Failed to create the invoice.' })
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.getInvoices = async (req, res, next) => {
    try {
        let myInvoices;
        if (req.query.user_id != undefined) {
            myInvoices = await invoiceModel.invoiceModel.find({ user_id: req.query.user_id, isDone: req.query.isDone }).populate('userAddress')
                .populate('paymentMethod').populate('status')
        }
        else {
            myInvoices = await invoiceModel.invoiceModel.find().populate('userAddress')
                .populate('paymentMethod')
                .populate('status')
                .sort({ 'status': 1 })
        }
        if (myInvoices.length != 0) {
            res.status(200).json(myInvoices);
        }
        else {
            res.status(500).json({ status: 'Null' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Tổng doanh thu
exports.getTotalRevenue = async (req, res, next) => {
    try {
        let myInvoices = await invoiceModel.invoiceModel.find().populate('userAddress')
        let totalRevenue = 0
        let totalRevenueOfMonth = 0
        let thisMonth = new Date().getMonth() + 1
        if (myInvoices.length > 0) {
            myInvoices.forEach(element => {
                totalRevenue += element.totalAmount
                if (element.createdAt.startsWith(thisMonth)) {
                    totalRevenueOfMonth += element.totalAmount
                }
            });
        }
        else {
            res.status(500).json({ status: 'Null' })
        }
        res.status(200).json({ totalRevenue: totalRevenue, thisMonth: thisMonth, totalRevenueOfMonth: totalRevenueOfMonth });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.updateInvoicesStatus = async (req, res, next) => {
    try {
        const { _id, status } = req.body;

        const rs = await invoiceModel.invoiceModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    status,
                }
            },
            { new: true }
        );

        if (!rs) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json(rs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.recentOrder = async (req, res, next) => {
    try {
        let myInvoices = await invoiceModel.invoiceModel.find({ user_id: req.query.user_id, isDone: true })
        if (myInvoices.length != 0) {
            let productList = []
            myInvoices.forEach(element => {
                productList = productList.concat(element.listCart)
            })
            let mProductsList = productList.slice(productList.length - 3, productList.length);
            res.status(200).json(mProductsList.reverse());
        }
        else {
            res.status(200).json([])
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.updateInvoices = async (req, res) => {
    try {
        const invoice = await invoiceModel.invoiceModel.findByIdAndUpdate(req.query._id,
            { isDone: true },
            { new: true });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating the invoice' });
    }
};


// Sản phẩm yêu thích

exports.getFavours = async (req, res, next) => {
    try {
        let myFavours = await favoursModel.favoursModel.findOne({ user_id: req.query.user_id, product_id: req.query.product_id });
        if (myFavours !== undefined) {
            res.status(200).json(myFavours);
        }
        else {
            res.status(200).json([])
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
            res.status(200).json([])
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



