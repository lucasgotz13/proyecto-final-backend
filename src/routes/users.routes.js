import { Router } from "express";
import { getUsers } from "../controllers/userController.js"

const routerUser = Router()

routerUser.get("/", getUsers)

export default routerUser
