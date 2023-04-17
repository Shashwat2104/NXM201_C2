const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    productId: { type: String, required: true },
    sellerId: { type: String, required: true },
    price: { type: String, required: true },
    sellerId: { type: String, required: true },
    createdAt: { type: String, required: true },
})

const productModel = mongoose.model("Moderator", productSchema)

module.exports = {
    productModel
}