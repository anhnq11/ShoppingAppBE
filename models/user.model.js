const { Schema } = require('mongoose');
const db = require('../database/database')
const usersSchema = new db.mongoose.Schema({
    fullname: { type: String, required: true },
    phonenum: { type: String, required: true },
    password: { type: String, required: true},
    email: { type: String, required: false},
    date: { type: String, required: false},
    image: { type: String, required: false},
    id_role: { type: db.mongoose.Schema.Types.ObjectId, required: false, ref: 'roleModel', default: "64aa59b703a5197e30599206"},
    status: {type: Boolean, default: true}
}, {
    collection: 'users',
})

const rolesSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    level: { type: Number, required: false },
}, {
    collection: 'roles',
});

const userModel = db.mongoose.model('userModel', usersSchema);
const roleModel = db.mongoose.model('roleModel', rolesSchema);

module.exports = { userModel, roleModel };
