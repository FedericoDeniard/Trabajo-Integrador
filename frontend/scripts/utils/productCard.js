function createCardMedia({title, date, directors, rate, thumbnail, description, genres, price, seasons = null}) {
    if (!title) throw new Error("'title' no está definido");
    if (!directors) throw new Error("'directors' no está definido");
    if (rate === undefined || rate === null) throw new Error("'rate' no está definido");
    if (!thumbnail) throw new Error("'thumbnail' no está definido");
    if (!description) throw new Error("'description' no está definido");
    if (!genres) throw new Error("'genres' no está definido");
    if (price === undefined || price === null) throw new Error("'price' no está definido");
    
    return `<div>
        <h2>${title}
        ${date ? `<em>(${date.getFullYear()})</em>` : ""}</h2>
        <p>${directors}</p>
        ${seasons ? `<p>${seasons} temporadas</p>` : ""}
        <span>${rate}</span>
        <img src="${thumbnail}" alt="${title}"/>
        <p>Descripción: ${description}</p>
        <p>Géneros: ${genres}</p>
        
        <form>
            <div>
                <button type="button">-</button>
                <input type="number" value="1" min="1" max="5" disabled/>
                <button type="button">+</button>
            </div>

            <p>$<span>${price}</span></p>
            <button type="submit">Agregar al carrito</button>
        </form>
    </div>`
}