import express from "express";
import { __dirname } from "./path.js";
import routerCart from "./routes/cart.routes.js";
import routerMessages from "./routes/messages.routes.js";
import routerProd from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";
import routerUser from "./routes/users.routes.js";
import { routerAuth } from "./routes/auth.routes.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import { messageModel } from "./models/messages.model.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import "dotenv/config";
import { adminMiddleware } from "./middleware/middleware.js";

console.log(process.env.PORT);

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
            mongoUrl: process.env.MONGO_URL,
            mongoOptions: {},
        }),
        secret: "secretCoder",
        resave: false,
        saveUninitialized: false,
    })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/api/messages", adminMiddleware, routerMessages);
app.use("/auth", routerAuth);
app.use("/user", routerUser);
app.use("/", routerViews);

app.use(cookieParser("CoderSecretCode"));

app.use(express.static(__dirname + "/public"));

mongoose
    .connect(process.env.MONGO_URL)
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

server.listen(process.env.PORT, () => {
    console.log("Server on port", process.env.PORT);
});
