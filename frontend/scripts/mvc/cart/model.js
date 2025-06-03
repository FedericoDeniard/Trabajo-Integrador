import cart from "../../utils/cart.js";

class Model {
  products = [];

  constructor() {
    this.products = cart.getProducts();
  }

  async getProducts() {
    const ids = this.products.map((p) => p.id);
    const products = await this.#fetchProductByIds(ids);
    for (const id of ids) {
      const product = products.find((p) => p.id === id);
      if (product) {
        product.ammount = this.products.find((p) => p.id === id).ammount;
      }
    }
    this.products = products;
    console.log(products);
    return products;
  }

  async #fetchProductByIds(ids) {
    const response = await fetch(
      `http://localhost:8000/api/products/ids?ids=${ids.join(",")}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const data = await response.json();
    return data.data;
  }
}

export default Model;
