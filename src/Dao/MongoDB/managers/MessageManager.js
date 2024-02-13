import { messageModel } from "../models/messages.model.js";

export default class MessagesManager {
    async getMessages() {
        try {
            let result = await messageModel.find();
            return result;
        } catch (error) {
            console.log("An error has occured: ", error);
        }
    }
    async postMessage(user, message) {
        try {
            let result = await messageModel.create({
                user,
                message,
            });
            return result;
        } catch (error) {
            console.log("An error has occured: ", error);
        }
    }
}
