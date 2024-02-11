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
        try {
            const cart = await this.getCart();
            cart.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(cart));
        } catch (err) {
            let cart = [];
            cart.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(cart));
        }
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

    async getCartProductsById(id) {
        try {
            const data = await this.getCart();
            const cart = data.find((cart) => cart.id === id);
            return (
                cart.products ?? "The cart with the following id does not exist"
            );
        } catch (err) {
            console.log("El carrito no fue encontrado\n", err);
        }
    }

    async getCartProducts(id) {
        try {
            let data = await this.getCart(id);
            return data[0].products;
        } catch (err) {
            console.log("Cart not found", err);
            return false;
        }
    }

    async addProductToCart(cid, pid) {
        let products = await this.getCartProductsById(cid);
        const cart = await this.getCart();
        let selectedCart = cart.find((cart) => cart.id === cid);
        if (!products.some((prod) => prod.product === pid)) {
            let prod = {
                product: pid,
                quantity: 1,
            };
            products.push(prod);
            selectedCart.products = products;
            let updatedCart = cart.filter((cart) => cart.id !== cid);
            updatedCart.push(selectedCart);
            console.log(updatedCart);
            await fs.writeFile(this.path, JSON.stringify(updatedCart));
            return true;
        } else {
            let currProd = products.find((prod) => prod.product === pid);
            currProd.quantity++;
            let newProdInCart = products.filter((prod) => prod.product !== pid);
            newProdInCart.push(currProd);
            selectedCart.products = newProdInCart;
            let updatedCart = cart.filter((cart) => cart.id !== cid);
            updatedCart.push(selectedCart);
            // console.log(updatedCart);
            await fs.writeFile(this.path, JSON.stringify(updatedCart));
            return false;
        }
    }
}
