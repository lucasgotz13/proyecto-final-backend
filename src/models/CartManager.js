import { promises as fs } from "fs";
import crypto from "crypto";

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.cart = [];
    }

    async createCart() {
        try {
            let res = await fs.readFile(this.path, "utf-8");
            let currCart = JSON.parse(res);
            console.log(currCart);
            let newCart = {
                id: crypto.randomUUID(),
                products: [],
            };
            currCart.push(newCart);
            console.log(currCart);
            await fs.writeFile(this.path, JSON.stringify(currCart));
        } catch (err) {
            let newCart = {
                id: crypto.randomUUID(),
                products: [],
            };
            this.cart.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(this.cart));
        }
        return true;
    }

    async getCart(cartId = false) {
        try {
            let res = await fs.readFile(this.path, "utf-8");
            if (!cartId) return JSON.parse(res);
            let data = JSON.parse(res).find((cart) => cart.id === cartId);
            return data;
        } catch (err) {
            console.log("Cart not found", err);
            return false;
        }
    }

    async getCartProducts(cartId) {
        const { products } = await this.getCart(cartId);
        return products ?? "Cart not found";
    }

    async addProductToCart(cartId, prodId) {
        let selectedCart = await this.getCart(cartId);
        let carts = await this.getCart();
        if (!selectedCart.products.some((prod) => prod.product === prodId)) {
            let prod = {
                product: prodId,
                quantity: 1,
            };
            selectedCart.products.push(prod);
            let newCart = carts.filter((cart) => cart.id !== cartId);
            let updatedCart = [...newCart, selectedCart];
            await fs.writeFile(this.path, JSON.stringify(updatedCart));
            return true;
        } else {
            let currProd = selectedCart.products.find(
                (prod) => prod.product === prodId
            );
            currProd.quantity++;
            let newProdInCart = selectedCart.products.filter(
                (prod) => prod.product !== prodId
            );
            newProdInCart.push(currProd);
            selectedCart.products = newProdInCart;
            let newCart = carts.filter((cart) => cart.id !== cartId);
            await fs.writeFile(
                this.path,
                JSON.stringify([...newCart, selectedCart])
            );
        }
    }
}
