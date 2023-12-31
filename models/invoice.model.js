const { Schema } = require('mongoose');
const db = require('../database/database');

const invoicesSchema = new db.mongoose.Schema({
    user_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    username: { type: String, required: true},
    phonenum: { type: String, required: true},
    listCart: { type: Array, required: true, ref: 'cartModel' },
    totalAmount: { type: Number, required: true},
    createdAt: { type: String, required: true},
    userAddress: { type: Object },
    paymentMethod: { type: String },
    status: { type: db.mongoose.Schema.Types.ObjectId, required: false, ref: 'orderStatusModel', default: '65427e876c0c1e32f27a8599'},
    isDone: { type: Boolean, required: false, default: false},
}, {
    collection: 'invoices',
})

const invoiceModel = db.mongoose.model('invoiceModel', invoicesSchema);

const orderStatusSchema = new db.mongoose.Schema({
    name: { type: String, required: true},
    status: { type: Number, required: false},
}, {
    collection: 'orderStatus',
})

const orderStatusModel = db.mongoose.model('orderStatusModel', orderStatusSchema);

module.exports = { invoiceModel, orderStatusModel };