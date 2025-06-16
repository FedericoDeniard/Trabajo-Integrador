import cookiesReader from "../../utils/getCookies.js";

class View {
  constructor() {
    this.$form = document.querySelector(".welcome-page__form");
    this.$formInput = document.querySelector(
      ".welcome-page__form input[type='text']"
    );
    this.$formInputPassword = document.querySelector(
      ".welcome-page__form input[type='password']"
    );
    this.$errorMessage = document.querySelector(".error-message");
  }
}

class Controller {
  constructor() {
    this.view = new View();
    this.formEventListener();
  }

  formEventListener() {
    this.view.$form.addEventListener("submit", async (e) => {
      if (!this.view.$form.checkValidity()) {
        return;
      }
      e.preventDefault();
      const user = {
        username: this.view.$formInput.value,
        password: this.view.$formInputPassword.value,
      };
      try {
        await this.login(user);
      } catch (error) {
        console.log(error);
        this.view.$errorMessage.textContent = error.message;
        this.view.$errorMessage.style.display = "block";
      }
      window.location.href = cookiesReader.urlBase + "/api/admin/edit";
    });
  }

  async login(user) {
    const url_base = cookiesReader._urlBase;
    const response = await fetch(`${url_base}/api/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  }
}

const controller = new Controller();
