import createCardMedia from "../../utils/productCard.js";

class View {
  constructor() {
    this.$products = this.$("products");
    this.chboxPeliculas = this.$("peliculas");
    this.chboxSeries = this.$("series");
    this.$loader = this.$("general-loader");
    this.$logout = this.$("logout");
  }

  $(id) {
    return document.getElementById(id);
  }

  loadProducts(products) {
    let htmlText = "";
    if (products.length === 0) {
      this.$products.innerHTML =
        "<p class='no-products'>No hay contenido para ver</p>";
      return;
    }
    products.forEach((p) => {
      htmlText += createCardMedia(p);
    });
    this.$products.innerHTML = htmlText;
  }

  updateCard(card, product, unitaryPrice) {
    const input = card.querySelector('.amount');
    const priceSpan = card.querySelector('.price-span');

    const amount = product.amount;
    input.value = amount;
    priceSpan.textContent = (unitaryPrice * amount).toFixed(2);
  }

  showLoader() {
    this.$products.style.display = 'none';
    this.$loader.style.display = 'flex';
    this.$loader.style.flex = '1';
  }

  hideLoader() {
    this.$products.style.display = 'flex';
    this.$loader.style.display = 'none';
  }
}

export default View;
