//model
import axios from "axios";
import Swal from "sweetalert2";
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResultados() {
    try {
      const resultado = await axios(`http://api.soadtech.com/productos`);

      this.productos = resultado.data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudieron obtener los platos",
      });
    }
  }
}
