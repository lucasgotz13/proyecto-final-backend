import express from "express";
import { __dirname } from "./path.js";
import routerCart from "./routes/cart.routes.js";
import routerMessages from "./routes/messages.routes.js";
import routerProd from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";
import { routerAuth } from "./routes/auth.routes.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import { messageModel } from "./Dao/MongoDB/models/messages.model.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

const PORT = 8080;
const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = handlebars.create({
    helpers: {
        json: function (context) {
            return JSON.stringify(context);
        },
    },
});
app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
    session({
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://lucasgotz13:32CbzpWntktJeuPm@proyecto-backend.jd7f7cm.mongodb.net/ecommerce",
            mongoOptions: {},
        }),
        secret: "secretCoder",
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/api/messages", routerMessages);
app.use("/auth", routerAuth);
app.use("/", routerViews);

app.use(cookieParser("CoderSecretCode"));

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
