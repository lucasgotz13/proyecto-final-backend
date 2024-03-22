import { Router } from "express";
import ProductManager from "../Dao/MongoDB/controllers/ProductManager.js";
import CartManager from "../Dao/MongoDB/controllers/CartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

const routerViews = Router();

routerViews.get("/", (req, res) => {
    res.redirect("/login");
});

routerViews.get("/chat", async (req, res) => {
    res.render("chat", {});
});

routerViews.get("/products", async (req, res) => {
    const { limit, page, query, sort } = req.query;
    let result = await productManager.getProducts(
        limit,
        page,
        query,
        sort,
        true
    );
    if (result.hasPrevPage) {
        result.prevLink = `http://localhost:8080/products${
            limit ? `?limit=${limit}` : `?limit=10`
        }${page ? `&page=${parseInt(page) - 1}` : ""}${
            query ? `&query=${query}` : ""
        }${sort ? `&sort=${sort}` : ""}`;
    } else {
        result.prevLink = null;
    }
    if (result.hasNextPage) {
        result.nextLink = `http://localhost:8080/products${
            limit ? `?limit=${limit}` : `?limit=10`
        }${page ? `&page=${parseInt(page) + 1}` : "&page=2"}${
            query ? `&query=${query}` : ""
        }${sort ? `&sort=${sort}` : ""}`;
    } else {
        result.nextLink = null;
    }
    const PRODUCTS = result.docs;
    const { prevLink, nextLink } = result;
    if (req.session.user === undefined) return res.redirect("/login");
    const { first_name, last_name, email, age, role } = req.session.user;

    res.render("products", {
        PRODUCTS,
        prevLink,
        nextLink,
        first_name,
        last_name,
        email,
        age,
        role,
    });
});

routerViews.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    let cart = await cartManager.getCart(cid);
    res.render("cart", { cart });
});

routerViews.get("/register", (req, res) => {
    res.render("register");
});

routerViews.get("/login", (req, res) => {
    res.render("login");
});

// routerViews.get("/profile", (req, res) => {
//     if (!req.session.user && !req.session.password)
//         return res.redirect("/login");
//     res.render("products");
// });

export default routerViews;
