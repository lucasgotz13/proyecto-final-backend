import express from "express";
import { __dirname } from "./path.js";
import routerCart from "./routes/cart.routes.js";
import routerMessages from "./routes/messages.routes.js";
import routerProd from "./routes/products.routes.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import routerChat from "./routes/chat.routes.js";
import { messageModel } from "./Dao/MongoDB/models/messages.model.js";
import ProductManager from "./Dao/MongoDB/controllers/ProductManager.js";

const PORT = 8080;
const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/api/messages", routerMessages);
app.use("/chat", routerChat);

const productManager = new ProductManager();

app.get("/products", async (req, res) => {
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
    console.log(prevLink, nextLink);
    res.render("products", { PRODUCTS, prevLink, nextLink });
});

app.use(express.static(__dirname + "/public"));

mongoose
    .connect(
        "mongodb+srv://lucasgotz13:32CbzpWntktJeuPm@proyecto-backend.jd7f7cm.mongodb.net/ecommerce"
    )
    .then(() => console.log("Base de datos conecatda"));

const io = new Server(server);

async function getMessages() {
    const messages = await messageModel.find().lean();
    return messages;
}

io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");
    let arrMessages = await getMessages();
    socket.emit("all-messages", arrMessages);
    socket.on("new-message", async (data) => {
        let result = await messageModel.create(data);
        let arrMessages = await getMessages();
        socket.emit("all-messages", arrMessages);
    });
});

server.listen(PORT, () => {
    console.log("Server on port", PORT);
});
