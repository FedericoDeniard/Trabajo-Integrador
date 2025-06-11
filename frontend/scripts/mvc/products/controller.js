import Model from "./model.js";
import View from "./view.js";
import userManager from "../../utils/user.js";
import cookiesReader from "../../utils/getCookies.js";

class Controller {
  constructor() {
    this.checkUser();
    this.model = new Model();
    this.view = new View();
    this.view.$products.addEventListener("click", (b) => this.clickCardsHandler(b));
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

  clickCardsHandler(b) {
    const minus = b.target.classList.contains('btn-minus');
    const plus = b.target.classList.contains('btn-plus');
    const addToCart = b.target.classList.contains('btn-cart');

    if(addToCart) {

    } else if (minus || plus) {
      const card = b.target.closest('.product-card');
      const input = card.querySelector('.ammount');

      let currentAmmount = parseInt(input.value);
      if (minus && currentAmmount > 1) {
        currentAmmount--;
      }
      if (plus) {
        currentAmmount++;
      }

      input.value = currentAmmount;
    } else {
      throw new Error("No se detectó ningún botón");
    } 
  }
}

export default Controller;
