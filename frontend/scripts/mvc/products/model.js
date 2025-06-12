import cookiesReader from "../../utils/getCookies.js";

class Model {
  products = [];
  urlBase = cookiesReader.urlBase;

  async getProducts() {
    const products = await this.#fetchProducts();
    this.products = products.map(p => ({ ...p, amount: 1 }));
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

  decreaseAmount(productId) {
    const product = this.products.find(p => p.mediaId === productId);
    if (product) {
      if (product.amount > 1) {
        product.amount--;
      }
    }
  }

  increaseAmount(productId) {
    const product = this.products.find(p => p.mediaId === productId);
    if (product) {
      product.amount++;
    }
  }
}

export default Model;
