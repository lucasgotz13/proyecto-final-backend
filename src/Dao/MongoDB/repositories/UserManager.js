import { userModel } from "../../../models/users.model.js";

export default class UserManager {
    async createUser(user) {
        try {
            let result = await userModel.create(user);
            return result;
        } catch (error) {
            console.log("An error has occured when creating the user");
        }
    }

    async getUser(email) {
        try {
            let result = await userModel.findOne({ email: email });
            return result;
        } catch (error) {
            console.log("An error has occured when fetching the user");
        }
    }

    async getUserById(id) {
        try {
            let result = userModel.findById(id);
            return result;
        } catch (error) {
            console.log("An error has occured when fetching the user");
        }
    }
}
