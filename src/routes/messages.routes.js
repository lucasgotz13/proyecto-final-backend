import { Router } from "express";
import MessagesManager from "../Dao/MongoDB/managers/MessageManager.js";

const routerMessages = Router();
const messagesManager = new MessagesManager();

routerMessages.get("/", async (req, res) => {
    let result = await messagesManager.getMessages();
    res.status(200).send({ status: "success", payload: result });
});

routerMessages.post("/", async (req, res) => {
    const { user, message } = req.body;
    let result = await messagesManager.postMessage(user, message);
    res.status(201).send({ status: "success", payload: result });
});
export default routerMessages;
