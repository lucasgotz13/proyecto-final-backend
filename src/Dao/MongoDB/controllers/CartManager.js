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
            if (cart.products.some((item) => item.product === pid)) {
                let currProd = cart.products.find(
                    (item) => item.product === pid
                );
                currProd.quantity++;
                let result = await cartModel.updateOne({ _id: cid }, cart);
                return result;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
                let result = await cartModel.updateOne({ _id: cid }, cart);
                return result;
            }
        } catch (err) {
            console.log("Cannot get cart: ", err);
            return false;
        }
    }
}
