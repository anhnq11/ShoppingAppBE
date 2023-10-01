var myModels = require('../models/product.model');
var fs = require('fs');
const path = require('node:path');

exports.listCategories = async (req, res, next) => {
    try {
        let listCategories = await myModels.categoryModel.find();
        if (listCategories.length > 0) {
            res.render('categories', {
                listCategories: listCategories
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

exports.listProducts = async (req, res, next) => {
    try {
        // Lọc theo giá tiền
        let filter = null;
        if (typeof (req.query.price) != 'undefined') {
            filter = { price: req.query.price };
        }
        let listCategories = await myModels.categoryModel.find();
        let listProducts = await myModels.productModel.find(filter).populate('id_cat', 'name');
        if (listProducts.length > 0) {
            res.render('products', {
                listProducts: listProducts,
                listCategories: listCategories
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

exports.addProduct = async (req, res, next) => {
    try {
        const file = req.file;
        const imagePath = fs.readFileSync(file.path);
        const base64Image = imagePath.toString("base64");
        const mimeType = file.mimetype;
        const imageBase64 = `data:${mimeType};base64,${base64Image}`;

        const product = {
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            image: imageBase64,
            id_cat: req.body.id_cat,
        }

        const result = await myModels.productModel.create(product);
        res.redirect('/products/products');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        await myModels.productModel.findByIdAndDelete(req.params.id);
        res.redirect('/products/products');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        await myModels.productModel.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                desc: req.body.desc,
                id_cat: req.body.id_cat,
            }
        })
        res.status(200).json({ status: 'success' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
}
