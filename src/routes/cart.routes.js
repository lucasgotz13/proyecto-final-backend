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

routerCart.get("/", async (req, res) => {
    console.log(__dirname);
    const products = await cartManager.getCartProducts();
    return res.status(200).send(products);
});

routerCart.post("/product/:pid", async (req, res) => {
    const { pid } = req.params;
    const conf = await cartManager.addProductToCart(pid);
    if (conf) {
        return res.status(200).send("Nuevo producto agregado al carrito");
    } else {
        return res.status(200).send("Producto agregado");
    }
});

export default routerCart;
