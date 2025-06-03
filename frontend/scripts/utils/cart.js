class Cart {
  products = [];
  constructor() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      this.products = JSON.parse(storedCart);
    }
  }

  addProduct({ id, ammount }) {
    const product = { id, ammount };
    const productInCart = this.products.find((p) => p.id == id);
    if (productInCart) {
      productInCart.ammount += ammount;
    } else {
      this.products.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(this.products));
    this.products = this.getProducts();
  }

  decreaseAmount({ id, ammount }) {
    const productInCart = this.products.find((p) => p.id == id);
    if (productInCart) {
      productInCart.ammount -= ammount;
      if (productInCart.ammount <= 0) {
        this.products = this.products.filter((p) => p.id != id);
      }
    }
    localStorage.setItem("cart", JSON.stringify(this.products));
    this.products = this.getProducts();
  }

  increaseAmount({ id, ammount }) {
    const productInCart = this.products.find((p) => p.id == id);
    if (productInCart) {
      productInCart.ammount += ammount;
    }
    localStorage.setItem("cart", JSON.stringify(this.products));
    this.products = this.getProducts();
  }

  removeProduct({ id }) {
    this.products = this.products.filter((p) => p.id != id);
    localStorage.setItem("cart", JSON.stringify(this.products));
    this.products = this.getProducts();
  }

  clearCart() {
    this.products = [];
    localStorage.removeItem("cart");
    this.products = this.getProducts();
  }

  getProducts() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      this.products = JSON.parse(storedCart);
      return this.products;
    }
    return [];
  }
}

const cart = new Cart();

export default cart;
