import cookiesReader from "../../utils/getCookies.js";

class Model {
  products = [];
  urlBase = cookiesReader.urlBase;

  async getProducts() {
    const products = await this.#fetchProducts();
    this.products = products;
    return products;
  }

  async #fetchProducts() {
    const response = await fetch(`${this.urlBase}/api/products`);
    if (!response.ok) {
      throw new Error("No se pudo obtener los productos");
    }
    const result = await response.json();
    return result.data;
  }
}

export default Model;
