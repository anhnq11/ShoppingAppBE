const db = require('../database/database')
const addressSchema = new db.mongoose.Schema({
    user_id: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel'},
    addressname: { type: String, required: true },
    address: { type: String, required: true},
    address_details: { type: String, required: true},
    is_default: { type: Boolean, required: false, default: false }
},{
    collection: 'address'
})
const addressModel = db.mongoose.model('addressModel', addressSchema);
module.exports = { addressModel };