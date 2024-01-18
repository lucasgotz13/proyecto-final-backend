import { promises as fs } from "fs";
import crypto from "crypto";

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async createCart() {
        let newCart = {
            id: crypto.randomUUID(),
            products: [],
        };
        await fs.writeFile(this.path, JSON.stringify(newCart));
        return true;
    }

    async getCart() {
        try {
            let res = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(res);
            return data;
        } catch (err) {
            console.log("Cart not found", err);
            return false;
        }
    }

    async getCartProducts() {
        try {
            let res = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(res);
            return data.products;
        } catch (err) {
            console.log("Cart not found", err);
            return false;
        }
    }

    async addProductToCart(id) {
        let products = await this.getCartProducts();
        let cart = await this.getCart();
        if (!products.some((prod) => prod.product === id)) {
            let prod = {
                product: id,
                quantity: 1,
            };
            products.push(prod);
            cart.products = products;
            await fs.writeFile(this.path, JSON.stringify(cart));
            return true;
        } else {
            let currProd = products.find((prod) => prod.product === id);
            currProd.quantity++;
            let newProdInCart = products.filter((prod) => prod.product !== id);
            newProdInCart.push(currProd);
            let updatedCart = {
                id: cart.id,
                products: newProdInCart,
            };
            console.log(updatedCart);
            await fs.writeFile(this.path, JSON.stringify(updatedCart));
            return false;
        }
    }
}
