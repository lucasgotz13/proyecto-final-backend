import { Router } from "express";
import passport from "passport";
import { sessionModel } from "../models/sessions.model.js";

export const routerAuth = new Router();

routerAuth.post(
    "/register",
    passport.authenticate("register", {
        failureRedirect: "/auth/failregister",
    }),
    async (req, res) => {
        console.log("User registered");

        res.redirect("/login");
    }
);

routerAuth.get("/failregister", async (req, res) => {
    console.log("Failed strategy");
    res.send({ error: "Failed" });
});

routerAuth.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    (req, res) => {}
);

routerAuth.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
        req.session.user = { ...req.user._doc, role: "USUARIO" };
        res.redirect("/products");
    }
);

routerAuth.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
    async (req, res) => {
        if (!req.user)
            return res
                .status(400)
                .send({ status: "error", error: "Invalid credentials" });
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role:
                req.user.email == "adminCoder@coder.com" ? "ADMIN" : "USUARIO",
        };
        console.log(req.session);
        res.redirect("/products");
    }
);

routerAuth.get("/faillogin", (req, res) => {
    res.send({ error: "Failed login" });
});

routerAuth.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.sen("Error on logout");
    });

    res.redirect("/login");
});

routerAuth.get("/current", async (req, res) => {
    let result = await sessionModel.find();
    res.send({ session: result });
});

routerAuth.get("/user", (req, res) => {
    res.send(users);
});
