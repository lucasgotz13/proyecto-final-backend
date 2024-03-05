import { Router } from "express";
import { userModel } from "../Dao/MongoDB/models/users.model.js";

export const routerAuth = new Router();

routerAuth.post("/register", async (req, res) => {
    let userNew = req.body;
    await userModel.create(userNew);

    res.redirect("/login");
});

routerAuth.post("/login", async (req, res) => {
    let userNew = req.body;
    if (
        userNew.email === "adminCoder@coder.com" &&
        userNew.password === "adminCod3r123"
    ) {
        userNew.role = "ADMIN";
    } else {
        userNew.role = "USUARIO";
    }
    let users = await userModel.find().lean();
    let userFound = users.find(
        (user) =>
            user.email === userNew.email && user.password === userNew.password
    );

    if (userFound) {
        req.session.email = userNew.email;
        req.session.password = userNew.password;
        req.session.role = userNew.role;

        res.redirect("/products");
        return;
    }

    res.status(404).send("Email or password are incorrect");
});

routerAuth.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.sen("Error on logout");
    });

    res.redirect("/login");
});

routerAuth.get("/user", (req, res) => {
    res.send(users);
});
