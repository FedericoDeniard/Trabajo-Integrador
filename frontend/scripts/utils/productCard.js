function createCardMedia({title: string,
    date: Date, 
    directores: string, 
    rate: number, 
    thumbnail: string, 
    description: string, 
    genres: string, 
    price: number, 
    seasons: number = null}) {
    return `<div>
        <h2>${title}
        ${date ? `<em>(${date.getFullYear()})</em>` : ""}</h2>
        <p>${directores}</p>
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

            <p>$<span>${price}</span><p>
            <button type="submit">Agregar al carrito</button>
        </form>
    </div>`
}

console.log(createCardMedia('si', new Date(2222,2,2), 3.4, 'https://prueba.com', '', 'si, si si', 5, 6))