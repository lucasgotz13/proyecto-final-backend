import mongoose from "mongoose";

const cartCollection = "carts";

const productSchema = new mongoose.Schema({
    product: String,
    quantity: Number,
});

const cartSchema = new mongoose.Schema({
    products: [productSchema],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
