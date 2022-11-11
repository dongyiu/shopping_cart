const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String,
        id: {
            type: String,
            unique: true
        }
    },
    name: String,
    companyName: String,
    contactNumber: String
});

module.exports = mongoose.model("imageSchema", imageSchema);