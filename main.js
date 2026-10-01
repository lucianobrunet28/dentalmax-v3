/* DentalMax v3 — main.js (IIFE, no modules) */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn('[init] ' + name + ' failed:', e); }
  }

  /* ---------- Nav state ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;
    function set(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { set(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) set(false); });
  }

  /* ---------- Hero title line mask ---------- */
  function initHeroTitle() {
    var lines = document.querySelectorAll('.hero-title .line');
    lines.forEach(function (line) {
      if (line.firstElementChild && line.firstElementChild.classList.contains('li')) return;
      var span = document.createElement('span');
      span.className = 'li';
      while (line.firstChild) span.appendChild(line.firstChild);
      line.appendChild(span);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .wave-reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-in'); }); }, 6000);
  }

  /* ---------- Hero visual: gentle pointer parallax ---------- */
  function initHeroParallax() {
    var v = document.querySelector('.hero-visual');
    var hero = document.querySelector('.hero');
    if (!v || !hero || !window.matchMedia('(hover: hover)').matches) return;
    var frame = v.querySelector('.photo-frame');
    hero.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      if (frame) frame.style.transform = 'translate(' + (x * 14).toFixed(1) + 'px,' + (y * 14).toFixed(1) + 'px)';
    });
  }

  /* ---------- Only one FAQ open at a time ---------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-list details');
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    safe(initNav, 'nav');
    safe(initMenu, 'menu');
    safe(initHeroTitle, 'heroTitle');
    safe(initReveal, 'reveal');
    safe(initHeroParallax, 'parallax');
    safe(initFaq, 'faq');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
