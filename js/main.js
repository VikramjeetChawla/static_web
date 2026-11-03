/* ==========================================================
   Portfolio scripts
   1. Footer year
   2. Active link in the top navigation
   3. Scroll reveal
   4. Scroll-linked 3D depth (hero and card groups)
   5. Pointer tilt on cards
   Everything that moves is skipped when the visitor has asked
   their device to reduce motion.
   ========================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------- 1. Footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();


  /* ---------- 2. Active link in the top navigation ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var linkById = {};
  navLinks.forEach(function (a) {
    linkById[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && navLinks.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = linkById[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    Object.keys(linkById).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  }


  /* ---------- 3. Scroll reveal ---------- */

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  // Cards in the same group enter one after another
  Array.prototype.slice.call(document.querySelectorAll('.grid')).forEach(function (group) {
    var children = group.querySelectorAll(':scope > .reveal');
    Array.prototype.forEach.call(children, function (child, i) {
      child.style.setProperty('--d', (i * 0.12) + 's');
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  if (reduceMotion) return;


  /* ---------- 4. Scroll-linked 3D depth ---------- */

  var hero = document.querySelector('.hero');
  var depthGroups = Array.prototype.slice.call(document.querySelectorAll('.depth'));
  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var strength = window.innerWidth < 700 ? 2.5 : 5;

    // How far the hero has scrolled away, from 0 (top) to 1 (gone)
    if (hero) {
      var progress = Math.min(Math.max(window.scrollY / (hero.offsetHeight * 0.85), 0), 1);
      hero.style.setProperty('--hp', progress.toFixed(3));
    }

    // Each group of cards leans toward or away from you depending on its place in the window
    depthGroups.forEach(function (group) {
      var rect = group.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > vh + 120) return;
      var t = ((rect.top + rect.height / 2) - vh / 2) / (vh / 2);
      t = Math.max(-1, Math.min(1, t));
      group.style.setProperty('--sx', (t * strength).toFixed(2) + 'deg');
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();


  /* ---------- 5. Pointer tilt on cards ---------- */

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover) {
    Array.prototype.slice.call(document.querySelectorAll('.card')).forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ty', (x * 7).toFixed(2) + 'deg');
        card.style.setProperty('--tx', (-y * 7).toFixed(2) + 'deg');
      });

      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
      });
    });
  }
})();
