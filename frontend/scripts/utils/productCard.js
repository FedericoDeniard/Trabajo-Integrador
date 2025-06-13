export default function createCardMedia({
  duration = undefined,
  id,
  media,
  amount = 1,
  mediaId,
  released_date = undefined,
  seasons = undefined,
  cart = false,
}) {
  if (!id) throw new Error("'id' no está definido");
  if (!media.available) throw new Error("'available' no está definido");
  if (!media.description) throw new Error("'description' no está definido");
  if (!media.directors) throw new Error("'directors' no está definido");
  if (!media.genres) throw new Error("'genres' no está definido");
  if (!media.id) throw new Error("'id' no está definido");
  if (!media.price) throw new Error("'price' no está definido");
  if (!media.rate) throw new Error("'rate' no está definido");
  if (!media.thumbnail) throw new Error("'thumbnail' no está definido");
  if (!media.title) throw new Error("'title' no está definido");

  const released_dateFormated = released_date
    ? formateDate(released_date)
    : seasons[0].released_date
    ? formateDate(seasons[0].released_date)
    : "";

  return `<div class="product-card" data-id="${media.id}">
        <div class="header">
          <div class="left-header">
            <h2><span>${media.title}</span>
            ${
              released_dateFormated
                ? `<em>(${released_dateFormated})</em>`
                : ""
            }</h2>
            <p class="sub-directors">${media.directors
              .map((d) => d.director.name)
              .join(", ")}</p>
            ${seasons ? `<p>${seasons.length} temporadas</p>` : ""}
          </div>
          <div class="right-header">
            <span>✮${media.rate}</span>
          </div>
        </div>
        <div class="img-container">
        <img src="${media.thumbnail}" alt="${
    media.title
  }" onerror="this.src='../../images/not-found.png'"/>
        </div>
        <p class="description"><b>Descripción:</b> ${media.description}</p>
        <p class="genres"><b>Géneros:</b> ${media.genres
          .map((g) => g.genre.name)
          .join(", ")}</p>
        
        <form class="card-form">
            <div class="form-left">
              <label>Meses a alquilar</label>
              <div class="quantity-btns">
                <button type="button" class="btn-minus">-</button>
                <input type="text" value="${amount}" disabled class="amount"/>
                <button type="button" class="btn-plus">+</button>
              </div>
            </div>

            <div class="form-right">
              <p class="price">$<span class="price-span">${media.price * amount}</span></p>
              <button type="submit" class="btn-cart">${
                cart ? "Quitar del carrito" : "Agregar al carrito"
              }</button>
            </div>
        </form>
    </div>`;
}

const formateDate = (date) => {
  let dateFormated = new Date(date);
  const year = dateFormated.getFullYear();
  return `${year}`;
};
