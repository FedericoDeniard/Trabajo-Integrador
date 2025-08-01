import cookiesReader from "../../utils/getCookies.js";
import userManager from "../../utils/user.js";
import Model from "./model.js";
import View from "./view.js";

export default class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  async init() {
    this.checkUser();
    this.view.showLoader();
    this.renderWrapper();
    this.productButtonsListener();
    this.clearCartCotroller();
    this.modalControllers();
    this.view.hideLoader();
    this.logoutController();
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
        this.renderWrapper();
      }

      if (target.classList.contains("btn-plus")) {
        this.model.increaseAmount(productId);
        this.renderWrapper();
      }

      if (target.classList.contains("btn-cart")) {
        this.model.removeProduct(productId);
        this.renderWrapper();
      }
    });
  }

  clearCartCotroller() {
    this.view.$clearCart.addEventListener("click", () => {
      this.model.clearCart();
      this.renderWrapper();
    });
  }

  modalControllers() {
    this.view.$buyAll.addEventListener("click", () => {
      this.view.$modal.showModal();
    });
    this.view.$modalCloseButton.addEventListener("click", () => {
      this.view.$modal.close();
    });
    this.view.$modalSendButton.addEventListener("click", async () => {
      this.view.$modal.close();
      try {
        const ticketResponse = await this.model.purchaseProducts();
        const newWindow = window.open("");
        newWindow.document.body.innerHTML = ticketResponse.html;
        userManager.logout();
        window.location.href = cookiesReader.urlBase;
      } catch (error) {
        console.log(error);
      }
    });
  }

  changeButtonsState() {
    if (this.model.products.length === 0) {
      this.view.$buyAll.disabled = true;
      this.view.$clearCart.disabled = true;
    } else {
      this.view.$buyAll.disabled = false;
      this.view.$clearCart.disabled = false;
    }
  }

  async renderWrapper() {
    this.changeButtonsState();
    this.view.renderProducts(await this.model.getProducts());
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
