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
    this.view.$products.addEventListener("click", (b) => this.cardButtonsHandler(b));
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

  cardButtonsHandler(b) {
    const minus = b.target.classList.contains('btn-minus');
    const plus = b.target.classList.contains('btn-plus');
    const addToCart = b.target.classList.contains('btn-cart');

    if(addToCart) {

    } else if (minus || plus) {
      const card = b.target.closest('.product-card');
      const id = card.dataset.id;
      const input = card.querySelector('.ammount');
      const priceSpan = card.querySelector('.price-span');

      const product = this.model.products.find(p => p.media.id == id);
      if (!product) throw new Error("Producto no encontrado");

      const unitaryPrice = product.media.price;
      let currentAmmount = parseInt(input.value);
      let currentPrice = unitaryPrice;

      if (minus && currentAmmount > 1) {
        currentAmmount--;
        currentPrice = unitaryPrice * currentAmmount;
      }
      if (plus) {
        currentAmmount++;
        currentPrice = unitaryPrice * currentAmmount;
      }

      input.value = currentAmmount;
      priceSpan.textContent = currentPrice;
    } else {
      throw new Error("No se detectó ningún botón");
    } 
  }


}

export default Controller;
