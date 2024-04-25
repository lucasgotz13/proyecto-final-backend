import CartManager from "./CartManager.js";
import ProductManager from "./ProductManager.js";
import UserManager from "./UserManager.js";
import MessageManager from "./MessageManager.js";
import TicketManager from "./TicketManager.js";

export const cartService = new CartManager();
export const productService = new ProductManager();
export const userService = new UserManager();
export const messageService = new MessageManager();
export const ticketService = new TicketManager();
