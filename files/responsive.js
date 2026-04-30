// responsive.js
// Hilfsdatei für responsive Verhalten über alle Seiten hinweg.

(function () {
  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  }

  function setPageClass() {
    const path = window.location.pathname.toLowerCase();
    const file = path.split("/").pop() || "index.html";
    const page = file.replace(".html", "").replace(/[^a-z0-9]+/g, "-");

    document.body.classList.add(`page-${page}`);
    document.body.dataset.page = page;
  }

  function fitOuterLayout() {
    const body = document.body;
    const main = document.querySelector("main");
    if (!main) return;

    body.classList.remove("fit-to-screen");
    body.style.removeProperty("--fit-scale");

    const viewportH = window.innerHeight;
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    const headerH = header ? header.offsetHeight : 0;
    const footerH = footer ? footer.offsetHeight : 0;
    const usableH = viewportH - headerH - footerH - 8;

    const candidate =
      document.querySelector(".hero > .container") ||
      document.querySelector(".hero .container") ||
      document.querySelector(".container .service-card") ||
      document.querySelector(".container");

    if (!candidate) return;

    const rect = candidate.getBoundingClientRect();
    const neededH = rect.height;

    if (neededH > usableH && usableH > 200) {
      const scale = Math.max(0.84, Math.min(1, usableH / neededH));
      body.classList.add("fit-to-screen");
      body.style.setProperty("--fit-scale", scale.toFixed(3));
    }
  }

  function init() {
    setViewportHeightVar();
    setPageClass();
    fitOuterLayout();
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", function () {
    setViewportHeightVar();
    fitOuterLayout();
  });
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      setViewportHeightVar();
      fitOuterLayout();
    }, 120);
  });
})();
