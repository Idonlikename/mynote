// 中英文之间自动添加空格（盘古之白）
// 兼容 Material 的 instant loading：每次页面切换后重新执行
if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    if (window.pangu) {
      pangu.spacingPage();
    }
  });
}
