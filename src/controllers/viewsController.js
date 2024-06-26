import { cartService } from "../Dao/MongoDB/repositories/index.js";
import { productService } from "../Dao/MongoDB/repositories/index.js";

export const renderProductsView = async (req, res) => {
    const { limit, page, query, sort } = req.query;
    let result = await productService.getProducts(
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
};

export const renderCartView = async (req, res) => {
    const { cid } = req.params;
    let cart = await cartService.getCart(cid);
    res.render("cart", { cart });
};
