import { cartService } from "../Dao/MongoDB/repositories/index.js";

export const getCart = async (req, res) => {
    const { cid } = req.params;
    let result = await cartService.getCart(cid);
    if (!result)
        return res
            .status(404)
            .send({ status: "error", description: "Invalid cart id" });
    res.status(200).send({ status: "success", payload: result });
};

export const addCart = async (req, res) => {
    let { products } = req.body;
    let result = await cartService.createCart(products ?? []);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
};

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    let result = await cartService.addProductToCart(cid, pid);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
};

export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    let result = await cartService.updateCart(cid, products);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
};

export const updateProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    let result = await cartService.updateProductFromCart(cid, pid, quantity);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
};

export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    let result = await cartService.deleteProductFromCart(cid, pid);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
};

export const deleteCart = async (req, res) => {
    const { cid } = req.params;
    let result = await cartService.deleteAllProductsFromCart(cid);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
};
