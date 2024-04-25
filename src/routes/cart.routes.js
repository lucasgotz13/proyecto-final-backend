import { Router } from "express";
import {
    addCart,
    addProductToCart,
    deleteCart,
    deleteProductFromCart,
    finishPurchase,
    getCart,
    updateCart,
    updateProductFromCart,
} from "../controllers/cartController.js";

const routerCart = Router();

routerCart.get("/:cid", getCart);
routerCart.post("/", addCart);
routerCart.post("/:cid/product/:pid", addProductToCart);
routerCart.post("/:cid/purchase", finishPurchase);
routerCart.put("/:cid", updateCart);
routerCart.put("/:cid/product/:pid", updateProductFromCart);
routerCart.delete("/:cid/product/:pid", deleteProductFromCart);
routerCart.delete("/:cid", deleteCart);

export default routerCart;
