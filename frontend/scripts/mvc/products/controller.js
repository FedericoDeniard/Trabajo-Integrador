import Model from "./model.js";
import View from "./view.js";

class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  async init() {
    const products = await this.model.getProducts();
    this.view.loadProducts(products);
  }
}

export default Controller;
