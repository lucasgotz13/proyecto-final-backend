import mongoose from "mongoose";

const sessionsCollection = "sessions";

const sessionSchema = new mongoose.Schema({
    _id: String,
    expires: Date,
    session: String,
});

export const sessionModel = mongoose.model(sessionsCollection, sessionSchema);
