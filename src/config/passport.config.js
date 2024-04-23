import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../path.js";
import GithubStrategy from "passport-github2";
import { cartService } from "../Dao/MongoDB/repositories/index.js";
import { userService } from "../Dao/MongoDB/repositories/index.js";

const LocalStrategy = local.Strategy;
const initializePassport = async () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userService.getUser(username);
                    if (user) {
                        console.log("User already exists");
                        return done(null, false);
                    }
                    let cart = await cartService.createCart([]);
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        cart: cart._id,
                        role: "user",
                    };
                    let result = await userService.createUser(newUser);
                    return done(null, result);
                } catch (err) {
                    return done("Error al obtener el usuario: " + err);
                }
            }
        )
    );
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await userService.getUser(username);
                    console.log(user);
                    if (!user) {
                        console.log("User doesn't exist");
                        return done(null, false);
                    }
                    if (!isValidPassword(user, password))
                        return done(null, false);
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: "Iv1.83e5d333de2c6d5d",
                clientSecret: "c51c6055a7d58cdba482570f6136e956d1ee1604",
                callbackUrl: "http://localhost:8080/api/auth/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    let user = await userService.getUser(profile._json.email);
                    if (!user) {
                        let cart = await cartService.createCart([]);
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 18,
                            email: profile._json.email,
                            cart: cart._id,
                            role: "user",
                        };
                        let result = await userService.createUser(newUser);
                        done(null, result);
                    } else {
                        done(null, user);
                    }
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserById(id);
        done(null, user);
    });
};

export default initializePassport;
