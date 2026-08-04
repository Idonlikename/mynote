window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
    packages: { "[+]": ["ams", "boldsymbol", "mathtools", "noerrors", "noundefined"] },
  },
  loader: {
    load: ["[tex]/ams", "[tex]/boldsymbol", "[tex]/mathtools", "[tex]/noerrors", "[tex]/noundefined"],
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
    enableMenu: false,
  },
  startup: {
    typeset: false,
  },
};

const loadMathJax = (sources, index = 0) => {
  if (typeof window.MathJax?.typesetPromise === "function") {
    return;
  }

  if (index >= sources.length) {
    console.warn("MathJax failed to load from all configured sources.");
    return;
  }

  const script = document.createElement("script");
  script.src = sources[index];
  script.async = true;
  script.onload = () => typesetMath();
  script.onerror = () => loadMathJax(sources, index + 1);
  document.head.appendChild(script);
};

const typesetMath = () => {
  if (typeof window.MathJax?.typesetPromise !== "function") {
    return;
  }

  window.MathJax.typesetClear?.();
  window.MathJax.texReset?.();
  window.MathJax.typesetPromise().catch((error) => {
    console.error("MathJax typeset failed:", error);
  });
};

loadMathJax([
  "https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js",
  "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
  "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js",
]);

if (typeof document$ !== "undefined") {
  document$.subscribe(typesetMath);
} else {
  document.addEventListener("DOMContentLoaded", typesetMath);
}
