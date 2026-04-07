/* ============================================================
   js/nav.js — Légamo
   Navegación sticky + menú hamburguesa móvil
   ============================================================ */

(function () {
  'use strict';

  const nav        = document.getElementById('site-nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!nav) return;

  /* ── Sticky nav al scrollear ─────────────────────────────── */
  const SCROLL_THRESHOLD = 80;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  /* ── Hamburguesa / menú móvil ────────────────────────────── */
  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Cerrar al hacer click en un link del menú
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Cerrar si se redimensiona por encima de 768px
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

})();
