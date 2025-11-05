const boton = document.getElementById("toggleForm");
const form = document.getElementById("formContainer");
const selectCanciones = document.getElementById("cancion");

// mostrar/ocultar formulario
boton.addEventListener("click", async () => {
  form.classList.toggle("oculto");
  const abierto = !form.classList.contains("oculto");
  boton.textContent = abierto ? "Ocultar formulario" : "Añadir canciones";
  boton.setAttribute("aria-expanded", abierto);

  if (abierto) {
    await cargarCancionesNuevas();
    selectCanciones.focus();
  }
});

// cargar canciones nuevas
async function cargarCancionesNuevas() {
  try {
    const res = await fetch(`${API_URL}/api/nuevas`);
    const canciones = await res.json();
    const almacenadas = JSON.parse(localStorage.getItem("cancionesAñadidas")) || [];
    const idsGuardados = almacenadas.map(c => c.id);

    const disponibles = canciones.filter(c => !idsGuardados.includes(c.id));

    selectCanciones.innerHTML = '<option value=""> . . . </option>';
    disponibles.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.titulo;
      selectCanciones.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las canciones:", error);
    selectCanciones.innerHTML = "<option>Error al cargar</option>";
  }
}

// notificación
function mostrarNotificacion(mensaje) {
  const noti = document.getElementById("notificacion");
  const sonido = document.getElementById("sonidoNotificacion");

  noti.textContent = mensaje;
  noti.setAttribute("role", "status"); 
  noti.setAttribute("aria-live", "polite"); //accesibilidad
  noti.classList.add("mostrar");

  sonido.currentTime = 0;
  sonido.play().catch(() => console.warn("El sonido no se pudo reproducir"));

  setTimeout(() => noti.classList.remove("mostrar"), 2500);
}

// añadir canción desde el dropdown
selectCanciones.addEventListener("change", async () => {
  const idSeleccionado = selectCanciones.value;
  if (!idSeleccionado) return;

  try {
    const res = await fetch(`${API_URL}/api/nuevas`);
    const canciones = await res.json();
    const seleccionada = canciones.find(c => c.id == idSeleccionado);

    if (seleccionada) {
      agregarCancionAlGrid(seleccionada);

      const almacenadas = JSON.parse(localStorage.getItem("cancionesAñadidas")) || [];
      if (!almacenadas.some(c => c.id === seleccionada.id)) {
        almacenadas.push(seleccionada);
        localStorage.setItem("cancionesAñadidas", JSON.stringify(almacenadas));
      }

      mostrarNotificacion(`"${seleccionada.titulo}" añadida al catalogo ♪`);

      selectCanciones.querySelector(`option[value="${idSeleccionado}"]`)?.remove();
      selectCanciones.value = "";
    }
  } catch (error) {
    console.error("Error al añadir la cancion:", error);
  }
});
