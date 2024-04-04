import UserManager from "../services/UserManager.js"

const userManager = new UserManager()

export const getUsers = async (req, res) => {
  let result = await userManager.getUser("tutigotz@gmail.com")
  if (!result) return res.status(404).send({ status: "error", description: "Invalid email" })
  res.status(200).send({ status: "success", payload: result })
}
