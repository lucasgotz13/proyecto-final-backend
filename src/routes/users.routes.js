import { Router } from "express";
import { getUserByCartId, getUsers } from "../controllers/userController.js";

const routerUser = Router();

routerUser.get("/", getUsers);
routerUser.get("/:cid", getUserByCartId);

export default routerUser;
