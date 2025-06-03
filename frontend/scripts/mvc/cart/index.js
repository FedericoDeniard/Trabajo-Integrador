import cart from "../../utils/cart.js";
import Controller from "./controller.js";

const controller = new Controller();
cart.addProduct({ id: 1, ammount: 1 });
cart.addProduct({ id: 2, ammount: 1 });
cart.addProduct({ id: 3, ammount: 1 });
cart.addProduct({ id: 4, ammount: 1 });
cart.addProduct({ id: 5, ammount: 1 });
cart.addProduct({ id: 6, ammount: 1 });
cart.addProduct({ id: 7, ammount: 1 });
cart.addProduct({ id: 8, ammount: 1 });
cart.addProduct({ id: 9, ammount: 1 });
cart.addProduct({ id: 10, ammount: 1 });
controller.init();
