import { productModel } from "../models/products.model.js";

export default class ProductManager {
    async addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        status = true,
        stock,
    }) {
        try {
            const products = await productModel.find().lean();
            if (products.some((prod) => prod.code === code)) {
                console.log("Product with the same code already exists");
                return false;
            }
            let result = await productModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                status,
                stock,
            });
            return result;
        } catch (error) {
            console.log("An error has occured: ", err);
            return false;
        }
    }

    async getProducts() {
        try {
            let result = await productModel.find();
            return result;
        } catch (error) {
            console.log("Products do not exist: ", error);
            return false;
        }
    }

    async getProductById(id) {
        try {
            let result = await productModel.findOne({ _id: id });
            return result;
        } catch (error) {
            console.log("Product does not exist: ", error);
            return false;
        }
    }

    async updateProduct(id, fieldsToReplace) {
        try {
            let result = await productModel.updateOne(
                { _id: id },
                fieldsToReplace
            );
            return result;
        } catch (error) {
            console.log("An error has occured: ", error);
            return false;
        }
    }

    async deleteProduct(id) {
        try {
            let result = await productModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.log(
                "An error has occured when deleting a product document: ",
                err
            );
            return false;
        }
    }
}
