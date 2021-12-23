const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    content:    String,
    creator:    String,
    create_at:  Date,
    update_at:  Date,
    image:      String
})

const Post = mongoose.model('Post',postSchema)
module.exports = Post