(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.nav_toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    function closeMenu(focusBack) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      if (focusBack) toggle.focus();
    }
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true); });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(false);
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq_question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
  });

  // Accessibility widget
  var fab = document.querySelector('.a11y-fab');
  var panel = document.querySelector('.a11y-panel');
  if (!fab || !panel) return;
  var root = document.documentElement;
  var KEY = 'tod-a11y-prefs';
  var defaults = { scale: '1', contrast: false, spacing: false, links: false, motion: false };
  var prefs = Object.assign({}, defaults);
  try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}

  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }
  function flag(name, on, value) { on ? root.setAttribute(name, value) : root.removeAttribute(name); }

  function apply() {
    root.style.setProperty('--a11y-font-scale', prefs.scale);
    flag('data-a11y-contrast', prefs.contrast, 'high');
    flag('data-a11y-spacing', prefs.spacing, 'wide');
    flag('data-a11y-links', prefs.links, 'highlight');
    flag('data-a11y-motion', prefs.motion, 'reduced');
    document.querySelectorAll('[data-font-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-font-btn') === String(prefs.scale)));
    });
    ['contrast', 'spacing', 'links', 'motion'].forEach(function (k) {
      var el = document.querySelector('[data-a11y-switch="' + k + '"]');
      if (el) el.checked = !!prefs[k];
    });
  }
  function openPanel() { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); panel.querySelector('.a11y-close').focus(); }
  function closePanel(focusBack) { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); if (focusBack) fab.focus(); }

  apply();
  fab.addEventListener('click', function () { panel.hidden ? openPanel() : closePanel(true); });
  panel.querySelector('.a11y-close').addEventListener('click', function () { closePanel(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) closePanel(true); });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !fab.contains(e.target)) closePanel(false);
  });
  document.querySelectorAll('[data-font-btn]').forEach(function (b) {
    b.addEventListener('click', function () { prefs.scale = b.getAttribute('data-font-btn'); apply(); save(); });
  });
  document.querySelectorAll('[data-a11y-switch]').forEach(function (sw) {
    sw.addEventListener('change', function () { prefs[sw.getAttribute('data-a11y-switch')] = sw.checked; apply(); save(); });
  });
  document.querySelector('[data-a11y-reset]').addEventListener('click', function () { prefs = Object.assign({}, defaults); apply(); save(); });
})();
