import { Router } from "express";
import MessagesManager from "../services/MessageManager.js";

const routerMessages = Router();
const messagesManager = new MessagesManager();

routerMessages.get("/", async (req, res) => {
    let result = await messagesManager.getMessages();
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

routerMessages.post("/", async (req, res) => {
    const { user, message } = req.body;
    let result = await messagesManager.postMessage(user, message);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});
export default routerMessages;
