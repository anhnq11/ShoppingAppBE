const { Schema } = require('mongoose');
const db = require('../database/database')
const productsScheme = new db.mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true},
    desc: { type: String, required: false},
    image: { type: String, required: true },
    id_cat: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'categoryModel'}
}, {
    collection: 'products',
})

const catsScheme = new db.mongoose.Schema({
    name: { type: String, required: true },
}, {
    collection: 'categories',
});

const categoryModel = db.mongoose.model('categoryModel', catsScheme);
const productModel = db.mongoose.model('productModel', productsScheme);

module.exports = { categoryModel, productModel };
