const mongoose = require("mongoose");

const order = new mongoose.Schema({
    name: String,
    id: String,
    price: Number,
    image: String,
    countity: Number
})

const Orders = new mongoose.Schema({
    name: String,
    companyName: String,
    contactNumber: String,
    orders: [order]
});

module.exports = mongoose.model("Orders", Orders);