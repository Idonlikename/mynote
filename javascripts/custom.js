document.addEventListener('DOMContentLoaded', () => {
  // 创建收起/展开按钮
  const toggleButton = document.createElement('button');
  toggleButton.className = 'toggle-sidebar';
  toggleButton.textContent = '收起目录';
  document.body.appendChild(toggleButton);

  const primarySidebar = document.querySelector('.md-sidebar--primary');
  const secondarySidebar = document.querySelector('.md-sidebar--secondary');
  let isSidebarVisible = true;

  toggleButton.addEventListener('click', () => {
    isSidebarVisible = !isSidebarVisible;
    if (isSidebarVisible) {
      primarySidebar.style.display = 'block';
      secondarySidebar.style.display = 'block';
      toggleButton.textContent = '收起目录';
    } else {
      primarySidebar.style.display = 'none';
      secondarySidebar.style.display = 'none';
      toggleButton.textContent = '展开目录';
    }
  });
});