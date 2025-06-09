import cart from "../../utils/cart.js";
import cookiesReader from "../../utils/getCookies.js";

class Model {
  products = [];
  urlBase = cookiesReader.urlBase;

  constructor() {
    this.products = cart.getProducts();
  }

  async getProducts() {
    const ids = this.products.map((p) => p.id);
    const products = await this.#fetchProductByIds(ids);
    for (const id of ids) {
      const product = products.find((p) => p.id === id);
      if (product) {
        product.amount = this.products.find((p) => p.id === id).amount;
        product.cart = true;
      }
    }
    this.products = products;
    return products;
  }

  async #fetchProductByIds(ids) {
    if (ids.length === 0) return [];
    const response = await fetch(
      `${this.urlBase}/api/products/ids?ids=${ids.join(",")}`
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
    cart.decreaseAmount({ id, amount: 1 });
    this.#updateProducts();
  }

  increaseAmount(id) {
    cart.increaseAmount({ id, amount: 1 });
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
        product.amount = productSaved.amount;
      }
    });
  }

  async purchaseProducts() {
    console.log(cart.getProducts());
    const response = await fetch(`${this.urlBase}/api/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: this.products }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    this.clearCart();
    const data = await response.json();
    return data.data;
  }
}

export default Model;
