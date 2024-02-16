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

export default routerCart;
