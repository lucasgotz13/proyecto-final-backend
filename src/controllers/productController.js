import { productService } from "../Dao/MongoDB/repositories/index.js";

export const getProducts = async (req, res) => {
    const { limit, page, query, sort } = req.query;
    let result = await productService.getProducts(limit, page, query, sort);
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
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    let result = await productService.getProductById(pid);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
};

export const addProduct = async (req, res) => {
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
    let result = await productService.addProduct({
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
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    let fieldsToReplace = req.body;

    let result = await productService.updateProduct(pid, fieldsToReplace);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    let result = await productService.deleteProduct(pid);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
};
