import { elements } from "./base";

export const clearProducto = () => {
  elements.shopping.innerHTML = "";
};

export const renderItem = (item) => {
  const markup = `<li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" class="shopping__count-value" min="1">
                        
                    </div>
                    <p class="shopping__description">${item.unit}</p>
                    <p class="shopping__description">${item.price}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>`;

  elements.shopping.insertAdjacentHTML("beforeend", markup);
};
export const deleteItem = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if (item) item.parentElement.removeChild(item);
};
