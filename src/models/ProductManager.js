import { promises as fs } from "fs";
import crypto from "crypto";

export default class ProductManager {
    constructor() {
        this.path = "./src/mocks/products.json";
        this.products = [];
    }

    async addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        status = true,
        stock,
    }) {
        if (!title || !description || !price || !code || !stock) {
            console.log("Faltan campos por completar");
            return;
        }

        try {
            this.products = await this.getProducts();
            if (!this.products.some((product) => product.code === code)) {
                let product = {
                    id: crypto.randomUUID(),
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    status,
                    stock,
                };
                this.products.push(product);
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return true;
            } else {
                console.log(`Product with code: "${code}" already exists`);
                return false;
            }
        } catch (err) {
            let product = {
                id: crypto.randomUUID(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            this.products.push(product);
            await fs.writeFile(this.path, JSON.stringify(this.products));
            return true;
        }
    }

    async getProducts() {
        try {
            let res = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(res);
            return data;
        } catch (err) {
            return this.products;
        }
    }

    async getProductById(id) {
        try {
            let data = await this.getProducts();
            let product = data.find((element) => id === element.id);
            return product ?? "No product exists with the requested id";
        } catch (err) {
            return "No products were found";
        }
    }

    async updateProduct(id, { ...product }) {
        try {
            this.products = await this.getProducts();
            let productIndex = this.products.findIndex(
                (product) => id === product.id
            );

            if (productIndex !== -1) {
                this.products[productIndex] = {
                    ...this.products[productIndex],
                    ...product,
                };
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return true;
            } else {
                console.log("The product with the following id wasn't found");
                return false;
            }
        } catch (err) {
            console.log(
                "No products were found. Instead try adding a new product"
            );
            return;
        }
    }

    async deleteProduct(id) {
        try {
            this.products = await this.getProducts();

            let productIndex = this.products.findIndex(
                (product) => id === product.id
            );

            if (productIndex !== -1) {
                this.products.splice(productIndex, 1);
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return true;
            } else {
                console.log("The product with the following id does not exist");
                return false;
            }
        } catch (err) {
            console.log("No products were found");
            return;
        }
    }
}
