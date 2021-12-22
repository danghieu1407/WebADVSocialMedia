const mongoose = require('mongoose')
const adminSchema = mongoose.Schema({
    authId: String,
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String,
    created: Date,
    updated: Date,
    avatar: String
})
const AdminTDTU = mongoose.model('Admin', adminSchema)
module.exports = AdminTDTU;