import { Router } from "express";
import ProductManager from "../Dao/MongoDB/controllers/ProductManager.js";

const routerProd = Router();
const productManager = new ProductManager();

routerProd.get("/", async (req, res) => {
    const { limit, query, sort } = req.query;
    let result = await productManager.getProducts(limit, query, sort);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

routerProd.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    let result = await productManager.getProductById(pid);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

routerProd.post("/", async (req, res) => {
    let {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        status,
        stock,
    } = req.body;
    let result = await productManager.addProduct({
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        status,
        stock,
    });
    if (!result)
        return res.status(400).send({
            status: "error",
            payload: "Product witht the same code already exists",
        });
    res.status(201).send({ status: "success", payload: result });
});

routerProd.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    let fieldsToReplace = req.body;

    let result = await productManager.updateProduct(pid, fieldsToReplace);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});

routerProd.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    let result = await productManager.deleteProduct(pid);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

export default routerProd;
