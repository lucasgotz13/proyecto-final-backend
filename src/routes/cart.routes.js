import { Router } from "express";
import { cartModel } from "../Dao/MongoDB/models/carts.model.js";

const routerCart = Router();

routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        let cart = await cartModel.findOne({ _id: cid });
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.log("Cannot get carts with mongoose" + error);
    }
});

routerCart.post("/", async (req, res) => {
    let { products } = req.body;

    let result = await cartModel.create({
        products,
    });
    res.send({ status: "success", payload: result });
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        let cart = await cartModel.findOne({ _id: cid });
        // TODO: Hacer la lógica para que si existe el producto entonces solo aumentar la cantidad de este
        cart.products.push({ product: pid, quantity: 1 });
        let result = await cartModel.updateOne({ _id: cid }, cart);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.log("Cannot get carts with mongoose" + error);
    }
});

export default routerCart;
