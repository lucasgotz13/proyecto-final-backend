import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
    },
    age: {
        type: String,
    },
    password: {
        type: String,
    },
});

export const userModel = mongoose.model(usersCollection, userSchema);
