import Model from "./model.js";
import View from "./view.js";
import userManager from "../../utils/user.js";
import cookiesReader from "../../utils/getCookies.js";

class Controller {
  constructor() {
    this.checkUser();
    this.model = new Model();
    this.view = new View();
    this.logoutController();
  }

  async init() {
    const products = await this.model.getProducts();
    this.view.loadProducts(products);
  }

  logoutController() {
    this.view.$logout.addEventListener("click", () => {
      userManager.logout();
    });
  }

  checkUser() {
    if (!userManager.isLogged()) {
      window.location.href = cookiesReader.urlBase;
    }
  }
}

export default Controller;
