import { Router } from "express";
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from "../controllers/productController.js";
import { adminMiddleware, userMiddleware } from "../middleware/middleware.js";

const routerProd = Router();

routerProd.get("/", getProducts);
routerProd.get("/:pid", getProductById);
routerProd.post("/", userMiddleware, addProduct);
routerProd.put("/:pid", userMiddleware, updateProduct);
routerProd.delete("/:pid", userMiddleware, deleteProduct);

export default routerProd;
