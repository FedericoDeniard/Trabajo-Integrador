import createCardMedia from "../../utils/productCard.js";

class View {
    constructor() {
        this.$products = this.$("products");
        this.chboxPeliculas = this.$("peliculas");
        this.chboxSeries = this.$("series");
    }

    $(id) {
        return document.getElementById(id);
    }

    loadProducts(products) {
        let htmlText = "";
        if(products.length === 0) {
            this.$products.innerHTML = "<p class='no-products'>No hay contenido para ver</p>"
            return
        }
        products.forEach((p) => {
            htmlText += createCardMedia({
                id: p.id,
                title: p.title,
                date: p.date,
                directors: p.directors,
                rate: p.rate,
                thumbnail: p.thumbnail,
                description: p.description,
                genres: p.genres,
                price: p.price,
                seasons: p.seasons,
                ammount: 1,
                cart: false
            });
        })
    this.$products.innerHTML += htmlText;
    }
}

export default View;