import { elements } from "./base";

export const clearProducto = () => {
  elements.producto.innerHTML = "";
};

//formatear a formato peso
const formatterPeso = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

export const renderProducto = (producto) => {
  const price = formatterPeso.format(producto.precio);
  const markup = `<figure class="recipe__fig">
                <img src="http://api.soadtech.com/${producto.imagen}" alt="${producto.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${producto.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <span class="recipe__info-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </span>
                    <span class="recipe__info-data recipe__info-data--minutes">${price}</span>
                    
                </div>
                <div class="recipe__info">
                    <span class="recipe__info-icon">
                        <i class="fas fa-shopping-basket"></i>
                    </span>
                    <span class="recipe__info-data recipe__info-data--people">0</span>
                    <span class="recipe__info-text"> seleccionados</span>
                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                        
                    </div>
                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                    
                </button>
            </div>
            <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            `;
  elements.producto.insertAdjacentHTML("afterbegin", markup);
};

export const updateServings = (producto) => {
  //update counts
  document.querySelector(".recipe__info-data--people").textContent =
    producto.servings;
};
