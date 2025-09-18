const mongoose = require("mongoose")

const registerSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    dp: String,
    bio: String,
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }
})
module.exports = mongoose.model("register", registerSchema)