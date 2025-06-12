import createCardMedia from "../../utils/productCard.js";

class View {
  constructor() {
    this.$products = this.$("products");
    this.$chboxPeliculas = this.$("peliculas");
    this.$chboxSeries = this.$("series");
    this.$loader = this.$("general-loader");
    this.$logout = this.$("logout");
  }

  $(id) {
    return document.getElementById(id);
  }

  loadProducts(products) {
    const showPeliculas = this.$chboxPeliculas.checked;
    const showSeries = this.$chboxSeries.checked;
    let htmlText = "";

    if (products.length === 0) {
      this.$products.innerHTML =
        "<p class='no-products'>No hay contenido para ver</p>";
      return;
    }

    if(showPeliculas) {
      htmlText += this.#filterMedia(products.filter(p => p.duration));
    }

    if(showSeries) {
      htmlText += this.#filterMedia(products.filter(p => p.seasons));;
    }

    if(htmlText == "") {
      htmlText += "<p class='no-products'>Elige una categoría</p>";
    }

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

  #filterMedia(filteredProducts) {
    let htmlText = "";
    filteredProducts.forEach((p) => {
      htmlText += createCardMedia(p);
    })
    return htmlText;
  }
}

export default View;
