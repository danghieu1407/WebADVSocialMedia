const mongoose = require('mongoose')
const nontificationSchema = mongoose.Schema({
    content:    String,
    creator:    String,
    create_at:  Date,
    update_at:  Date,
})

const nontification = mongoose.model('nontification',nontificationSchema)
module.exports = nontification