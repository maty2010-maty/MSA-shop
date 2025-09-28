<script type="module">
  import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

  // Inicializar EmailJS con tu Public Key
  emailjs.init('PhV4Hp36EPOLiGe6t');

  // Función para obtener el carrito
  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  // Mostrar el carrito en la página
  function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalTexto = document.getElementById("total");
    const carrito = obtenerCarrito();
    lista.innerHTML = "";
    let total = 0;
    carrito.forEach((item, index) => {
      total += item.precio;
      const li = document.createElement("li");
      li.textContent = `${item.nombre} - Talla: ${item.talla}${item.color ? ", Color: " + item.color : ""} - $${item.precio} MXN`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("btn-red");
      btnEliminar.style.padding = "5px 10px";
      btnEliminar.style.fontSize = "14px";
      btnEliminar.onclick = () => {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
      };
      li.appendChild(btnEliminar);
      lista.appendChild(li);
    });
    totalTexto.textContent = `Total: $${total} MXN`;
  }

  // Vaciar carrito
  document.getElementById("btn-vaciar").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    mostrarCarrito();
  });

  // Mostrar formulario de compra
  const btnProceder = document.getElementById("btn-proceder");
  const formCompra = document.getElementById("form-compra");
  btnProceder.addEventListener("click", () => {
    formCompra.style.display = "block";
    btnProceder.style.display = "none";
  });

  // Enviar formulario con EmailJS
  formCompra.addEventListener("submit", async (e) => {
    e.preventDefault();

    const confirmacion = confirm("¿Estás seguro que deseas realizar la compra?");
    if (!confirmacion) {
      alert("Compra cancelada");
      return;
    }

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const ciudad = document.getElementById("ciudad").value;
    const codigo = document.getElementById("codigo").value;

    const carrito = obtenerCarrito();
    const productos = carrito.map(p => `${p.nombre} - Talla: ${p.talla}, Color: ${p.color || 'N/A'} - $${p.precio}`).join("\n");
    const total = carrito.reduce((acc, p) => acc + p.precio, 0);

    try {
      await emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', {
        nombre: nombre,
        email: email,
        telefono: telefono,
        direccion: direccion,
        ciudad: ciudad,
        codigo: codigo,
        productos: productos,
        total: total
      });
      alert("✅ Pedido enviado correctamente!");
      formCompra.style.display = "none";
      document.getElementById("procesando").style.display = "block";
      localStorage.removeItem("carrito");
    } catch (error) {
      console.error("Error EmailJS completo:", error);
      alert("❌ Error al enviar el pedido. Revisa la consola (F12) para ver el mensaje completo.");
    }
  });

  document.addEventListener("DOMContentLoaded", mostrarCarrito);
</script>
