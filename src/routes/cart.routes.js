import { Router } from "express";
import CartManager from "../Dao/MongoDB/controllers/CartManager.js";

const routerCart = Router();
const cartManager = new CartManager();

routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    let result = await cartManager.getCart(cid);
    if (!result)
        return res
            .status(404)
            .send({ status: "error", description: "Invalid cart id" });
    res.status(200).send({ status: "success", payload: result });
});

routerCart.post("/", async (req, res) => {
    let { products } = req.body;
    let result = await cartManager.createCart(products ?? []);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let result = await cartManager.addProductToCart(cid, pid);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});

routerCart.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    let result = await cartManager.updateCart(cid, products);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});

routerCart.put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    let result = await cartManager.updateProductFromCart(cid, pid, quantity);
    console.log(result);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});

routerCart.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let result = await cartManager.deleteProductFromCart(cid, pid);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

routerCart.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    let result = await cartManager.deleteAllProductsFromCart(cid);
    if (!result || result.matchedCount === 0)
        return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

export default routerCart;
