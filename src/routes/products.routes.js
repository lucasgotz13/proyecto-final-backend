import { Router } from "express";
import { __dirname } from "../path.js";
import { join } from "path";
import { productModel } from "../Dao/MongoDB/models/products.model.js";

const PATH = join(__dirname, "mocks", "products.json");
const routerProd = Router();

// TODO: Usar la clase ProductManager con los metodos de Mongoose

routerProd.get("/", async (req, res) => {
    try {
        let result = await productModel.find();
        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        console.log("An error has occured with the products collection ", err);
        res.status(404).send({ error: "error" });
    }
});

routerProd.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        let result = await productModel.findOne({ _id: pid });
        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        console.log("An error has occured: ", err);
        res.status(404).send({ error: "Product not found" });
    }
});

routerProd.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, status, stock } =
        req.body;
    try {
        let result = await productModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            status,
            stock,
        });
        res.status(201).send({ status: "success", payload: result });
    } catch (err) {
        console.log(
            "An error has occured when creating a product document: ",
            err
        );
        res.status(404).send({ error: "An error has occured" });
    }
});

routerProd.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    let fieldsToReplace = req.body;

    try {
        let result = await productModel.updateOne(
            { _id: pid },
            fieldsToReplace
        );
        res.status(202).send({ status: "success", payload: result });
    } catch (err) {
        console.log("An error has occured: ", err);
        res.status(400).send({
            error: "An error has occured when updating the fields of a product document",
        });
    }
});

routerProd.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        let result = await productModel.deleteOne({ _id: pid });
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        console.log(
            "An error has occured when deleting a product document: ",
            err
        );
        res.status(404).send({ error: "An error has occured" });
    }
});

export default routerProd;
