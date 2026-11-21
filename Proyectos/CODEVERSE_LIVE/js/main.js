/**
 * CODEVERSE — Landing v1
 * Interacciones básicas
 */

(function () {
  'use strict';

  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');

  // Menú móvil
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar al hacer clic en un enlace
    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
      });
    });
  }

  // Header shadow al hacer scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (header) {
      if (current > 20) {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
      } else {
        header.style.background = 'rgba(10, 10, 15, 0.85)';
      }
    }
    lastScroll = current;
  }, { passive: true });

  // Placeholder del botón de lista de espera
  const btnWaitlist = document.getElementById('btn-waitlist');
  if (btnWaitlist) {
    btnWaitlist.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Pronto habilitaremos el registro.\nPor ahora estamos construyendo la primera versión útil de CODEVERSE.');
    });
  }
})();
