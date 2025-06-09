import createCardMedia from "../../utils/productCard.js";

class View {
  constructor() {
    this.$products = this.$("products");
    this.chboxPeliculas = this.$("peliculas");
    this.chboxSeries = this.$("series");
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
      const product = { ...p, amount: 1, cart: true };
      htmlText += createCardMedia(product);
    });
    this.$products.innerHTML += htmlText;
  }
}

export default View;
