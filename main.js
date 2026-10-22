(function () {
  'use strict';

  var EMAIL = 'impulsabosa@gmail.com';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header: sombra al hacer scroll + botón volver arriba ---------- */
  var header = $('.site-header');
  var toTop = $('#to-top');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 8);
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Menú móvil ---------- */
  var toggle = $('.menu-toggle');
  var menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function () { setMenu(false); });

  /* ---------- Enlace activo según la sección visible ---------- */
  var links = $$('.nav-links a[href^="#"]:not(.nav-cta)');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var sections = ['inicio', 'nosotros', 'servicios', 'proceso', 'ayudamos'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          if (map[en.target.id]) map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animaciones de entrada ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Copiar correo ---------- */
  var copyBtn = $('#copy-mail');
  copyBtn.addEventListener('click', function () {
    var label = $('span', copyBtn);
    function done(ok) {
      label.textContent = ok ? '¡Copiado!' : 'Copia manualmente';
      setTimeout(function () { label.textContent = 'Copiar'; }, 2000);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { done(false); });
    } else {
      var t = document.createElement('textarea');
      t.value = EMAIL; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(t);
      done(ok);
    }
  });

  /* ---------- Formulario: abre el correo con el mensaje redactado ---------- */
  var form = $('#contact-form');
  var status = $('#form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    var negocio = form.negocio.value.trim();
    var mensaje = form.mensaje.value.trim();

    if (!nombre || !negocio || !mensaje) {
      status.className = 'form-status error';
      status.textContent = 'Por favor completa los tres campos.';
      (!nombre ? form.nombre : !negocio ? form.negocio : form.mensaje).focus();
      return;
    }
    var subject = 'Quiero impulsar mi negocio: ' + negocio;
    var body = 'Hola, equipo de Impulsa Bosa:\n\nMi nombre es ' + nombre + ' y mi negocio se llama ' + negocio + '.\n\n' + mensaje + '\n\nQuedo atento(a). Gracias.';
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.className = 'form-status';
    status.textContent = 'Abrimos tu correo para que envíes el mensaje. Si no se abre, escríbenos a ' + EMAIL + '.';
  });
})();
