export default function createCardMedia({
  id,
  title,
  date,
  directors,
  rate,
  thumbnail,
  description,
  genres,
  price,
  seasons = null,
  amount = 0,
  cart = false,
}) {
  if (!title) throw new Error("'title' no está definido");
  if (!directors) throw new Error("'directors' no está definido");
  if (rate === undefined || rate === null)
    throw new Error("'rate' no está definido");
  if (!thumbnail) throw new Error("'thumbnail' no está definido");
  if (!description) throw new Error("'description' no está definido");
  if (!genres) throw new Error("'genres' no está definido");
  if (price === undefined || price === null)
    throw new Error("'price' no está definido");

  return `<div class="product-card" data-id="${id}">
        <div class="header">
          <div class="left-header">
            <h2><span>${title}</span>
            ${date ? `<em>(${date.getFullYear()})</em>` : ""}</h2>
            <p class="sub-directors">${directors.map((d) => d.director.name).join(", ")}</p>
            ${seasons ? `<p>${seasons} temporadas</p>` : ""}
          </div>
          <div class="right-header">
            <span>✮${rate}</span>
          </div>
        </div>

        <img src="${thumbnail}" alt="${title}"/>
        <p class="description"><b>Descripción:</b> ${description}</p>
        <p class="genres"><b>Géneros:</b> ${genres.map((g) => g.genre.name).join(", ")}</p>
        
        <form class="card-form">
            <div class="form-left">
              <label>Meses a alquilar</label>
              <div class="quantity-btns">
                <button type="button" class="btn-minus">-</button>
                <input type="text" value="${amount}" disabled/>
                <button type="button" class="btn-plus">+</button>
              </div>
            </div>

            <div class="form-right">
              <p class="price">$<span>${price}</span></p>
              <button type="submit" class="btn-cart">${
                cart ? "Quitar del carrito" : "Agregar al carrito"
              }</button>
            </div>
        </form>
    </div>`;
}
