(function () {
  'use strict';

  var defaults = { palette: 'ink', mode: 'system' };
  var valid = {
    palette: ['ink', 'clay', 'forest', 'ocean', 'plum'],
    mode: ['system', 'light', 'dark']
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
  var themeButton = document.getElementById('theme-toggle');
  var appearanceStatus = document.getElementById('appearance-status');

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

  function applyAppearance() {
    document.body.dataset.palette = state.palette;
    document.body.dataset.mode = state.mode;
    document.body.dataset.theme = state.mode === 'system' ? (systemDark.matches ? 'dark' : 'light') : state.mode;
    document.querySelectorAll('[data-palette-choice]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === state.palette));
    });
    renderMode();
    requestAnimationFrame(setThemeColor);
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  }

  themeButton.addEventListener('click', function () {
    state.mode = order[(order.indexOf(state.mode) + 1) % order.length];
    applyAppearance();
    appearanceStatus.textContent = '外观：' + labels[state.mode];
  });

  picker.querySelectorAll('[data-palette-choice]').forEach(function (button) {
    button.addEventListener('click', function () {
      state.palette = button.dataset.paletteChoice;
      applyAppearance();
      appearanceStatus.textContent = '配色：' + button.textContent.trim();
    });
  });

  systemDark.addEventListener && systemDark.addEventListener('change', function () {
    if (state.mode === 'system') applyAppearance();
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
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && picker.open) {
      picker.open = false;
      picker.querySelector('summary').focus();
    }
  });

  applyAppearance();

  var searchDialog = document.getElementById('search-dialog');
  var searchOpen = document.getElementById('search-open');
  var searchClose = document.getElementById('search-close');
  var searchInput = document.getElementById('search-input');
  var searchStatus = document.getElementById('search-status');
  var searchResults = document.getElementById('search-results');
  var searchIndex = null;
  var searchPromise = null;
  var searchTimer = 0;

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function loadSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (searchPromise) return searchPromise;
    searchStatus.textContent = '正在载入…';
    searchPromise = fetch(searchDialog.dataset.indexUrl, { cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      })
      .then(function (entries) {
        searchIndex = entries.map(function (entry) {
          entry._title = normalize(entry.t);
          entry._tags = normalize((entry.g || []).join(' '));
          entry._content = normalize(entry.c);
          return entry;
        });
        searchStatus.textContent = '';
        return searchIndex;
      })
      .catch(function (error) {
        searchPromise = null;
        searchStatus.textContent = '搜索暂时不可用';
        throw error;
      });
    return searchPromise;
  }

  function score(entry, terms, phrase) {
    var total = 0;
    for (var i = 0; i < terms.length; i += 1) {
      var term = terms[i];
      var matched = false;
      if (entry._title === term) { total += 500; matched = true; }
      else if (entry._title.indexOf(term) === 0) { total += 320; matched = true; }
      else if (entry._title.indexOf(term) > -1) { total += 220; matched = true; }
      if (entry._tags.split(' ').indexOf(term) > -1) { total += 140; matched = true; }
      else if (entry._tags.indexOf(term) > -1) { total += 80; matched = true; }
      var contentPosition = entry._content.indexOf(term);
      if (contentPosition > -1) {
        total += Math.max(12, 32 - Math.floor(contentPosition / 300));
        matched = true;
      }
      if (!matched) return -1;
    }
    if (phrase && entry._title.indexOf(phrase) > -1) total += 160;
    return total;
  }

  function excerpt(entry, terms) {
    var text = entry.c || '';
    var lowered = text.toLocaleLowerCase();
    var position = -1;
    for (var i = 0; i < terms.length && position < 0; i += 1) position = lowered.indexOf(terms[i]);
    if (position < 0) position = 0;
    var start = Math.max(0, position - 36);
    var end = Math.min(text.length, position + 92);
    return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
  }

  function appendResult(entry, terms) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    var title = document.createElement('span');
    var date = document.createElement('time');
    var snippet = document.createElement('span');
    link.href = entry.u;
    title.className = 'search-result-title';
    title.textContent = entry.t;
    date.dateTime = entry.d;
    date.textContent = entry.d;
    snippet.className = 'search-result-snippet';
    snippet.textContent = excerpt(entry, terms);
    link.appendChild(title);
    link.appendChild(date);
    link.appendChild(snippet);
    item.appendChild(link);
    searchResults.appendChild(item);
  }

  function runSearch() {
    var phrase = normalize(searchInput.value);
    searchResults.replaceChildren();
    if (!phrase) {
      searchStatus.textContent = '';
      return;
    }
    var terms = phrase.split(' ').filter(Boolean);
    loadSearchIndex().then(function (entries) {
      if (phrase !== normalize(searchInput.value)) return;
      var matches = entries.map(function (entry, position) {
        return { entry: entry, position: position, score: score(entry, terms, phrase) };
      }).filter(function (result) {
        return result.score >= 0;
      }).sort(function (a, b) {
        return b.score - a.score || a.position - b.position;
      });
      searchStatus.textContent = matches.length ? matches.length + ' 篇文章' : '没有找到“' + searchInput.value.trim() + '”';
      matches.slice(0, 20).forEach(function (result) { appendResult(result.entry, terms); });
    }).catch(function () {});
  }

  function openSearch() {
    if (!searchDialog.open) searchDialog.showModal();
    picker.open = false;
    loadSearchIndex().catch(function () {});
    requestAnimationFrame(function () { searchInput.focus(); });
  }

  function closeSearch() {
    searchDialog.close();
    searchOpen.focus();
  }

  searchOpen.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);
  searchDialog.addEventListener('click', function (event) {
    if (event.target === searchDialog) closeSearch();
  });
  searchInput.addEventListener('input', function () {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(runSearch, 70);
  });
  document.addEventListener('keydown', function (event) {
    var target = event.target;
    var isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
    if (event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      openSearch();
    }
  });
}());
