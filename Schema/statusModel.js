const mongoose = require("mongoose")

const statusSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register"
    },
    dp: {
        type: mongoose.Schema.Types.String,
        ref: "register"
    }
})
module.exports = mongoose.model("status", statusSchema)