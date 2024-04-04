import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnail: String,
    code: String,
    status: Boolean,
    stock: Number,
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);
