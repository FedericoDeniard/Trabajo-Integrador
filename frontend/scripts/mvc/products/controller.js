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
    this.cardButtonsHandler();
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

  cardButtonsHandler() {
    this.view.$products.addEventListener("click", (b) => {
      const card = b.target.closest('.product-card');
      const id = Number(card.dataset.id);
      const product = this.model.products.find(p => p.id === id);
      const unitaryPrice = product.media.price;

      const minus = b.target.classList.contains('btn-minus');
      const plus = b.target.classList.contains('btn-plus');
      const addToCart = b.target.classList.contains('btn-cart');

      if(minus) {
        this.model.decreaseAmount(id);
        this.view.updateCard(card, product, unitaryPrice);
      }

      if(plus) {
        this.model.increaseAmount(id);
        this.view.updateCard(card, product, unitaryPrice);
      }

      if(addToCart) {

      }
    });
  }
}

export default Controller;
