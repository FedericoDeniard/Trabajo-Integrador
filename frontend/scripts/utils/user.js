import cart from "./cart.js";

class UserManager {
  _user = "";
  cartManager = cart;

  constructor() {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      this._user = storedUser;
    }
  }

  set user(username) {
    sessionStorage.setItem("user", username);
    this._user = username;
  }

  get user() {
    return this._user;
  }

  logout() {
    this._user = "";
    sessionStorage.removeItem("user");
    this.cartManager.clearCart();
  }

  isLogged() {
    return this._user !== "";
  }
}

const userManager = new UserManager();
export default userManager;
