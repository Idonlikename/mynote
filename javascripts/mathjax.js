window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
    packages: { '[+]': ['ams', 'noerrors', 'noundefined'] }
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
    enableMenu: false
  },
  loader: {
    load: ['[tex]/ams', '[tex]/noerrors', '[tex]/noundefined']
  },
  startup: {
    typeset: false,
    pageReady() {
      return MathJax.typesetPromise();
    }
  }
};

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    MathJax.startup.output.clearCache();
    MathJax.typesetClear();
    MathJax.texReset();
    MathJax.typesetPromise();
  });
}
