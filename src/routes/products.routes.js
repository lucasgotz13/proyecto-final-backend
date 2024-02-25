import { Router } from "express";
import ProductManager from "../Dao/MongoDB/controllers/ProductManager.js";

const routerProd = Router();
const productManager = new ProductManager();

routerProd.get("/", async (req, res) => {
    const { limit, page, query, sort } = req.query;
    let result = await productManager.getProducts(limit, page, query, sort);
    if (result.hasPrevPage) {
        result.prevLink = `http://localhost:8080/api/products${
            limit ? `?limit=${limit}` : `?limit=10`
        }${page ? `&page=${parseInt(page) - 1}` : ""}${
            query ? `&query=${query}` : ""
        }${sort ? `&sort=${sort}` : ""}`;
    } else {
        result.prevLink = null;
    }
    if (result.hasNextPage) {
        result.nextLink = `http://localhost:8080/api/products${
            limit ? `?limit=${limit}` : `?limit=10`
        }${page ? `&page=${parseInt(page) + 1}` : "&page=2"}${
            query ? `&query=${query}` : ""
        }${sort ? `&sort=${sort}` : ""}`;
    } else {
        result.nextLink = null;
    }

    delete result.totalDocs;
    delete result.limit;
    delete result.pagingCounter;

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
            payload: "Product with the same code already exists",
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
