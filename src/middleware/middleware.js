export const adminMiddleware = (req, res, next) => {
    if (req.session.user.role === "ADMIN")
        return res
            .status(403)
            .send({ status: "error", payload: "Admins can't enter the chat" });
    next();
};

export const userMiddleware = (req, res, next) => {
    if (req.session.user.role === "USUARIO")
        return res
            .status(403)
            .send({ status: "error", payload: "Unauthorized" });
    next();
};
