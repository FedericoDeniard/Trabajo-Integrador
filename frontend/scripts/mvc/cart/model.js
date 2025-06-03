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
    return products;
  }

  async #fetchProductByIds(ids) {
    if (ids.length === 0) return [];
    const response = await fetch(
      `http://localhost:8000/api/products/ids?ids=${ids.join(",")}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const data = await response.json();
    return data.data;
  }

  removeProduct(id) {
    cart.removeProduct({ id });
    this.#updateProducts();
  }

  clearCart() {
    cart.clearCart();
    this.products = [];
  }

  decreaseAmount(id) {
    cart.decreaseAmount({ id, ammount: 1 });
    this.#updateProducts();
  }

  increaseAmount(id) {
    cart.increaseAmount({ id, ammount: 1 });
    this.#updateProducts();
  }

  #updateProducts() {
    const localStorageProducts = cart.getProducts();

    this.products = this.products.filter((product) =>
      localStorageProducts.some((p) => p.id === product.id)
    );

    this.products.forEach((product) => {
      const productSaved = localStorageProducts.find(
        (p) => p.id === product.id
      );
      if (productSaved) {
        product.ammount = productSaved.ammount;
      }
    });
  }
}

export default Model;
