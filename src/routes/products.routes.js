import { Router } from "express";
import ProductManager from "../Dao/MongoDB/managers/ProductManager.js";

const routerProd = Router();
const productManager = new ProductManager();

routerProd.get("/", async (req, res) => {
    let result = await productManager.getProducts();
    res.status(200).send({ status: "success", payload: result });
});

routerProd.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    let result = await productManager.getProductById(pid);
    res.status(200).send({ status: "success", payload: result });
});

routerProd.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, status, stock } =
        req.body;
    let result = await productManager.addProduct({
        title,
        description,
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
    res.status(201).send({ status: "success", payload: result });
});

routerProd.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    let result = await productManager.deleteProduct(pid);
    res.status(200).send({ status: "success", payload: result });
});

export default routerProd;
