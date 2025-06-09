class CookiesReader {
  constructor() {
    this._urlBase = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("url_base="))
      ?.split("=")[1];

    if (this._urlBase) {
      this._urlBase = decodeURIComponent(this._urlBase);
    }
  }

  get urlBase() {
    return this._urlBase;
  }
}

const cookiesReader = new CookiesReader();

export default cookiesReader;
