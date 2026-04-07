/* ============================================================
   js/scroll-reveal.js — Légamo
   Animaciones de entrada al hacer scroll (IntersectionObserver)
   ============================================================ */

(function () {
  'use strict';

  // Selectores de elementos animables
  const SELECTORS = '.reveal, .reveal-l, .reveal-r';

  // Configuración del observer
  var observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  function activar(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target); // solo una vez
      }
    });
  }

  // Inicializar
  function init() {
    var elementos = document.querySelectorAll(SELECTORS);
    if (!elementos.length) return;

    // Si IntersectionObserver no está disponible, mostrar todo directo
    if (!('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(activar, observerOptions);
    elementos.forEach(function (el) { observer.observe(el); });
  }

  // Esperar que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
