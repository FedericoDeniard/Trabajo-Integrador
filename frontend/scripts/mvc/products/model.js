import cookiesReader from "../../utils/getCookies.js";

class Model {
  products = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalProducts = 0;
  hasMore = false;
  hasPrevious = false;
  urlBase = cookiesReader.urlBase;

  async getProducts() {
    const response = await this.#fetchProducts();
    this.products.push(...response.products.map((p) => ({ ...p, amount: 1 })));
    return this.products;
  }

  async #fetchProducts() {
    const response = await fetch(
      `${this.urlBase}/api/products/paginated?page=${this.currentPage}&limit=${this.pageSize}`
    );
    if (!response.ok) {
      throw new Error("No se pudo obtener los productos");
    }
    const result = await response.json();
    this.hasMore = result.data.hasMore;
    this.currentPage = result.data.currentPage;
    this.pageSize = result.data.pageSize;
    this.totalPages = result.data.totalPages;
    this.totalProducts = result.data.totalProducts;
    this.hasPrevious = result.data.hasPrevious;
    return result.data;
  }

  decreaseAmount(productId) {
    const product = this.products.find((p) => p.mediaId === productId);
    if (product) {
      if (product.amount > 1) {
        product.amount--;
      }
    }
  }

  increaseAmount(productId) {
    const product = this.products.find((p) => p.mediaId === productId);
    if (product) {
      product.amount++;
    }
  }

  resetAmount(productId) {
    const product = this.products.find((p) => p.mediaId === productId);
    if (product) {
      product.amount = 1;
    }
  }

  async nextPage() {
    this.currentPage++;
    this.products = [];
    return await this.getProducts();
  }

  async previousPage() {
    this.currentPage--;
    this.products = [];
    return await this.getProducts();
  }
}

export default Model;
