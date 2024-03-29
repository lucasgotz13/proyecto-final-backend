import { Router } from "express";
import CartManager from "../models/CartManager.js";
import { __dirname } from "../path.js";
import { join } from "path";

const PATH = join(__dirname, "mocks", "cart.json");

const routerCart = Router();
const cartManager = new CartManager(PATH);

routerCart.post("/", async (req, res) => {
    const conf = await cartManager.createCart();
    if (conf) {
        res.status(201).send("Carrito creado");
    } else {
        res.status(404).send(
            "Ha ocurrido un error con la creacion del carrito"
        );
    }
});

routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const products = await cartManager.getCartProductsById(cid);
    if (products === false) return res.status(404).send("El carrito no existe");
    return res.status(200).send(products);
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const conf = await cartManager.addProductToCart(cid, pid);
    if (conf) {
        return res.status(200).send("Nuevo producto agregado al carrito");
    } else {
        return res.status(200).send("Producto agregado");
    }
});

export default routerCart;
