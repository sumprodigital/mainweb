(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
// Versión vanilla JS (la más rápida)
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 100 ? 'block' : 'none';
});

backToTop.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
});


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel START
    $(".testimonial-carousel").owlCarousel({
        center: true,
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

// Testimonials carousel END


 
//// PRODUCTOS START * SECCIONES

const RUTA_JSON = '/json/productos.json';
const PRODUCTOS_POR_PAGINA = 8;
const estadoPaginacion = {};

document.addEventListener('DOMContentLoaded', () => {
  fetch(RUTA_JSON)
    .then(res => {
      if (!res.ok) throw new Error(`Error al cargar JSON: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      Object.keys(data).forEach(categoria => {
        const valor = data[categoria];
        if (Array.isArray(valor)) {
          // Categoría sin subcategorías
          inicializarSeccion(categoria, valor);
        } else if (typeof valor === 'object') {
          // Categoría con subcategorías
          Object.keys(valor).forEach(subcat => {
            inicializarSeccion(subcat, valor[subcat]);
          });
        }
      });
    })
    .catch(err => console.error('Error cargando productos:', err));
});

function inicializarSeccion(idSeccion, productos) {
  estadoPaginacion[idSeccion] = {
    paginaActual: 1,
    totalPaginas: Math.ceil(productos.length / PRODUCTOS_POR_PAGINA),
    productos
  };
  mostrarPagina(idSeccion);
  crearControlesPaginacion(idSeccion);
}

function mostrarPagina(idSeccion) {
  const estado = estadoPaginacion[idSeccion];
  const contenedor = document.getElementById(idSeccion);
  if (!contenedor) {
    console.warn(`No se encontró contenedor con id: ${idSeccion}`);
    return;
  }

  const inicio = (estado.paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;
  const productosAMostrar = estado.productos.slice(inicio, fin);

  contenedor.innerHTML = '';

  productosAMostrar.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'producto-card';

    card.innerHTML = `
      <div class="producto-imagen">
        <img src="${prod.imagen}" alt="${prod.imagen}">
      </div>
        <div class="producto-info">
        <h3 class="producto-nombre">
        <a href="${prod.pagina}" target="_blank" rel="noopener noreferrer">${prod.nombre}</a>
        </h3>
        <a href="${prod.url}" class="btn btn-primary">Ver detalles</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function crearControlesPaginacion(idSeccion) {
  const contenedor = document.getElementById(idSeccion);
  if (!contenedor) return;

  const paginacionControles = document.getElementById(`paginacion-${idSeccion}`);
  if (!paginacionControles) return;

  const estado = estadoPaginacion[idSeccion];
  paginacionControles.innerHTML = '';

  if (estado.totalPaginas <= 1) return;

  const btnPrev = document.createElement('button');
  btnPrev.textContent = 'Anterior';
  btnPrev.className = 'btn btn-primary';
  btnPrev.disabled = estado.paginaActual === 1;
  btnPrev.addEventListener('click', () => {
    if (estado.paginaActual > 1) {
      estado.paginaActual--;
      mostrarPagina(idSeccion);
      crearControlesPaginacion(idSeccion);
      contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Solo scroll al hacer clic
    }
  });

  const indicador = document.createElement('span');
  indicador.className = 'pagina-indicador';
  indicador.textContent = `Página ${estado.paginaActual} de ${estado.totalPaginas}`;

  const btnNext = document.createElement('button');
  btnNext.textContent = 'Siguiente';
  btnNext.className = 'btn btn-primary';
  btnNext.disabled = estado.paginaActual === estado.totalPaginas;
  btnNext.addEventListener('click', () => {
    if (estado.paginaActual < estado.totalPaginas) {
      estado.paginaActual++;
      mostrarPagina(idSeccion);
      crearControlesPaginacion(idSeccion);
      contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Solo scroll al hacer clic
    }
  });

  paginacionControles.appendChild(btnPrev);
  paginacionControles.appendChild(indicador);
  paginacionControles.appendChild(btnNext);
}

document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.contenedor-navegacion-subcategorias button');

  botones.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const yOffset = -80; // Ajusta si tienes header fijo
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
});


// FUNCIONDE DE BUSCADOR EN LAS PAGINAS DE PRODUCTOS START


// Buscador en tiempo real
document.addEventListener('DOMContentLoaded', function() {
  const buscador = document.getElementById('buscador-productos');
  const sugerencias = document.getElementById('sugerencias-busqueda');
  let todosProductos = [];
  let timeoutBusqueda;

  // Función para aplanar la estructura de productos
  function aplanarProductos(data) {
    let productos = [];
    
    for (const categoria in data) {
      const valor = data[categoria];
      
      if (Array.isArray(valor)) {
        // Para categorías sin subcategorías (como consumibles)
        valor.forEach(producto => {
          productos.push({
            ...producto,
            categoriaPrincipal: categoria,
            subcategoria: null
          });
        });
      } else if (typeof valor === 'object') {
        // Para categorías con subcategorías (como equipos)
        for (const subcategoria in valor) {
          if (Array.isArray(valor[subcategoria])) {
            valor[subcategoria].forEach(producto => {
              productos.push({
                ...producto,
                categoriaPrincipal: categoria,
                subcategoria: subcategoria
              });
            });
          }
        }
      }
    }
    
    return productos;
  }

  // Cargar productos cuando estén disponibles
  function inicializarBuscador() {
    fetch(RUTA_JSON)
      .then(res => res.json())
      .then(data => {
        todosProductos = aplanarProductos(data);
        console.log('Buscador listo con', todosProductos.length, 'productos');
      })
      .catch(err => console.error('Error cargando productos para buscador:', err));
  }

  // Función de búsqueda
  function buscarProductos(termino) {
    termino = termino.toLowerCase().trim();
    if (!termino || termino.length < 2) return [];
    
    return todosProductos.filter(producto => 
      producto.nombre.toLowerCase().includes(termino) || 
      (producto.ID && producto.ID.toLowerCase().includes(termino))
    ).slice(0, 8); // Limitar a 8 resultados
  }

  // Mostrar sugerencias
  function mostrarSugerencias(resultados) {
    sugerencias.innerHTML = '';
    
    if (resultados.length === 0) {
      sugerencias.style.display = 'none';
      return;
    }

    resultados.forEach(producto => {
      const item = document.createElement('div');
      item.className = 'sugerencia-item';
      
      const imagenSrc = producto.imagen || producto.pagina || 'img/placeholder.webp';
      const urlDestino = producto.url || producto.pagina || '#';
      const categoriaDisplay = producto.subcategoria || producto.categoriaPrincipal;
      
      item.innerHTML = `
        <img src="${imagenSrc}" alt="${producto.nombre}" onerror="this.src='img/placeholder.webp'">
        <div class="sugerencia-info">
          <h4>${producto.nombre}</h4>
          <small>${categoriaDisplay}</small>
        </div>
      `;
      
      item.addEventListener('click', () => {
        window.location.href = urlDestino;
      });
      
      sugerencias.appendChild(item);
    });

    sugerencias.style.display = 'block';
  }

  // Inicializar buscador después de un pequeño retraso
  setTimeout(inicializarBuscador, 500);

  // Eventos
  buscador.addEventListener('input', function(e) {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(() => {
      const termino = e.target.value;
      const resultados = buscarProductos(termino);
      mostrarSugerencias(resultados);
    }, 200);
  });

  // Ocultar sugerencias al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.contenedor-busqueda')) {
      sugerencias.style.display = 'none';
    }
  });

  // Mostrar sugerencias al enfocar el input
  buscador.addEventListener('focus', function() {
    if (buscador.value.trim().length > 1) {
      const resultados = buscarProductos(buscador.value);
      mostrarSugerencias(resultados);
    }
  });
});

// FUNCIONDE DE BUSCADOR EN LAS PAGINAS DE PRODUCTOS END //


// SCRIPT FORMULARIO FLOTANTE START //

// Función para configurar el envío del formulario
function configurarEnvioFormulario(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    const modal = document.getElementById('modal-cotizacion'); // Asegurar referencia al modal
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        const formData = {
            nombre: form.nombre.value,
            email: form.email.value,
            telefono: form.telefono.value,
            consulta: form.consulta.value,
            pagina: window.location.href
        };

        const response = await fetch('https://script.google.com/macros/s/AKfycbyAo_uWIokfdDnayGs9Zy-1AMXFUhlHnYIYMiE-POgWL5Fy2y22FT5ReDE-CVc-qYa5/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.status === "success") {
            // Cerrar el modal primero
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            // Luego mostrar la notificación
            mostrarNotificacion('¡Éxito!', 'Tu mensaje ha sido enviado correctamente.', 'success');
            form.reset();
        } else {
            throw new Error(result.message || 'Error en el servidor');
        }
    } catch (error) {
        console.error('Error al enviar:', error);
        mostrarNotificacion('Error', 'No se pudo enviar el mensaje: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje, tipo) {
    // Si SweetAlert2 está disponible
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: tipo,
            timer: 3000
        });
    } else {
        // Fallback a alerta básica
        alert(titulo + ': ' + mensaje);
    }
}

// Configuración del modal
document.addEventListener('DOMContentLoaded', function() {
     const btnModal = document.querySelector('.js-modal-cotizacion'); // Solo primer botón
    const modal = document.getElementById('modal-cotizacion');
    const cerrarBtn = document.querySelector('.cerrar-modal-cotizacion');
if (cerrarBtn) {
    cerrarBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Evita comportamientos por defecto
        cerrarModal(); // Llama a la función correctamente
    });
}


 // Evento para TODOS los botones con la clase:
    document.addEventListener('click', function(e) {
        if (e.target.closest('.js-modal-cotizacion')) {
            e.preventDefault();
            cargarFormulario();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
    if (!btnModal || !modal) return;
    
    // Función para cargar el formulario
    function cargarFormulario() {
        const contenedor = document.getElementById('contenedor-formulario-modal');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <form id="formulario-cotizacion-modal" class="py-3">
                <div class="form-group">
                    <input type="text" name="nombre" class="form-control border-0 p-4" placeholder="Tu nombre" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" class="form-control border-0 p-4" placeholder="Tu Email" required>
                </div>
                <div class="form-group">
                    <input type="tel" name="telefono" class="form-control border-0 p-4" placeholder="Tu Teléfono">
                </div>
                <div class="form-group">
                    <select name="consulta" class="custom-select border-0 px-4" style="height: 47px;" required>
                        <option value="" selected disabled>Selecciona tu consulta</option>
                        <option value="Productos">Productos</option>
                        <option value="Importación">Importación</option>
                        <option value="Proveedor">Proveedor</option>
                    </select>
                </div>
                <div>
                    <button class="btn btn-dark btn-block border-0 py-3" type="submit">Enviar cotización</button>
                </div>
            </form>
        `;
        
        // Configurar el envío del formulario
        configurarEnvioFormulario('formulario-cotizacion-modal');
    }
    
    // Abrir modal
    btnModal.addEventListener('click', function(e) {
        e.preventDefault();
        cargarFormulario();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modal-cotizacion');
    if (modal) {
        modal.style.display = 'none'; // Esto cierra el modal
        document.body.style.overflow = 'auto'; // Restaura el scroll
        
        // Limpiar el formulario al cerrar (opcional)
        const form = document.getElementById('formulario-cotizacion-modal');
        if (form) form.reset();
    }
}
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            cerrarModal();
        }
    });
});

function mostrarNotificacion(titulo, mensaje, tipo) {
    // Configuración para que la notificación aparezca siempre visible
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
            // Acciones adicionales al cerrar la notificación
        }
    });
}





// Configuración del mensaje automático
let tooltipInterval;

function startTooltipInterval() {
    const tooltip = document.querySelector('.wapp-tooltip');
    const floatButton = document.querySelector('.wapp-float');
    
    // Mostrar/ocultar cada 15 segundos
    tooltipInterval = setInterval(() => {
        // Mostrar por 3 segundos
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }, 3000);
        
    }, 8000); // Ciclo cada 15 segundos
    
    // Detener al interactuar con el botón
    floatButton.addEventListener('click', () => {
        clearInterval(tooltipInterval);
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
}

// Iniciar cuando la página cargue
document.addEventListener('DOMContentLoaded', startTooltipInterval);


// SCRIPT FORMULARIO FLOTANTE END //



//  START PAGE X PRODUCT:

async function cargarJSON() {
  // Intenta rutas típicas según dónde esté productos.html
  const posibles = [
    "./json/productos.json",
    "../json/productos.json",
    "/SumPro_Web/json/productos.json",  // si tu sitio cuelga de /SumPro_Web/
    "/json/productos.json"
  ];

  for (const url of posibles) {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) {
        console.log("[OK] JSON cargado desde:", url);
        return await r.json();
      } else {
        console.warn("[WARN] No se pudo con:", url, "status:", r.status);
      }
    } catch (e) {
      console.warn("[WARN] Error con:", url, e.message);
    }
  }
  throw new Error("No pude cargar productos.json. Revisa la ruta y que estés sirviendo por HTTP.");
}

function getProductoId() {
  // productos.html?id=HC-23
  const qs = new URLSearchParams(location.search);
  const id = qs.get("id");
  if (id) return id.trim();

  // fallback: si algún día usas productos/HC-23.html
  const fname = location.pathname.split("/").pop() || "";
  if (fname.endsWith(".html")) return fname.replace(".html", "");
  return null;
}

function buscarProductoPorId(data, id) {
  let hallado = null;

  const scan = (nodo) => {
    if (!nodo || hallado) return;
    if (Array.isArray(nodo)) {
      for (const item of nodo) {
        if (item && item.ID === id) {
          hallado = item;
          return;
        }
      }
    } else if (typeof nodo === "object") {
      for (const key of Object.keys(nodo)) scan(nodo[key]);
    }
  };

  scan(data);
  return hallado;
}

function renderProducto(p) {
  const $root = document.getElementById("producto-detalle");
  if (!p) {
    $root.innerHTML = `<p>Producto no encontrado.</p>`;
    return;
  }

  // Campos opcionales seguros
  const dimensiones = Array.isArray(p.dimensiones) ? p.dimensiones.join(" | ") : (p.dimensiones || "");
  const material = p.material || "";
  const descripcion = p.descripcion || "";
  const ficha = p.fichaTecnica ? `<a class="btn-ficha" href="${p.fichaTecnica}" target="_blank" rel="noopener">📄 Ficha técnica</a>` : "";

  $root.innerHTML = `
    <div class="producto-page">
      <nav class="breadcrumb">
        Home / ${ (p.categoria||"").toUpperCase() } / ${ (p.subcategoria||"").toUpperCase() } / ${ p.nombre||p.ID } 
      </nav>

      

<div class="producto-contenido">
<!-- CONTENEDOR ZOOM CON BOTÓN QUE APARECE AL PASAR EL MOUSE -->
<div class="zoom-container">
  <img src="${p.imagen}" alt="${p.nombre||p.ID}">
  <button class="zoom-btn" onclick="openPopup('${p.imagen}')">🔍 Ver</button>
</div>

<!-- POPUP -->
<div id="imgPopup" class="popup">
  <span class="close" onclick="closePopup()">&times;</span>
  <img class="popup-content" id="popupImg">
</div>

        <div class="info">
          <ul class="meta">
            <h1 class="titulo">${p.nombre||p.ID}</h1>
            <li><strong>Categoría:</strong> ${p.categoria||"-"}</li>
            <li><strong>Subcategoría:</strong> ${p.subcategoria||"-"}</li>
            <li><strong>Código:</strong> ${p.ID}</li>
            ${dimensiones ? `<li><strong>Dimensiones:</strong> ${dimensiones}</li>` : ""}
            ${material ? `<li><strong>Material:</strong> ${material}</li>` : ""}
               ${p.ftec ? `
            <li>
            <button class="btn-primary" onclick="openFicha('${p.ftec}')">
            📑 Ver Ficha Técnica
            </button>
            </li>` 
            : ""}        
        </div>
      </div>

      <div class="tabs">
        <button class="tab active" data-tab="descripcion">Descripción</button>
      </div>

      <section id="tab-descripcion" class="tab-panel active">

      ${descripcion ? `<p>${descripcion}</p>` : `<p>Sin descripción.</p>`}

      </section>
      
      </div>
      
<div id="fichaModal" class="ficha-modal">
  <div class="ficha-modal-content">
    <span class="ficha-close" onclick="closeFicha()">&times;</span>
    <iframe id="fichaFrame" class="ficha-frame"></iframe>
  </div>
</div>
      
    </div>
    
  `;

  // Tabs simples
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

(async function init() {
  const id = getProductoId();
  if (!id) {
    document.getElementById("producto-detalle").innerHTML = "<p>Falta el parámetro ?id= en la URL.</p>";
    return;
  }
  try {
    const data = await cargarJSON();
    const producto = buscarProductoPorId(data, id);
    renderProducto(producto);
  } catch (e) {
    console.error(e);
    document.getElementById("producto-detalle").innerHTML =
      "<p>Error cargando datos. Abre la consola para ver detalles.</p>";
  }
})();

 // vert toda la imagen all_products start

function openPopup(src) {
  document.getElementById("imgPopup").style.display = "block";
  document.getElementById("popupImg").src = src;
}

function closePopup() {
  document.getElementById("imgPopup").style.display = "none";
}

// vert toda la imagen all_products end 

  // Recuperar lista si ya existe
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  function addToWishlist(id, nombre, imagen, pagina) {
    // Verificar si ya está en la lista
    if (wishlist.find(item => item.id === id)) {
      alert("❗ Este producto ya está en la lista");
      return;
    }

    // Agregar producto
    wishlist.push({ id, nombre, imagen, pagina });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    updateWishlistBubble();
  }

  function updateWishlistBubble() {
    const bubble = document.getElementById("wishlist-bubble");
    if (!bubble) return;
    bubble.textContent = wishlist.length;
    bubble.style.display = wishlist.length > 0 ? "flex" : "none";
  }

  // Inicializar al cargar la página
  document.addEventListener("DOMContentLoaded", updateWishlistBubble);

// popup ficha tecnica start // /////////////////////////////////


function openFicha(url) {
  const modal = document.getElementById("fichaModal");
  const frame = document.getElementById("fichaFrame");
  if(modal && frame){
    frame.src = url;
    modal.style.display = "flex"; // se centra con flexbox
  }
}

function closeFicha(){
  const modal = document.getElementById("fichaModal");
  const frame = document.getElementById("fichaFrame");
  if(modal && frame){
    frame.src = "";
    modal.style.display = "none";
  }
}

// Cerrar al hacer click fuera del contenido
document.getElementById("fichaModal").addEventListener("click", function(e){
  if(e.target === this) closeFicha();
});


// popup ficha tecnica END // /////////////////////////////////


// DESCRIPCION PRODUCTOS JSON START// /////////////////////////////////


function renderDescripcion(p) {
  const container = document.getElementById("tab-descripcion");
  if(!container) return;

  if(!p.descripcion || p.descripcion.trim() === ""){
    container.innerHTML = "<p>Sin descripción.</p>";
    return;
  }

  const lines = p.descripcion.split("\n");
  let htmlDesc = "";
  let inList = false;

  lines.forEach(line => {
    line = line.trim();
    if(line.startsWith("•")){  // cada línea con •
      if(!inList){
        htmlDesc += "<ul>";
        inList = true;
      }
      htmlDesc += `<li>${line.slice(1).trim()}</li>`; // quitar el •
    } else {
      if(inList){
        htmlDesc += "</ul>";
        inList = false;
      }
      htmlDesc += `<p>${line}</p>`;
    }
  });

  if(inList) htmlDesc += "</ul>";
  container.innerHTML = htmlDesc;
}

// Ejecutar cuando DOM esté listo y 'p' exista
document.addEventListener("DOMContentLoaded", () => {
  renderDescripcion(p);
});