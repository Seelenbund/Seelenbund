// responsive.js
// Gemeinsame mobile Anpassungen ohne die Desktop-Version umzubauen.

(function () {
  const MOBILE_QUERY = "(max-width: 900px)";

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  }

  function setPageClass() {
    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const stem = file.replace(".html", "");
    const body = document.body;

    const pageMap = {
      "home": "home-page",
      "kontakt": "kontakt-page",
      "philosophie": "philosophie-page",
      "qualifikationen": "qualifikationen-page",
      "leistungenundpreise": "leistungen-page",
      "index": "intro-page"
    };

    body.classList.add(pageMap[stem] || `${stem}-page`);
  }

  function initMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    if (!menuToggle || !siteNav || menuToggle.dataset.responsiveBound === "true") return;

    menuToggle.dataset.responsiveBound = "true";

    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initPhilosophieImageToggle() {
    if (!document.body.classList.contains("philosophie-page")) return;
    const visual = document.querySelector(".hero-visual");
    if (!visual || visual.dataset.mobileToggleBound === "true") return;

    visual.dataset.mobileToggleBound = "true";

    visual.addEventListener("click", () => {
      if (!isMobile()) return;
      visual.classList.toggle("mobile-alt");
    });
  }

  function initQualifikationenYears() {
  if (!document.body.classList.contains("qualifikationen-page")) return;
  if (!isMobile()) return;

  document.querySelectorAll(".training-table").forEach((table) => {
    const existing = table.previousElementSibling;
    if (existing && existing.classList && existing.classList.contains("mobile-year-title")) return;

    const headFirstCell = table.querySelector(".training-row.training-head > div:first-child");
    if (!headFirstCell) return;

    const yearText = headFirstCell.textContent.trim();
    if (!/^\d{4}$/.test(yearText)) return;

    const title = document.createElement("h3");
    title.className = "mobile-year-title";
    title.textContent = yearText;
    table.parentNode.insertBefore(title, table);
  });
}

  function hideTawkOnMobile() {
    if (!isMobile()) return;

    const selectors = [
      'iframe[src*="tawk.to"]',
      'iframe[title*="chat" i]',
      '#tawkchat-container',
      '.tawk-min-container',
      '.tawk-button',
      '.tawk-mobile',
      'div[id*="tawk"]',
      'div[class*="tawk"]'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
      });
    });
  }

  function removeTawkBubbleSpace() {
    if (!isMobile()) return;
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.right = "0";
      footer.style.bottom = "0";
    }
  }

  function applyMobileEnhancements() {
    hideTawkOnMobile();
    removeTawkBubbleSpace();
    initPhilosophieImageToggle();
    initQualifikationenYears();
  }

  function init() {
    setViewportHeightVar();
    setPageClass();
    initMenu();
    applyMobileEnhancements();
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", () => {
    setViewportHeightVar();
    applyMobileEnhancements();
  });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      setViewportHeightVar();
      applyMobileEnhancements();
    }, 120);
  });

  let tawkCleanerRuns = 0;
  const cleaner = setInterval(() => {
    applyMobileEnhancements();
    tawkCleanerRuns += 1;
    if (tawkCleanerRuns > 20) clearInterval(cleaner);
  }, 500);
})();
