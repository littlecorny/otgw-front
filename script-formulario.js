const boton = document.getElementById("toggleForm");
const form = document.getElementById("formContainer");
const selectCanciones = document.getElementById("cancion");

// Mostrar/ocultar el formulario
boton.addEventListener("click", async () => {
  form.classList.toggle("oculto");
  boton.textContent = form.classList.contains("oculto")
    ? "Añadir canciones"
    : "Ocultar formulario";

  if (!form.classList.contains("oculto")) {
    await cargarCancionesNuevas();
  }
});

// --- Cargar canciones nuevas del servidor ---
async function cargarCancionesNuevas() {
  try {
    const res = await fetch(`${API_URL}/api/nuevas`);
    const canciones = await res.json();

    const almacenadas =
      JSON.parse(localStorage.getItem("cancionesAñadidas")) || [];
    const idsGuardados = almacenadas.map(c => c.id);

    const disponibles = canciones.filter(
      cancion => !idsGuardados.includes(cancion.id)
    );

    selectCanciones.innerHTML = '<option value=""> . . . </option>';

    disponibles.forEach(cancion => {
      const option = document.createElement("option");
      option.value = cancion.id;
      option.textContent = cancion.titulo;
      selectCanciones.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las canciones:", error);
    selectCanciones.innerHTML = "<option>Error al cargar</option>";
  }
}

// --- Función global para mostrar notificación + sonido ---
function mostrarNotificacion(mensaje) {
  const noti = document.getElementById("notificacion");
  const sonido = document.getElementById("sonidoNotificacion");

  noti.textContent = mensaje;
  noti.classList.add("mostrar");

  // 🔔 Reproducir campanita
  sonido.currentTime = 0; // reinicia si ya sonó
  sonido.play().catch(() => {
    console.warn("El sonido no se pudo reproducir automáticamente");
  });

  setTimeout(() => {
    noti.classList.remove("mostrar");
  }, 2500);
}

// --- Cuando el usuario selecciona una canción ---
selectCanciones.addEventListener("change", async () => {
  const idSeleccionado = selectCanciones.value;
  if (!idSeleccionado) return;

  try {
    const res = await fetch(`${API_URL}/api/nuevas`);
    const canciones = await res.json();
    const seleccionada = canciones.find(c => c.id == idSeleccionado);

    if (seleccionada) {
      agregarCancionAlGrid(seleccionada);

      const almacenadas =
        JSON.parse(localStorage.getItem("cancionesAñadidas")) || [];

      const yaExiste = almacenadas.some(c => c.id === seleccionada.id);
      if (!yaExiste) {
        almacenadas.push(seleccionada);
        localStorage.setItem("cancionesAñadidas", JSON.stringify(almacenadas));
      }

      // ✅ Aquí ya puedes llamar a la función global
      mostrarNotificacion(`"${seleccionada.titulo}" añadida al catalogo ♪`);

      selectCanciones
        .querySelector(`option[value="${idSeleccionado}"]`)
        ?.remove();
      selectCanciones.value = "";
    }
  } catch (error) {
    console.error("❌ Error al añadir la cancion:", error);
  }
});
