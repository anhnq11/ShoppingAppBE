const { Schema } = require('mongoose');
const db = require('../database/database');

const cartsSchema = new db.mongoose.Schema({
    user_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    product_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'productModel' },
    quantity: { type: Number, required: true},
    price: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
}, {
    collection: 'carts',
})

const cartModel = db.mongoose.model('cartModel', cartsSchema);

module.exports = { cartModel };