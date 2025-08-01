import Model from "./model.js";
import View from "./view.js";
import userManager from "../../utils/user.js";
import cookiesReader from "../../utils/getCookies.js";
import cart from "../../utils/cart.js";

class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  async init() {
    this.checkUser();
    this.updateCartCount();
    this.view.showLoader();
    const products = await this.model.getProducts();
    this.view.loadProducts(products);
    this.checkboxesHandler();
    this.cardButtonsHandler();
    this.view.hideLoader();
    this.logoutController();
    this.paginatorHandler();
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
      b.preventDefault();

      const card = b.target.closest(".product-card");
      const id = Number(card.dataset.id);
      const product = this.model.products.find((p) => p.mediaId === id);

      const minus = b.target.classList.contains("btn-minus");
      const plus = b.target.classList.contains("btn-plus");
      const addToCart = b.target.classList.contains("btn-cart");

      if (minus) {
        this.model.decreaseAmount(id);
        this.view.updateCard(card, product);
      }

      if (plus) {
        this.model.increaseAmount(id);
        this.view.updateCard(card, product);
      }

      if (addToCart) {
        cart.addProduct({ id: product.mediaId, amount: product.amount });
        this.model.resetAmount(id);
        this.view.updateCard(card, product);
      }
      this.updateCartCount();
    });
  }

  updateCartCount() {
    const productsInCart = cart.getProducts();
    const cartAmount = productsInCart.reduce((acc, p) => acc + p.amount, 0);
    this.view.updateCartCount(cartAmount);
  }

  checkboxesHandler() {
    this.view.$chboxPeliculas.addEventListener("change", async () => {
      const showPeliculas = this.view.$chboxPeliculas.checked;
      const showSeries = this.view.$chboxSeries.checked;
      await this.model.changeFilter({ showPeliculas, showSeries });
      this.view.loadProducts(this.model.products);
      this.updatePaginatorButtons();
    });
    this.view.$chboxSeries.addEventListener("change", async () => {
      const showPeliculas = this.view.$chboxPeliculas.checked;
      const showSeries = this.view.$chboxSeries.checked;
      await this.model.changeFilter({ showPeliculas, showSeries });
      this.view.loadProducts(this.model.products);
      this.updatePaginatorButtons();
    });
  }

  paginatorHandler() {
    this.view.$prevPage.addEventListener("click", async () => {
      await this.model.previousPage();
      this.view.loadProducts(this.model.products);
      this.updatePaginatorButtons();
    });

    this.view.$nextPage.addEventListener("click", async () => {
      await this.model.nextPage();
      this.view.loadProducts(this.model.products);
      this.updatePaginatorButtons();
    });

    this.updatePaginatorButtons();
  }

  updatePaginatorButtons() {
    this.view.$nextPage.disabled = !this.model.hasMore;
    this.view.$prevPage.disabled = !this.model.hasPrevious;
  }
}

export default Controller;
