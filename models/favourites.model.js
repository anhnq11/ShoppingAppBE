const { Schema } = require('mongoose');
const db = require('../database/database');

const favoursSchema = new db.mongoose.Schema({
    user_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    product_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'productModel' }
}, {
    collection: 'favours',
})

const favoursModel = db.mongoose.model('favoursModel', favoursSchema);

module.exports = { favoursModel };