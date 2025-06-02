function createCardMedia({title: string,
    date: Date, 
    directors: string, 
    rate: number, 
    thumbnail: string, 
    description: string, 
    genres: string, 
    price: number, 
    seasons: number = null}) {
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

            <p>$<span>${price}</span><p>
            <button type="submit">Agregar al carrito</button>
        </form>
    </div>`
}

console.log(createCardMedia({title:'si', date: new Date(2222,2,2), directors: 'juan', rate: 3.4, thumbnail:'https://prueba.com', description:'x', genres:'x', price:5, seasons:6}))