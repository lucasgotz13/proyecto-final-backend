import passport from "passport";
import local from "passport-local";
import { userModel } from "../Dao/MongoDB/models/users.model.js";
import { createHash, isValidPassword } from "../path.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) {
                        console.log("User already exists");
                        return done(null, false);
                    }
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    let result = await userModel.create(newUser);
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
                    const user = await userModel.findOne({ email: username });
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

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        let user = userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;
