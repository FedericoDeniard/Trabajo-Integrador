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

      const minus = b.target.classList.contains('btn-minus');
      const plus = b.target.classList.contains('btn-plus');
      const addToCart = b.target.classList.contains('btn-cart');

      if(minus) {
        this.model.decreaseAmount(id);
        this.view.updateCard(card, product);
      }

      if(plus) {
        this.model.increaseAmount(id);
        this.view.updateCard(card, product);
      }

      if(addToCart) {

      }
    });

    // if(addToCart) {

    // } else if (minus || plus) {
    //   this.#cardAmmountPrice(minus, plus, b);
    // } else {
    //   throw new Error("No se detectó ningún botón");
    // } 
  }

  // #cardAmmountPrice(minus, plus, b) {
  //   const card = b.target.closest('.product-card');
  //     const id = card.dataset.id;
  //     const input = card.querySelector('.amount');
  //     const priceSpan = card.querySelector('.price-span');

  //     const product = this.model.products.find(p => p.media.id == id);
  //     if (!product) throw new Error("Producto no encontrado");

  //     const unitaryPrice = product.media.price;
  //     let currentAmount = parseInt(input.value);
  //     let currentPrice = unitaryPrice;

  //     if (minus && currentAmount > 1) {
  //       currentAmount--;
  //       currentPrice = unitaryPrice * currentAmount;
  //     }
  //     if (plus) {
  //       currentAmount++;
  //       currentPrice = unitaryPrice * currentAmount;
  //     }

  //     input.value = currentAmount;
  //     priceSpan.textContent = currentPrice;

  //     product.media.amount = currentAmount;
  // }
}

export default Controller;
