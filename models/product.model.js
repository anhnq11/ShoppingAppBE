const { Schema } = require('mongoose');
const db = require('../database/database')
const productsSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true},
    desc: { type: String, required: false},
    image: { type: String, required: true },
    id_cat: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'categoryModel'}
}, {
    collection: 'products',
})

const catsSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
}, {
    collection: 'categories',
});

const categoryModel = db.mongoose.model('categoryModel', catsSchema);
const productModel = db.mongoose.model('productModel', productsSchema);

module.exports = { categoryModel, productModel };
