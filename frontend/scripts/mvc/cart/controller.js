import Model from "./model.js";
import View from "./view.js";

export default class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  async init() {
    this.view.showLoader();
    const products = await this.model.getProducts();
    this.view.renderProducts(products);
    this.productButtonsListener();
    this.clearCartCotroller();
    this.modalControllers();
    this.view.hideLoader();
  }

  productButtonsListener() {
    this.view.$products.addEventListener("click", (e) => {
      const target = e.target;
      e.preventDefault();

      const productCard = target.closest(".product-card");
      if (!productCard) return;

      const productId = productCard.dataset.id;

      if (target.classList.contains("btn-minus")) {
        this.model.decreaseAmount(productId);
        this.view.renderProducts(this.model.products);
      }

      if (target.classList.contains("btn-plus")) {
        this.model.increaseAmount(productId);
        this.view.renderProducts(this.model.products);
      }

      if (target.classList.contains("btn-cart")) {
        this.model.removeProduct(productId);
        this.view.renderProducts(this.model.products);
      }
    });
  }

  clearCartCotroller() {
    this.view.$clearCart.addEventListener("click", () => {
      this.model.clearCart();
      this.view.renderProducts(this.model.products);
    });
  }

  modalControllers() {
    this.view.$buyAll.addEventListener("click", () => {
      this.view.$modal.showModal();
    });
    this.view.$modalCloseButton.addEventListener("click", () => {
      this.view.$modal.close();
      console.log("Cerraste el modal");
    });
    this.view.$modalSendButton.addEventListener("click", () => {
      this.view.$modal.close();
      console.log("Compraste todos los productos");
    });
  }
}
