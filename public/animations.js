(function () {
  'use strict';

  /* ========================
     1. Scroll Reveal
     ======================== */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });

    // Auto-stagger for grid children
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (container) {
      var type = container.getAttribute('data-reveal') || '';
      var children = container.querySelectorAll(':scope > *');
      children.forEach(function (child, i) {
        child.setAttribute('data-reveal', type);
        child.setAttribute('data-reveal-delay', '');
        child.style.setProperty('--reveal-delay', (i * 60) + 'ms');
        io.observe(child);
      });
    });
  }

  /* ========================
     2. Nav Pill Indicator
     ======================== */
  function initNavPill() {
    var links = document.querySelector('.topnav__links');
    if (!links) return;
    var active = links.querySelector('a.active');
    if (!active) return;

    var pill = document.createElement('span');
    pill.className = 'topnav__indicator';
    links.appendChild(pill);

    function movePill(toEl) {
      if (!toEl) return;
      var rect = toEl.getBoundingClientRect();
      var parentRect = links.getBoundingClientRect();
      pill.style.left = (rect.left - parentRect.left - 2) + 'px';
      pill.style.width = (rect.width + 4) + 'px';
    }

    movePill(active);
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('mouseenter', function () { movePill(a); });
      a.addEventListener('mouseleave', function () { movePill(active); });
    });
    window.addEventListener('resize', function () { movePill(active); });
  }

  /* ========================
     3. SVG Path Draw + Circle Pop
     ======================== */
  function initSvgDraw() {
    var paths = document.querySelectorAll('svg path[data-draw]');
    if (!paths.length) return;

    if (!('IntersectionObserver' in window)) {
      paths.forEach(function (p) { p.classList.add('drawn'); });
      document.querySelectorAll('svg circle[data-pop]').forEach(function (c) { c.classList.add('popped'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawn');
          io.unobserve(entry.target);

          var svg = entry.target.closest('svg');
          if (svg) {
            svg.querySelectorAll('circle[data-pop]').forEach(function (c, i) {
              setTimeout(function () { c.classList.add('popped'); }, 400 + i * 120);
            });
          }
        }
      });
    }, { threshold: 0.3 });

    paths.forEach(function (p) { io.observe(p); });
  }

  /* ========================
     4. Page Enter
     ======================== */
  function initPageEnter() {
    var main = document.querySelector('.main');
    if (main) {
      main.classList.add('page-enter');
    }
  }

  /* ========================
     5. Competitor Table Row Stagger
     ======================== */
  function initTableStagger() {
    var tables = document.querySelectorAll('.competitor-table, .pm-table');
    if (!tables.length) return;
    tables.forEach(function (table) {
      var rows = table.querySelectorAll('tbody tr');
      rows.forEach(function (row, i) {
        row.setAttribute('data-reveal', 'fade');
        row.style.setProperty('--reveal-delay', (i * 70) + 'ms');
      });
    });
  }

  /* ========================
     Boot
     ======================== */
  function boot() {
    initPageEnter();
    initNavPill();
    initTableStagger();
    initReveal();
    initSvgDraw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
