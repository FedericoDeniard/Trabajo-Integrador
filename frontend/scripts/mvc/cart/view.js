import { createModal } from "../../utils/modal.js";
import createCardMedia from "../../utils/productCard.js";

export default class View {
  constructor() {
    this.$products = this.$("products");
    this.$loader = this.$("general-loader");
    this.$clearCart = this.$("clear-cart");
    this.$buyAll = this.$("buy-all");
    this.#createModal();
  }

  $(id) {
    return document.getElementById(id);
  }

  renderProducts(products) {
    this.$products.innerHTML = "";
    if (products.length === 0) {
      this.$products.innerHTML =
        "<p class='no-products'>Oops! Parece que no hay productos en el carrito</p>";
      this.hideLoader();
      return;
    }
    products.forEach((product) => {
      const productCard = createCardMedia({
        id: product.id,
        title: product.title,
        date: product.date,
        directors: product.directors,
        rate: product.rate,
        thumbnail: product.thumbnail,
        description: product.description,
        genres: product.genres,
        price: product.price,
        seasons: product.seasons,
        ammount: product.ammount,
        cart: true,
      });
      this.$products.innerHTML += productCard;
    });
  }

  showLoader() {
    this.$products.style.display = "none";
    this.$loader.style.display = "flex";
    this.$loader.style.flex = "1";
  }

  hideLoader() {
    this.$products.style.display = "flex";
    this.$loader.style.display = "none";
  }

  #createModal() {
    const { modal, closeButton, sendButton } = createModal({
      text: "¿Todo listo para comprar?",
      closeText: "Cancelar",
      sendText: "Comprar",
    });
    this.$modal = modal;
    this.$modalCloseButton = closeButton;
    this.$modalSendButton = sendButton;
  }
}
