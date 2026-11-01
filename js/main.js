(function () {
  'use strict';

  var defaults = { palette: 'ink', mode: 'system', bodyFont: 'sans', headingFont: 'serif' };
  var valid = {
    palette: ['ink', 'clay', 'forest', 'ocean', 'plum'],
    mode: ['system', 'light', 'dark'],
    bodyFont: ['sans', 'serif', 'mono'],
    headingFont: ['sans', 'serif', 'mono']
  };
  var labels = { system: '跟随系统', light: '浅色', dark: '深色' };
  var order = ['system', 'light', 'dark'];
  var icons = {
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    dark: '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>'
  };
  var state = Object.assign({}, defaults);
  var storageKey = 'mumei-style';
  var systemDark = matchMedia('(prefers-color-scheme: dark)');
  var picker = document.getElementById('palette-picker');
  var fontPanel = document.getElementById('appearance');
  var themeButton = document.getElementById('theme-toggle');
  var status = document.getElementById('appearance-status');

  try {
    var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    Object.keys(valid).forEach(function (key) {
      if (valid[key].indexOf(saved[key]) > -1) state[key] = saved[key];
    });
  } catch (_) {}

  function setThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.body).backgroundColor;
  }

  function renderMode() {
    var currentIndex = order.indexOf(state.mode);
    var next = order[(currentIndex + 1) % order.length];
    themeButton.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[state.mode] + '</svg>';
    themeButton.setAttribute('aria-label', '当前' + labels[state.mode] + '，切换为' + labels[next]);
    themeButton.title = themeButton.getAttribute('aria-label');
  }

  function apply() {
    document.body.dataset.palette = state.palette;
    document.body.dataset.mode = state.mode;
    document.body.dataset.theme = state.mode === 'system' ? (systemDark.matches ? 'dark' : 'light') : state.mode;
    document.body.dataset.bodyFont = state.bodyFont;
    document.body.dataset.headingFont = state.headingFont;
    document.querySelectorAll('[data-palette-choice]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === state.palette));
    });
    document.getElementById('body-font').value = state.bodyFont;
    document.getElementById('heading-font').value = state.headingFont;
    renderMode();
    requestAnimationFrame(setThemeColor);
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  }

  themeButton.addEventListener('click', function () {
    state.mode = order[(order.indexOf(state.mode) + 1) % order.length];
    apply();
    status.textContent = '外观：' + labels[state.mode];
  });

  picker.querySelectorAll('[data-palette-choice]').forEach(function (button) {
    button.addEventListener('click', function () {
      state.palette = button.dataset.paletteChoice;
      apply();
      status.textContent = '配色：' + button.textContent.trim();
    });
  });

  document.getElementById('body-font').addEventListener('change', function (event) {
    state.bodyFont = event.target.value;
    apply();
  });
  document.getElementById('heading-font').addEventListener('change', function (event) {
    state.headingFont = event.target.value;
    apply();
  });
  document.getElementById('reset-fonts').addEventListener('click', function () {
    state.bodyFont = defaults.bodyFont;
    state.headingFont = defaults.headingFont;
    apply();
  });

  systemDark.addEventListener && systemDark.addEventListener('change', function () {
    if (state.mode === 'system') apply();
  });

  picker.addEventListener('toggle', function () {
    if (picker.open) fontPanel.open = false;
  });
  fontPanel.addEventListener('toggle', function () {
    if (fontPanel.open) picker.open = false;
  });
  document.querySelectorAll('[data-close-panel]').forEach(function (button) {
    button.addEventListener('click', function () {
      var panel = document.getElementById(button.dataset.closePanel);
      panel.open = false;
      panel.querySelector('summary').focus();
    });
  });
  document.addEventListener('click', function (event) {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
    if (fontPanel.open && !fontPanel.contains(event.target)) fontPanel.open = false;
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (picker.open) {
      picker.open = false;
      picker.querySelector('summary').focus();
    } else if (fontPanel.open) {
      fontPanel.open = false;
      fontPanel.querySelector('summary').focus();
    }
  });

  apply();
}());

