import createCardMedia from "../../utils/productCard.js";

export default class View {
  constructor() {
    this.$products = this.$("products");
    this.$loader = this.$("general-loader");
    this.$clearCart = this.$("clear-cart");
    this.$buyAll = this.$("buy-all");
  }

  $(id) {
    return document.getElementById(id);
  }

  renderProducts(products) {
    this.showLoader();
    this.$products.innerHTML = "";
    setTimeout(() => {
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
      this.hideLoader();
    }, 0);
  }

  showLoader() {
    this.$loader.style.display = "flex";
  }

  hideLoader() {
    this.$loader.style.display = "none";
  }
}
