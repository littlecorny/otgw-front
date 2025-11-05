# OTGW Fanmade Music Library - Frontend

Esta es la interfaz web de la biblioteca fanmade de *Over the Garden Wall*. Permite visualizar, reproducir y añadir canciones al catálogo.

## 🌐 Despliegue

El frontend está publicado en **Vercel**:

[https://otgw-musiclibrary-nu.vercel.app/]

## 📦 Estructura de archivos

otgw-front/
├─ assets/ # Imágenes, fuentes, iconos, audio de notificación
├─ index.html # Página principal
├─ styles.css # Estilos globales
├─ script.js # Lógica principal de carga y reproducción de canciones
├─ script-formulario.js # Lógica del formulario y dropdown

## 🎯 OBJETIVO 1. HTML — Estructura y semántica

El html de este proyecto es relativamente sencillo, ya que la mayoría del contenido se crea a través del script, que es quien se encarga de generar las tarjetas que se usan para las canciones. 

Teniendo eso en cuenta, vamos a centrarnos en la parte del formulario:

<!-- BOTÓN Y DROPDOWN -->

<section class="dropdown-form" aria-labelledby="toggleForm">

  <button 
    id="toggleForm" 
    class="dropdown-btn" 
    aria-expanded="false" 
    aria-controls="formContainer">
    Añadir canciones
  </button>

  <!-- FORMULARIO -->
  <form id="formContainer" class="formulario oculto">
    <label for="cancion">Selecciona una cancion</label>
    <select id="cancion">
      <option value="">Cargando canciones...</option>
    </select> 
  </form>

</section> 


Primero, he usado la etiqueta <section> para agrupar el formulario y el botón como un bloque temático dentro de la página; al usuario no le proporciona algo en concreto, pero para mí (desarrolladora) me permite editar este elemento y todos sus hijos como un solo bloque en el CSS.


A continuación, he usado la etiqueta <form>:

  <form id="formContainer" class="formulario oculto">
    <label for="cancion">Selecciona una cancion</label>
    <select id="cancion">
        <option value="">Cargando canciones...</option>
      </select> 
  </form>

Su función es, con los datos que le proporciona el servidor, crear un dropdown en el que el usuario pueda elegir cualquiera de las canciones existentes, seleccionarla, y añadirla al grid visual. 
Elegí esta etiqueta ya que crear los datos desde cero, siendo una página temática y muy específica, me pareció contraproducente, teniendo en cuenta que habría que añadir embeds de spotify. Por lo tanto, mantener un elemento interactivo, pero con las facilidades necesarias para el usuario, me pareció lo más correcto.


Por último he usado la etiqueta <button>

<button 
    id="toggleForm" 
    class="dropdown-btn" 
    aria-expanded="false" 
    aria-controls="formContainer">
    Añadir canciones
  </button>

En esta etiqueta podríamos decir que "contenemos" el formulario. 
<!-- TERMINAR ESTA PARTE -->

Este front no tiene nav, header o similares, ya que no está pensado para tener páginas enlazadas o navegación; su propósito es actuar como un marco en el que poder presentar el verdadero punto de la web, que es las canciones del servidor.  


## 🎨 OBJETIVO 2. CSS — Estilo y diseño

