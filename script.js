// URL del backend (render)
const API_URL = "https://otgw-server.onrender.com";

// cargar canciones del servidor + locales
async function cargarCanciones() {
  try {
    const res = await fetch(`${API_URL}/api/canciones`);
    const cancionesServidor = await res.json();

    const almacenadas = JSON.parse(localStorage.getItem("cancionesAñadidas")) || [];
    const contenedor = document.getElementById("listaCanciones");
    contenedor.innerHTML = "";

    const todas = [...cancionesServidor, ...almacenadas];

    for (const cancion of todas) {
      agregarCancionAlGrid(cancion);
      await new Promise(r => setTimeout(r, 300));
    }
  } catch (error) {
    console.error("Error cargando canciones:", error);
    document.getElementById("listaCanciones").innerHTML = "<p>Error al cargar los datos</p>";
  }
}

cargarCanciones();

// tarjeta de canción
function agregarCancionAlGrid(cancion) {
  const lista = document.getElementById("listaCanciones");
  const div = document.createElement("div");
  div.classList.add("cancion-card");
  div.dataset.id = cancion.id;
  div.setAttribute("tabindex", "0"); // para teclado

  // datos de canción
  const info = document.createElement("div");
  info.classList.add("cancion-info");
  info.innerHTML = `
    <h3>${cancion.titulo}</h3>
    <p><strong>Artista:</strong> ${cancion.artista}</p>
  `;
  div.appendChild(info);

  // reproductor o embed de spotify
  if (cancion.link && cancion.link.toLowerCase().endsWith(".mp3")) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.classList.add("control-audio");
    audio.src = cancion.link;
    div.appendChild(audio);
  } else if (cancion.link) {
    try {
      const url = new URL(cancion.link);
      const embedURL = `https://open.spotify.com/embed${url.pathname}`;
      const iframe = document.createElement("iframe");
      iframe.src = embedURL;
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      iframe.title = `Spotify: ${cancion.titulo} - ${cancion.artista}`;
      iframe.style.width = "100%";
      iframe.style.height = "80px";
      iframe.style.border = "0";

      const wrapper = document.createElement("div");
      wrapper.classList.add("spotify-wrapper");
      wrapper.appendChild(iframe);
      div.appendChild(wrapper);
    } catch (error) {
      console.error("Error al crear iframe de Spotify:", error);
    }
  }

  // botón para eliminar
  const eliminarBtn = document.createElement("button");
  eliminarBtn.classList.add("eliminar-btn");
  eliminarBtn.setAttribute("aria-label", `Eliminar ${cancion.titulo}`);
  eliminarBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>
  `;
  eliminarBtn.addEventListener("click", () => eliminarCancion(cancion.id, div));
  div.appendChild(eliminarBtn);

  lista.appendChild(div);
}

// eliminar canción del DOM y localStorage
function eliminarCancion(id, div) {
  div.remove();
  let almacenadas = JSON.parse(localStorage.getItem("cancionesAñadidas")) || [];
  const nuevas = almacenadas.filter(c => c.id !== id);
  localStorage.setItem("cancionesAñadidas", JSON.stringify(nuevas));
}


//ping al backend

function despertarBackend() {
  fetch("https://otgw-server.onrender.com") // tu URL aquí
    .then(response => response.json())
    .then(data => console.log("Backend despertado:", data))
    .catch(err => console.log("Error al despertar backend:", err));
}

// Llamamos a la función cuando carga la página
window.addEventListener("load", () => {
  despertarBackend();
});
