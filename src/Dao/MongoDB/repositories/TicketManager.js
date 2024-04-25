import { ticketModel } from "../../../models/ticket.model.js";
import { userService } from "./index.js";
import crypto from "crypto";

export default class TicketManager {
    async generateTicket(cid, products) {
        let totalPrice = products.reduce(
            (acc, curr) => acc + curr.product.price,
            0
        );
        let user = await userService.getUserByCartId(cid);
        const ticket = {
            code: crypto.randomUUID(),
            amount: totalPrice,
            purchaser: user.email,
        };
        try {
            let result = await ticketModel.create(ticket);
            return result;
        } catch (error) {
            console.log("An error has occured: ", error);
            return false;
        }
    }
}
