const { Schema } = require('mongoose');
const db = require('../database/database');

const invoicesSchema = new db.mongoose.Schema({
    user_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    listCart: { type: Array, required: true, ref: 'cartModel' },
    totalAmount: { type: Number, required: true},
    createdAt: { type: String, required: true},
    userAddress: { type: String, required: true },
    status: { type: String, required: true },
}, {
    collection: 'invoices',
})

const invoiceModel = db.mongoose.model('invoiceModel', invoicesSchema);

module.exports = { invoiceModel };