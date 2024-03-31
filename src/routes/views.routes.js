import { Router } from "express";
import {
    renderCartView,
    renderProductsView,
} from "../controllers/viewsController.js";

const routerViews = Router();

routerViews.get("/", (req, res) => {
    res.redirect("/login");
});

routerViews.get("/chat", async (req, res) => {
    res.render("chat", {});
});

routerViews.get("/products", renderProductsView);

routerViews.get("/carts/:cid", renderCartView);

routerViews.get("/register", (req, res) => {
    res.render("register");
});

routerViews.get("/login", (req, res) => {
    res.render("login");
});

export default routerViews;
