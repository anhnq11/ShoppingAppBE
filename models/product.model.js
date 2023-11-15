const db = require('../database/database')
const productsSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true},
    desc: { type: String, required: false},
    image: { type: String, required: true },
    createdAt: { type: Date, required: true},
    status: { type: Boolean, required: false, default: false },
    id_cat: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'categoryModel'}
}, {
    collection: 'products',
})

const catsSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
}, {
    collection: 'categories',
});

const paymentSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
}, {
    collection: 'paymentMethods',
});

const categoryModel = db.mongoose.model('categoryModel', catsSchema);
const productModel = db.mongoose.model('productModel', productsSchema);
const paymentMethodsModel = db.mongoose.model('paymentMethodsModel', paymentSchema);

module.exports = { categoryModel, productModel, paymentMethodsModel };
