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
    var menuBtns = document.querySelectorAll('.mobile-menu-btn');
    var closeBtns = document.querySelectorAll('.drawer-close-btn');
    var drawers = document.querySelectorAll('.mobile-drawer');
    var overlays = document.querySelectorAll('.drawer-overlay');
    var drawerNavItems = document.querySelectorAll('.drawer-nav-item');
    var body = document.body;
    var animationDuration = 300;
    
    function openDrawer(drawer, overlay) {
      if (drawer) drawer.classList.add('drawer-open');
      if (overlay) overlay.classList.add('overlay-visible');
      if (drawer) drawer.setAttribute('aria-hidden', 'false');
      body.classList.add('drawer-open');
    }
    
    function closeDrawer(drawer, overlay) {
      requestAnimationFrame(function() {
      if (drawer) drawer.classList.remove('drawer-open');
      if (overlay) overlay.classList.remove('overlay-visible');
        if (drawer) drawer.setAttribute('aria-hidden', 'true');
        setTimeout(function() {
          if (![...drawers].some(function(d) { return d.classList.contains('drawer-open'); })) {
      body.classList.remove('drawer-open');
          }
        }, animationDuration);
      });
    }
    
    drawers.forEach(function(drawer, index) {
      var overlay = overlays[index];
      var menuBtn = menuBtns[index];
      var closeBtn = closeBtns[index];
    
    if (menuBtn) {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
          openDrawer(drawer, overlay);
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
          closeDrawer(drawer, overlay);
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
          closeDrawer(drawer, overlay);
      });
    }
    });
    
    drawerNavItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var drawer = item.closest('.mobile-drawer');
        var overlay = drawer ? drawer.previousElementSibling : null;
        closeDrawer(drawer, overlay);
      });
    });
  }
  
  setupDrawer();
  
  // 设置面板管理
  function setupSettingsPanel() {
    console.log('设置面板初始化开始');
    
    var settingsBtns = document.querySelectorAll('.settings-btn');
    var closeBtn = document.querySelector('.settings-panel-close-btn');
    var panel = document.querySelector('.settings-panel');
    var overlay = document.querySelector('.settings-overlay');
    var body = document.body;
    
    // 调试：输出元素查找结果
    console.log('找到设置按钮数量:', settingsBtns.length);
    console.log('设置面板元素:', panel ? '找到' : '未找到');
    console.log('设置遮罩层元素:', overlay ? '找到' : '未找到');
    console.log('关闭按钮元素:', closeBtn ? '找到' : '未找到');
    
    // 如果找不到设置按钮，输出警告
    if (settingsBtns.length === 0) {
      console.warn('警告：未找到任何设置按钮元素 (.settings-btn)');
      console.warn('请检查 HTML 中是否包含设置按钮');
    }
    
    // 如果找不到面板或遮罩层，输出警告
    if (!panel) {
      console.warn('警告：未找到设置面板元素 (.settings-panel)');
    }
    if (!overlay) {
      console.warn('警告：未找到设置遮罩层元素 (.settings-overlay)');
    }
    
    function openSettings() {
      console.log('openSettings() 函数被调用');
      
      if (panel) {
        panel.classList.add('panel-open');
        console.log('设置面板已添加 panel-open 类');
        // 检查计算后的样式
        var computedStyle = window.getComputedStyle(panel);
        console.log('设置面板 transform:', computedStyle.transform);
        console.log('设置面板 display:', computedStyle.display);
        console.log('设置面板 visibility:', computedStyle.visibility);
        console.log('设置面板 z-index:', computedStyle.zIndex);
        console.log('设置面板 width:', computedStyle.width);
        console.log('设置面板 right:', computedStyle.right);
      } else {
        console.error('设置面板元素未找到');
      }
      if (overlay) {
        overlay.classList.add('overlay-visible');
        console.log('设置遮罩层已添加 overlay-visible 类');
        var overlayStyle = window.getComputedStyle(overlay);
        console.log('设置遮罩层 display:', overlayStyle.display);
        console.log('设置遮罩层 z-index:', overlayStyle.zIndex);
      } else {
        console.error('设置遮罩层元素未找到');
      }
      body.classList.add('settings-open');
      // 关闭移动端抽屉（如果打开）
      var drawer = document.querySelector('.mobile-drawer');
      var drawerOverlay = document.querySelector('.drawer-overlay');
      if (drawer) drawer.classList.remove('drawer-open');
      if (drawerOverlay) drawerOverlay.classList.remove('overlay-visible');
      body.classList.remove('drawer-open');
    }
    
    function closeSettings() {
      console.log('closeSettings() 函数被调用');
      if (panel) panel.classList.remove('panel-open');
      if (overlay) overlay.classList.remove('overlay-visible');
      body.classList.remove('settings-open');
    }
    
    // 为所有设置按钮绑定事件
    var boundCount = 0;
    settingsBtns.forEach(function(btn, index) {
      btn.addEventListener('click', function(e) {
        console.log('设置按钮被点击 (按钮索引:', index + ')');
        e.preventDefault();
        e.stopPropagation();
        openSettings();
      });
      boundCount++;
      console.log('设置按钮事件绑定成功 (按钮索引:', index + ')');
    });
    
    console.log('总共绑定了', boundCount, '个设置按钮的事件监听器');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        console.log('关闭按钮被点击');
        e.preventDefault();
        e.stopPropagation();
        closeSettings();
      });
      console.log('关闭按钮事件绑定成功');
    }
    
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        console.log('遮罩层被点击');
        e.preventDefault();
        e.stopPropagation();
        closeSettings();
      });
      console.log('遮罩层事件绑定成功');
    }
    
    // 按 ESC 键关闭设置面板
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel && panel.classList.contains('panel-open')) {
        console.log('ESC 键被按下，关闭设置面板');
        closeSettings();
      }
    });
    
    console.log('设置面板初始化完成');
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

