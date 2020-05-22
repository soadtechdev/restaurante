import axios from "axios";
import Swal from "sweetalert2";

export default class Producto {
  constructor(id) {
    this.id = id;
  }

  async getProducto() {
    try {
      const respuesta = await axios(
        `http://api.soadtech.com/productos/${this.id}`
      );
      this.title = respuesta.data.nombre;
      this.precio = respuesta.data.precio;
      this.imagen = respuesta.data.imagen;
      this.servings = 0;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al obtener los productos",
      });
    }
  }

  updateServing(type) {
    //serving
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    //ingredients
    this.servings = newServings;
  }
}
