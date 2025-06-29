class ThemeHandler {
    constructor() {
        this.body = document.body;
        this.switch = document.getElementById("theme");
        this.THEME_KEY = "theme";
        this.DARK_CLASS = "dark-theme";
        this.init();
    }

    init () {
        const savedTheme = localStorage.getItem(this.THEME_KEY);

        if (savedTheme === "dark") {
            this.switch.checked = true;
        }

        this.switch.addEventListener("change", () => {
            if (this.switch.checked) {
                this.enableDarkTheme();
                localStorage.setItem(this.THEME_KEY, "dark");
            } else {
                this.disableDarkTheme();
                localStorage.setItem(this.THEME_KEY, "light");
            }
        });
    }

    enableDarkTheme() {
        this.body.classList.add(this.DARK_CLASS);
    }

    disableDarkTheme() {
        this.body.classList.remove(this.DARK_CLASS);
    }
}

const themeHandler = new ThemeHandler();

export default themeHandler;