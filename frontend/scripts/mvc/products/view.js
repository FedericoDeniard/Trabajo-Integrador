import createCardMedia from "../../utils/productCard.js";

class View {
  constructor() {
    this.$cartCount = this.$("cart-count");
    this.$products = this.$("products");
    this.$chboxPeliculas = this.$("peliculas");
    this.$chboxSeries = this.$("series");
    this.$loader = this.$("general-loader");
    this.$logout = this.$("logout");
    this.$prevPage = this.$("prev-page");
    this.$nextPage = this.$("next-page");
  }

  $(id) {
    return document.getElementById(id);
  }

  loadProducts(products) {
    let htmlText = "";

    products.map((product) => {
      htmlText += createCardMedia(product);
    });

    if (products.length === 0) {
      this.$products.innerHTML =
        "<p class='no-products'>No hay contenido para ver</p>";
      return;
    }
    if (htmlText == "") {
      htmlText += "<p class='no-products'>Elige una categoría</p>";
    }

    this.$products.innerHTML = htmlText;
  }

  updateCard(card, product) {
    const input = card.querySelector(".amount");
    const priceSpan = card.querySelector(".price-span");

    const amount = product.amount;
    input.value = amount;
    const unitaryPrice = Number(product.media.price);
    priceSpan.textContent = (unitaryPrice * amount).toFixed(2);
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

  updateCartCount(amount) {
    this.$cartCount.textContent = amount;
  }
}

export default View;
