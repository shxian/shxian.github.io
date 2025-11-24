// 主 JavaScript 文件
// 可以在这里添加交互功能

document.addEventListener('DOMContentLoaded', function() {
  function setupCollapse(headerSelector, contentSelector, attr) {
    var headers = document.querySelectorAll(headerSelector);
    headers.forEach(function(header) {
      header.addEventListener('click', function() {
        var key = header.getAttribute(attr);
        var content = document.querySelector(contentSelector + '[' + attr + '="' + key + '"]');
        if (!content) return;
        var icon = header.querySelector('.year-icon');
        var isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
          content.style.display = 'none';
          header.setAttribute('aria-expanded', 'false');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          content.style.display = 'block';
          header.setAttribute('aria-expanded', 'true');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }
  
  setupCollapse('.year-header', '.year-content', 'data-year');
  setupCollapse('.tag-header', '.tag-content', 'data-tag');
  
  // 移动端抽屉式导航
  function setupDrawer() {
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var closeBtn = document.querySelector('.drawer-close-btn');
    var drawer = document.querySelector('.mobile-drawer');
    var overlay = document.querySelector('.drawer-overlay');
    var drawerNavItems = document.querySelectorAll('.drawer-nav-item');
    var body = document.body;
    var fallbackTimer = null;
    
    if (!drawer || !overlay || !menuBtn || !closeBtn) {
      return;
    }
    
    function onTransitionEnd(event) {
      if (event && (event.target !== drawer || event.propertyName !== 'transform')) {
        return;
      }
      drawer.removeEventListener('transitionend', onTransitionEnd);
      body.classList.remove('drawer-open');
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    }
    
    function openDrawer() {
      drawer.classList.add('drawer-open');
      overlay.classList.add('overlay-visible');
      drawer.setAttribute('aria-hidden', 'false');
      body.classList.add('drawer-open');
    }
    
    function closeDrawer() {
      drawer.classList.remove('drawer-open');
      overlay.classList.remove('overlay-visible');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.removeEventListener('transitionend', onTransitionEnd);
      drawer.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(onTransitionEnd, 350);
    }
    
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openDrawer();
    });
    
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeDrawer();
    });
    
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeDrawer();
    });
    
    drawerNavItems.forEach(function(item) {
      item.addEventListener('click', function() {
        closeDrawer();
      });
    });
  }
  
  setupDrawer();
  
  // 设置面板管理
  function setupSettingsPanel() {
    var settingsBtns = document.querySelectorAll('.settings-btn');
    var closeBtn = document.querySelector('.settings-panel-close-btn');
    var panel = document.querySelector('.settings-panel');
    var overlay = document.querySelector('.settings-overlay');
    var body = document.body;
    
    if (settingsBtns.length === 0 || !panel || !overlay || !closeBtn) {
      return;
    }
    
    function openSettings() {
      panel.classList.add('panel-open');
      overlay.classList.add('overlay-visible');
      body.classList.add('settings-open');
      var drawer = document.querySelector('.mobile-drawer');
      var drawerOverlay = document.querySelector('.drawer-overlay');
      if (drawer) drawer.classList.remove('drawer-open');
      if (drawerOverlay) drawerOverlay.classList.remove('overlay-visible');
      body.classList.remove('drawer-open');
    }
    
    function closeSettings() {
      panel.classList.remove('panel-open');
      overlay.classList.remove('overlay-visible');
      body.classList.remove('settings-open');
    }
    
    settingsBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openSettings();
      });
    });
    
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeSettings();
    });
    
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeSettings();
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('panel-open')) {
        closeSettings();
      }
    });
  }
  
  setupSettingsPanel();
  
  // 主题切换功能
  function setupThemeToggle() {
    var themeOptions = document.querySelectorAll('.theme-option');
    var html = document.documentElement;
    var storageKey = 'theme';
    
    // 获取系统主题偏好
    function getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // 获取当前主题
    function getCurrentTheme() {
      try {
        return localStorage.getItem(storageKey) || 'system';
      } catch (e) {
        return 'system';
      }
    }
    
    // 应用主题
    function applyTheme(theme) {
      var actualTheme = theme === 'system' ? getSystemTheme() : theme;
      
      if (actualTheme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      // 更新选项状态
      updateThemeOptions(theme);
    }
    
    // 更新主题选项显示
    function updateThemeOptions(selectedTheme) {
      themeOptions.forEach(function(option) {
        var theme = option.getAttribute('data-theme');
        var check = option.querySelector('.theme-option-check');
        
        if (theme === selectedTheme) {
          option.classList.add('active');
          if (check) check.style.display = 'block';
        } else {
          option.classList.remove('active');
          if (check) check.style.display = 'none';
        }
      });
    }
    
    // 切换主题
    function setTheme(theme) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {
        // 忽略存储错误
      }
      applyTheme(theme);
    }
    
    // 初始化主题
    var savedTheme = getCurrentTheme();
    applyTheme(savedTheme);
    
    // 监听系统主题变化
    if (window.matchMedia) {
      var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', function() {
        if (getCurrentTheme() === 'system') {
          applyTheme('system');
        }
      });
    }
    
    // 绑定选项点击事件
    themeOptions.forEach(function(option) {
      option.addEventListener('click', function(e) {
        e.preventDefault();
        var theme = option.getAttribute('data-theme');
        setTheme(theme);
      });
    });
  }
  
  setupThemeToggle();
  
  // 视图切换功能（重构版）
  function setupViewToggle() {
    var viewOptions = document.querySelectorAll('.view-option');
    var storageKey = 'postViewMode';
    var defaultView = 'list';
    
    // 获取保存的视图偏好
    function getSavedView() {
      try {
        return localStorage.getItem(storageKey) || defaultView;
      } catch (e) {
        return defaultView;
      }
    }
    
    // 保存视图偏好
    function saveView(view) {
      try {
        localStorage.setItem(storageKey, view);
      } catch (e) {
        // 忽略存储错误
      }
    }
    
    // 更新视图选项显示
    function updateViewOptions(selectedView) {
      viewOptions.forEach(function(option) {
        var view = option.getAttribute('data-view');
        
        if (view === selectedView) {
          option.classList.add('active');
        } else {
          option.classList.remove('active');
        }
      });
    }
    
    // 切换视图
    function switchView(view) {
      // 更新选项状态
      updateViewOptions(view);
      
      // 切换所有文章列表容器
      var allGrids = document.querySelectorAll('.posts-grid');
      var allLists = document.querySelectorAll('.posts-list');
      
      if (view === 'list') {
        allGrids.forEach(function(grid) {
          grid.style.display = 'none';
        });
        allLists.forEach(function(list) {
          list.style.display = 'block';
        });
      } else {
        allGrids.forEach(function(grid) {
          grid.style.display = 'grid';
        });
        allLists.forEach(function(list) {
          list.style.display = 'none';
        });
      }
      
      saveView(view);
    }
    
    // 初始化视图
    var savedView = getSavedView();
    switchView(savedView);
    
    // 绑定选项点击事件
    viewOptions.forEach(function(option) {
      option.addEventListener('click', function(e) {
        e.preventDefault();
        var view = option.getAttribute('data-view');
        switchView(view);
      });
    });
  }
  
  setupViewToggle();

  // 初始化图标
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

