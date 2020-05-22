import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searResPages.innerHTML = "";
};
export const highlightSelected = (id) => {
  //eliminamos la clase de los activos
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });

  document
    .querySelector(`a[href="#${id}"]`)
    .classList.add("results__link--active");
};

/** ################## MOSTRANDO LOS PRODUCTOS ################### */
const renderProducts = (product) => {
  const markup = `<li>
                    <a class="results__link" href="#${product._id}">
                        <figure class="results__fig">
                            <img src="http://api.soadtech.com/${product.imagen}" alt="${product.nombre}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${product.nombre}</h4>
                            <p class="results__author">$ ${product.precio}</p>
                        </div>
                    </a>
                </li>`;

  //colocar en la UI
  if (product.activo) {
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
  }
};

/** ################## CREAR BOTONES ################### */
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
        <span>Pagina ${type === "prev" ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${
                  type === "prev" ? "left" : "right"
                }"></use>
            </svg>
                    
    </button>`;

/** ################## mostrando los botones ################### */
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    //un boton para la siguiente pagina
    button = createButton(page, "next");
  } else if (page < pages) {
    //ambos botones
    button = `
          ${createButton(page, "prev")}
          ${createButton(page, "next")}
          `;
  } else if (page === pages && pages > 1) {
    //un boton para la anterior pagina
    button = createButton(page, "prev");
  }
  elements.searResPages.insertAdjacentHTML("afterbegin", button);
};

/** ################## mostrando los productos ################### */
export const renderResult = (products, page = 1, resPerPage = 5) => {
  //render result of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  products.slice(start, end).forEach(renderProducts);

  //render buttons
  renderButtons(page, products.length, resPerPage);
};
