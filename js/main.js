/**
 * ==============================================================================
 * PORTAFOLIO PERSONAL - LÓGICA GLOBAL (js/main.js)
 * Cargado en las 5 páginas del sitio.
 * Funcionalidades:
 * 1. Menú móvil interactivo (hamburguesa).
 * 2. Detección automática y resaltado del enlace activo en la navegación.
 * 3. Actualización dinámica del año actual en el pie de página.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de funciones globales
  initMobileMenu();
  setActiveNavLink();
  setCurrentYear();
  initSkillsFilter();
});

/**
 * 1. Control del Menú Móvil
 * Abre y cierra el menú de navegación en pantallas pequeñas al pulsar el botón toggle.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!menuToggle || !navMenu) return;

  // Alternar apertura/cierre al hacer clic en el botón hamburguesa
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Cerrar menú al hacer clic en cualquier enlace del menú
  const navLinks = navMenu.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Cerrar menú si el usuario hace clic fuera del header o menú
  document.addEventListener("click", (event) => {
    const isClickInside = menuToggle.contains(event.target) || navMenu.contains(event.target);
    if (!isClickInside && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * 2. Enlace Activo Automático
 * Examina la URL actual del navegador y añade la clase .active al enlace correspondiente.
 */
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  if (!navLinks.length) return;

  // Obtiene el nombre del archivo actual desde la ruta (ej: "index.html", "about.html")
  const path = window.location.pathname;
  let currentPage = path.substring(path.lastIndexOf("/") + 1);

  // Si la ruta termina en raíz o está vacía, por defecto es index.html
  if (currentPage === "" || currentPage === "index.htm") {
    currentPage = "index.html";
  }

  navLinks.forEach((link) => {
    // Obtenemos el atributo href del enlace
    const href = link.getAttribute("href");

    // Removemos la clase activa previa por seguridad
    link.classList.remove("active");

    // Si coincide con la página actual, le agregamos la clase active
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

/**
 * 3. Año Dinámico en Footer
 * Inserta el año actual para mantener siempre vigente el copyright sin edición manual.
 */
function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 4. Filtro Dinámico de Habilidades (skills.html)
 * Permite filtrar las categorías de habilidades al hacer clic en las píldoras de filtro.
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const categories = document.querySelectorAll(".skill-category");

  if (!filterBtns.length || !categories.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remover clase activa de todos los botones y asignar al pulsado
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      categories.forEach((category) => {
        const catGroup = category.getAttribute("data-category");

        if (filterValue === "all" || catGroup === filterValue) {
          category.style.display = "flex";
          category.style.opacity = "0";
          category.style.transform = "translateY(10px)";
          
          setTimeout(() => {
            category.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            category.style.opacity = "1";
            category.style.transform = "translateY(0)";
          }, 20);
        } else {
          category.style.display = "none";
        }
      });
    });
  });
}
