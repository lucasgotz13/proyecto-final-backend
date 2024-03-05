import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export const userModel = mongoose.model(usersCollection, userSchema);
