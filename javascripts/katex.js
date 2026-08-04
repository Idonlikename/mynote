const katexOptions = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "\\(", right: "\\)", display: false },
    { left: "$", right: "$", display: false },
  ],
  ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
  ignoredClasses: ["katex"],
  throwOnError: false,
  strict: "ignore",
};

const renderKatex = () => {
  const content = document.querySelector(".md-content__inner");
  if (!content || typeof window.renderMathInElement !== "function") {
    return;
  }

  window.renderMathInElement(content, katexOptions);
};

if (typeof document$ !== "undefined") {
  document$.subscribe(renderKatex);
} else {
  document.addEventListener("DOMContentLoaded", renderKatex);
}
