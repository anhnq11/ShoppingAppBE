const { Schema } = require('mongoose');
const db = require('../database/database');

const invoicesSchema = new db.mongoose.Schema({
    user_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    username: { type: String, required: true},
    phonenum: { type: Number, required: true},
    listCart: { type: Array, required: true, ref: 'cartModel' },
    totalAmount: { type: Number, required: true},
    createdAt: { type: String, required: true},
    userAddress: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'addressModel' },
    status: { type: String, required: true },
}, {
    collection: 'invoices',
})

const invoiceModel = db.mongoose.model('invoiceModel', invoicesSchema);

module.exports = { invoiceModel };