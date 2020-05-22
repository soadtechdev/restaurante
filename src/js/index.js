//controllador
import Search from "./models/Search";
import Producto from "./models/Producto";
import List from "./models/List";
import Swal from "sweetalert2";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as productoView from "./views/productoView";
import * as listView from "./views/listView";
import emailjs from "emailjs-com";

/** blobal state of the app
 * -Objeto de busqueda
 * - Current product object
 * - shopping list object
 * - liked products
 */

const state = {};

const controlSearch = async () => {
  //obtener la consulta de la vista
  const query = searchView.getInput();

  //if (query) {
  //nueva busqueda de objeto y agregarlo al state
  state.search = new Search();

  //preparar UI para resultados
  searchView.clearInput();
  searchView.clearResults();
  renderLoader(elements.searchRes);

  //busqueda de productos
  await state.search.getResultados();

  //mostrar resultados en la UI
  clearLoader();
  searchView.renderResult(state.search.productos);
  //}
};

//obtener los platos apenas cargue la pagina
(function () {
  controlSearch();
})();

/** ################## submit formulario ################### */
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

/** ################## cambiando de pagina ################### */
elements.searResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResult(state.search.productos, goToPage);
  }
});

/** PRODUCTO CONTROLLER
 * -
 */
const controlRecipe = async () => {
  //obtener id por la url
  const id = window.location.hash.replace("#", "");

  if (id.length) {
    //preperando la Ui paor cambios
    productoView.clearProducto();
    renderLoader(elements.producto);

    //highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    //crear nuevo objeto de recepta
    state.producto = new Producto(id);
    try {
      //obtener producto
      await state.producto.getProducto();

      //mostrar los productos en la UI
      clearLoader();
      productoView.renderProducto(state.producto);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al procesar el plato",
      });
    }
  }
};

//["haschange", "load"].forEach((e) => window.addEventListener(e, controlRecipe));
window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);

//handle recipe buttons click
elements.producto.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //decrease button is clicked
    if (state.producto.servings > 1) {
      state.producto.updateServing("dec");
      productoView.updateServings(state.producto);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //increase button is clicked
    if (state.producto.servings < 15) {
      state.producto.updateServing("inc");
      productoView.updateServings(state.producto);
    }
    //agregar al carrito
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    if (state.producto.servings >= 1) {
      controlList();
    }
  }
});

/** LIST CONTROLLER
 * -
 */
const controlList = () => {
  //crear nueva lista
  if (!state.list) state.list = new List();

  //add ingredientes a la lista
  const item = state.list.addItem(
    state.producto.servings,
    state.producto.title,
    state.producto.precio
  );
  listView.renderItem(item);
};
//funcion para borrar y actualizar la lista de eventos
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //borrar
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //borrandolo del state
    state.list.deleteItem(id);
    console.log("eliminando el: " + id);

    //borrandolo de la vista
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = e.target.value;

    state.list.updateCount(id, parseInt(val));
  }
});

elements.enviar.addEventListener("click", (e) => {
  e.preventDefault();

  //obteniendo lo que el usuario escribe en el form
  const nombre = elements.nombre.value;
  const direccion = elements.direccion.value;
  const mensaje = elements.mensaje.value;
  const array = state.list;

  //si no pone nada en el form
  if (!nombre.length || !direccion.length) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe llenar los datos",
    });

    //si no ha agregado nada al carrito
  } else if (typeof array == "undefined") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe agregar productos al carrito",
    });

    //si todo esta bien
  } else {
    let cantidad = 0;
    let total = 0;

    //calcular total de pedido
    array.items.forEach((el) => {
      cantidad = el.price * parseInt(el.count);
      total += cantidad;
    });

    //formateando el precio
    const formatterPeso = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
    const price = formatterPeso.format(total);

    //haciendo el objeto del mensaje que se envia
    const data = {
      service_id: "default_service",
      template_id: "soadtech",
      user_id: "user_6GdP6JwKTkGalJDFkg4hU",
      template_params: {
        username: nombre,
        direccion: direccion,
        mensaje: mensaje,
        array: array,
        total: price,
      },
    };

    //mostrando mensaje para confirmar pedido
    Swal.fire({
      title: "Estas seguro que quieres hacer el pedido?",
      text: "El total a pagar es de: " + price,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, hacerlo",
    }).then((result) => {
      if (result.value) {
        $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
        })
          .done(function () {
            //limpiar form y state
            elements.nombre.value = "";
            elements.direccion.value = "";
            elements.mensaje.value = "";
            state.list.deleteAll();

            //limpiar SHOPPING LIST
            listView.clearProducto();
            Swal.fire("Todo correcto", "El pedido se ha creado", "success");
          })
          .fail(function (error) {
            alert("Oops... " + JSON.stringify(error));
          });
      }
    });
  }
});
