/* ============================================================
   js/lightbox.js — Légamo
   Galería con lightbox fullscreen
   ============================================================ */

(function () {
  'use strict';

  var currentIndex = 0;
  var items = [];

  /* ── Crear estructura del lightbox ──────────────────────── */
  function crearLightbox() {
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galería de imágenes');

    lb.innerHTML =
      '<div class="lightbox__inner">' +
        '<button class="lightbox__close" id="lb-close" aria-label="Cerrar">&times;</button>' +
        '<button class="lightbox__prev"  id="lb-prev"  aria-label="Anterior">&#8592;</button>' +
        '<div    class="lightbox__media" id="lb-media"></div>' +
        '<button class="lightbox__next"  id="lb-next"  aria-label="Siguiente">&#8594;</button>' +
        '<p     class="lightbox__caption" id="lb-caption"></p>' +
      '</div>';

    document.body.appendChild(lb);
    return lb;
  }

  /* ── Recopilar ítems de galería ──────────────────────────── */
  function recopilarItems() {
    return Array.from(document.querySelectorAll('.galeria-item'));
  }

  /* ── Mostrar ítem ────────────────────────────────────────── */
  function mostrar(index) {
    var lb     = document.getElementById('lightbox');
    var media  = document.getElementById('lb-media');
    var caption = document.getElementById('lb-caption');

    if (!lb || !items[index]) return;
    currentIndex = index;

    var item    = items[index];
    var imgEl   = item.querySelector('img');
    var phEl    = item.querySelector('.ph');
    var capText = item.dataset.caption || ('Foto ' + (index + 1));

    media.innerHTML = '';

    if (imgEl && imgEl.src && !imgEl.src.endsWith('/')) {
      // Imagen real
      var img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || capText;
      media.appendChild(img);
    } else {
      // Placeholder
      var ph = document.createElement('div');
      ph.className = 'lightbox__ph';
      ph.textContent = phEl ? (phEl.textContent.trim() || capText) : capText;
      media.appendChild(ph);
    }

    caption.textContent = capText;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Foco en el contenedor para accesibilidad
    lb.focus();
  }

  /* ── Cerrar ──────────────────────────────────────────────── */
  function cerrar() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Navegar ─────────────────────────────────────────────── */
  function anterior() {
    mostrar((currentIndex - 1 + items.length) % items.length);
  }

  function siguiente() {
    mostrar((currentIndex + 1) % items.length);
  }

  /* ── Inicializar ─────────────────────────────────────────── */
  function init() {
    var grid = document.getElementById('galeria-grid');
    if (!grid) return;

    items = recopilarItems();
    if (!items.length) return;

    // Crear el lightbox en el DOM
    var lb = crearLightbox();
    lb.setAttribute('tabindex', '-1');

    // Eventos de los ítems
    items.forEach(function (item, idx) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', item.dataset.caption || ('Ver foto ' + (idx + 1)));

      item.addEventListener('click', function () { mostrar(idx); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          mostrar(idx);
        }
      });
    });

    // Eventos del lightbox
    document.getElementById('lb-close').addEventListener('click', cerrar);
    document.getElementById('lb-prev').addEventListener('click', anterior);
    document.getElementById('lb-next').addEventListener('click', siguiente);

    // Click fuera del inner cierra
    lb.addEventListener('click', function (e) {
      if (e.target === lb) cerrar();
    });

    // Teclado
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      cerrar();
      if (e.key === 'ArrowLeft')   anterior();
      if (e.key === 'ArrowRight')  siguiente();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
