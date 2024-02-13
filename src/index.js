import express from "express";
import { __dirname } from "./path.js";
import path from "path";
import routerCart from "./routes/cart.routes.js";
import routerMessages from "./routes/messages.routes.js";
import routerProd from "./routes/products.routes.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/api/messages", routerMessages);

app.use("/static", express.static(path.join(__dirname, "/public")));

mongoose.connect(
    "mongodb+srv://lucasgotz13:32CbzpWntktJeuPm@proyecto-backend.jd7f7cm.mongodb.net/ecommerce"
);

app.listen(PORT, () => {
    console.log("Server on port", PORT);
});
