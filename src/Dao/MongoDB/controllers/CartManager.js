import { cartModel } from "../models/carts.model.js";

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async createCart(products) {
        try {
            let result = await cartModel.create({
                products,
            });
            return result;
        } catch (error) {
            console.log("An error has occured: ", error);
            return false;
        }
    }

    async getCart(id) {
        try {
            let cart = await cartModel.findOne({ _id: id }).lean();
            return cart.products;
        } catch (err) {
            console.log("Cart not found: ", err);
            return false;
        }
    }

    async addProductToCart(cid, pid) {
        try {
            let cart = await cartModel.findOne({ _id: cid }).lean();
            console.log(cart);
            if (cart.products.some((item) => item.product.toString() === pid)) {
                let currProd = cart.products.find(
                    (item) => item.product.toString() === pid
                );
                let quantity = currProd.quantity;
                quantity += 1;
                console.log(quantity);
                let result = await cartModel.updateOne(
                    { _id: cid, "products.product": pid },
                    {
                        $set: { "products.$.quantity": quantity },
                    }
                );
                return result;
            } else {
                let result = await cartModel.updateOne(
                    { _id: cid },
                    {
                        $push: { products: { product: pid, quantity: 1 } },
                    }
                );
                return result;
            }
        } catch (err) {
            console.log("Cannot get cart: ", err);
            return false;
        }
    }

    async updateCart(cid, updatedProducts) {
        try {
            let result = await cartModel.updateOne(
                { _id: cid },
                { $set: { products: updatedProducts } }
            );
            return result;
        } catch (err) {
            console.log("Cannot get cart or product: ", err);
            return false;
        }
    }

    async updateProductFromCart(cid, pid, quantity) {
        try {
            let result = await cartModel.updateOne(
                { _id: cid, "products.product": pid },
                {
                    $set: { "products.$.quantity": quantity },
                }
            );
            return result;
        } catch (err) {
            console.log("Cannot get cart or product: ", err);
            return false;
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            let result = await cartModel.updateOne(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            );
            return result;
        } catch (err) {
            console.log("Cannot get cart or product: ", err);
            return false;
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            let result = await cartModel.updateMany(
                { _id: cid },
                { $set: { products: [] } }
            );
            return result;
        } catch (err) {
            console.log("Cannot get cart: ", err);
            return false;
        }
    }
}
