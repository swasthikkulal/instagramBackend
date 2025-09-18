const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register",
        required: true,
    },
    username: {
        type: mongoose.Schema.Types.String,
        ref: "register"
    },
    posts: String, // optional: used for regular post uploads
    dp: {
        type: mongoose.Schema.Types.String,
        ref: "register"
    },    // stores dp image filename

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("post", postSchema);
