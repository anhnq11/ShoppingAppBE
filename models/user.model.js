const { Schema } = require('mongoose');
const db = require('../database/database')
const usersScheme = new db.mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true},
    email: { type: String, required: true},
    date: { type: String, required: false},
    image: { type: String, required: false},
    id_role: { type: db.mongoose.Schema.Types.ObjectId, required: false, ref: 'roleModel', default: "64aa59b703a5197e30599206"},
    status: {type: Boolean, default: true}
}, {
    collection: 'users',
})

const rolesScheme = new db.mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
}, {
    collection: 'roles',
});

const userModel = db.mongoose.model('userModel', usersScheme);
const roleModel = db.mongoose.model('roleModel', rolesScheme);

module.exports = { userModel, roleModel };
