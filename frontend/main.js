import userManager from "./scripts/utils/user.js";

class View {
  constructor() {
    this.$form = document.querySelector(".welcome-page__form");
    this.$formInput = document.querySelector(".welcome-page__form input");
  }
}

class Controller {
  constructor() {
    this.view = new View();
    this.formEventListener();
  }

  formEventListener() {
    this.view.$form.addEventListener("submit", (e) => {
      if (!this.view.$form.checkValidity()) {
        return;
      }
      e.preventDefault();
      const username = this.view.$formInput.value;

      userManager.user = username;
      window.location.href = this.view.$form.action;
    });
  }
}

const controller = new Controller();
