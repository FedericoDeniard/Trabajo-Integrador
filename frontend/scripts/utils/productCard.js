export default function createCardMedia({
  duration = undefined,
  id,
  media,
  amount = 0,
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

  return `<div class="product-card" data-id="${id}">
        <h2>${media.title}
        ${
          released_dateFormated ? `<em>(${released_dateFormated})</em>` : ""
        }</h2>
        <p>${media.directors.map((d) => d.director.name).join(", ")}</p>
        ${seasons ? `<p>${seasons.length} temporadas</p>` : ""}
        <span>${media.rate}</span>
        <img src="${media.thumbnail}" alt="${media.title}"/>
        <p>Descripción: ${media.description}</p>
        <p>Géneros: ${media.genres.map((g) => g.genre.name).join(", ")}</p>
        
        <form>
            <div>
                <button type="button" class="btn-minus">-</button>
                <input type="number" value="${amount}" min="1" max="5" />
                <button type="button" class="btn-plus">+</button>
            </div>

            <p>$<span>${media.price}</span></p>
            <button type="submit" class="btn-cart">${
              cart ? "Quitar del carrito" : "Agregar al carrito"
            }</button>
        </form>
    </div>`;
}

const formateDate = (date) => {
  let dateFormated = new Date(date);
  const year = dateFormated.getFullYear();
  const month = dateFormated.getMonth() + 1;
  const day = dateFormated.getDate();
  return `${year}-${month}-${day}`;
};
