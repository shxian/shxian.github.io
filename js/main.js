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
    
    function openDrawer() {
      if (drawer) drawer.classList.add('drawer-open');
      if (overlay) overlay.classList.add('overlay-visible');
      body.classList.add('drawer-open');
    }
    
    function closeDrawer() {
      if (drawer) drawer.classList.remove('drawer-open');
      if (overlay) overlay.classList.remove('overlay-visible');
      body.classList.remove('drawer-open');
    }
    
    if (menuBtn) {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openDrawer();
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeDrawer();
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeDrawer();
      });
    }
    
    drawerNavItems.forEach(function(item) {
      item.addEventListener('click', function() {
        closeDrawer();
      });
    });
  }
  
  setupDrawer();
});

