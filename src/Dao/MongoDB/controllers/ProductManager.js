import { productModel } from "../models/products.model.js";

export default class ProductManager {
    async addProduct({
        title,
        description,
        category,
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
                category,
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

    validateParams(limit, query, sort) {
        let finalQuery = [];
        if (Boolean(query)) {
            finalQuery.push({ $match: { category: query } });
        }
        if (Boolean(sort)) {
            finalQuery.push({
                $sort: { price: sort === "asc" ? 1 : -1 },
            });
        }
        finalQuery.push({
            $limit: limit ? parseInt(limit) : 10,
        });
        return finalQuery;
    }

    async getProducts(limit, query, sort) {
        let finalQuery = this.validateParams(limit, query, sort);
        console.log(finalQuery);
        try {
            let result = await productModel.aggregate(finalQuery);
            return result;
        } catch (error) {
            console.log("products do not exist: ", error);
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
