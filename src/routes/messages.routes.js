import { Router } from "express";
import { messageService } from "../Dao/MongoDB/repositories/index.js";

const routerMessages = Router();

routerMessages.get("/", async (req, res) => {
    let result = await messageService.getMessages();
    if (!result) return res.status(404).send({ status: "error" });
    res.status(200).send({ status: "success", payload: result });
});

routerMessages.post("/", async (req, res) => {
    const { user, message } = req.body;
    let result = await messageService.postMessage(user, message);
    if (!result) return res.status(404).send({ status: "error" });
    res.status(201).send({ status: "success", payload: result });
});
export default routerMessages;
