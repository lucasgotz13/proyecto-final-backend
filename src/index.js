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
