import Model from "./model.js";
import View from "./view.js";

export default class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  async init() {
    const products = await this.model.getProducts();
    this.view.renderProducts(products);
  }

  getProductsButtons() {
    for (const product of this.view.$products.children) {
      const buttons = product.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          this.model.updateProductAmount(button, product);
        });
      });
    }
  }
}
