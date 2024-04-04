import { Router } from "express";
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from "../controllers/productController.js";

const routerProd = Router();

routerProd.get("/", getProducts);
routerProd.get("/:pid", getProductById);
routerProd.post("/", addProduct);
routerProd.put("/:pid", updateProduct);
routerProd.delete("/:pid", deleteProduct);

export default routerProd;
