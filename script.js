/* ==========================================================================
   ADRIAN COLE — Portfolio — script.js
   Handles: nav active-link tracking, scroll reveal, animated skill bars,
   project filtering, contact form validation, and back-to-top button.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenuClose();
  initScrollSpy();
  initScrollReveal();
  initSkillBars();
  initProjectFilters();
  initContactForm();
  initBackToTop();
});

/* --------------------------------------------------------------------
   1. Close the mobile menu after a link is tapped
   -------------------------------------------------------------------- */
function initMobileMenuClose() {
  var collapseEl = document.getElementById('navMenu');
  if (!collapseEl || !window.bootstrap) return;
  var bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
  collapseEl.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (collapseEl.classList.contains('show')) bsCollapse.hide();
    });
  });
}

/* --------------------------------------------------------------------
   2. Highlight the nav link matching the section in view
   -------------------------------------------------------------------- */
function initScrollSpy() {
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('#navLinks .nav-link');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  var map = {};
  links.forEach(function (link) {
    var id = link.getAttribute('href').replace('#', '');
    map[id] = link;
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = map[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (s) { observer.observe(s); });
}

/* --------------------------------------------------------------------
   3. Fade + slide-up reveal for elements as they scroll into view
   -------------------------------------------------------------------- */
function initScrollReveal() {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
}

/* --------------------------------------------------------------------
   4. Animate the About section skill bars once they're visible
   -------------------------------------------------------------------- */
function initSkillBars() {
  var bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  function fill(el) {
    var target = el.dataset.width || '0';
    el.style.width = target + '%';
  }

  if (!('IntersectionObserver' in window)) {
    bars.forEach(fill);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fill(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(function (el) { observer.observe(el); });
}

/* --------------------------------------------------------------------
   5. Project grid category filter
   -------------------------------------------------------------------- */
function initProjectFilters() {
  var buttons = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('.project-item');
  if (!buttons.length || !items.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      items.forEach(function (item) {
        var categories = (item.dataset.category || '').split(' ');
        var show = filter === 'all' || categories.indexOf(filter) !== -1;
        item.classList.toggle('filtered-out', !show);
      });
    });
  });
}

/* --------------------------------------------------------------------
   6. Contact form: lightweight client-side validation (no backend)
   -------------------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      if (status) status.textContent = '';
      return;
    }

    form.classList.remove('was-validated');
    if (status) {
      status.textContent = 'Thanks — your message has been sent. I\u2019ll reply within a day or two.';
    }
    form.reset();
  });
}

/* --------------------------------------------------------------------
   7. Back-to-top button
   -------------------------------------------------------------------- */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggle() {
    if (window.scrollY > 480) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}
