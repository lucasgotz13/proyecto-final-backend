import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    status: Boolean,
    stock: Number,
});

export const productModel = mongoose.model(productCollection, productSchema);
