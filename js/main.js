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
});

