import { userService } from "../Dao/MongoDB/repositories/index.js";

export const getUsers = async (req, res) => {
    let result = await userService.getUser("tutigotz@gmail.com");
    if (!result)
        return res
            .status(404)
            .send({ status: "error", description: "Invalid email" });
    res.status(200).send({ status: "success", payload: result });
};

export const getUserByCartId = async (req, res) => {
    const { cid } = req.params;
    let result = await userService.getUserByCartId(cid);
    if (!result)
        return res
            .status(404)
            .send({ status: "error", description: "Invalid cart id" });
    res.status(200).send({ status: "success", payload: result });
};
