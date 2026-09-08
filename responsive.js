// responsive.js
// Gemeinsame mobile Anpassungen ohne die Desktop-Version umzubauen.

(function () {
  const MOBILE_QUERY = "(max-width: 900px)";
  const CHAT_CONSENT_KEY = "seelenbund-chat-consent";

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
  return;
}

  function hideTawkOnMobile() {
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

  if (!isMobile()) return;

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("pointer-events", "none", "important");
      el.style.setProperty("width", "0", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("max-width", "0", "important");
      el.style.setProperty("max-height", "0", "important");
    });
  });

  if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
    window.Tawk_API.hideWidget();
  }
}

  function removeTawkBubbleSpace() {
    if (!isMobile()) return;
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.right = "0";
      footer.style.bottom = "0";
    }
  }

  function readChatConsent() {
    try {
      return window.localStorage.getItem(CHAT_CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeChatConsent(value) {
    try {
      window.localStorage.setItem(CHAT_CONSENT_KEY, value);
    } catch (error) {
      // Die Website bleibt auch bei blockiertem Browserspeicher nutzbar.
    }
  }

  function loadTawkChat() {
    if (isMobile() || document.getElementById("seelenbund-tawk-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = function () {
      if (typeof window.Tawk_API.minimize === "function") {
        window.Tawk_API.minimize();
      }
    };

    const script = document.createElement("script");
    script.id = "seelenbund-tawk-script";
    script.async = true;
    script.src = "https://embed.tawk.to/69e0c8c03f5fe21c385b068f/1jmb10c0j";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
  }

  function disableTawkChat() {
    if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
      window.Tawk_API.hideWidget();
    }

    const script = document.getElementById("seelenbund-tawk-script");
    if (script) script.remove();

    document.querySelectorAll([
      'iframe[src*="tawk.to"]',
      'iframe[title*="chat" i]',
      '#tawkchat-container',
      '.tawk-min-container',
      '.tawk-button',
      '.tawk-mobile',
      'div[id*="tawk"]',
      'div[class*="tawk"]'
    ].join(",")).forEach((element) => element.remove());
  }

  function updatePrivacyControl() {
    const button = document.querySelector("[data-chat-consent-manage]");
    if (!button) return;

    const consent = readChatConsent();
    button.textContent = consent === "granted"
      ? "Chat-Einwilligung widerrufen"
      : "Live-Chat erlauben";
  }

  function createConsentBanner() {
    if (isMobile() || document.querySelector(".privacy-consent")) return;

    const banner = document.createElement("aside");
    banner.className = "privacy-consent";
    banner.setAttribute("aria-label", "Datenschutzeinstellung für den Live-Chat");
    banner.innerHTML = `
      <div class="privacy-consent-copy">
        <strong>Live-Chat &amp; Datenschutz</strong>
        Der Live-Chat von tawk.to wird nur mit Ihrer Zustimmung geladen. Dabei können Daten in die USA übertragen sowie Cookies oder Browser-Speicher verwendet werden.
        <a href="impressum.html">Mehr erfahren</a>
      </div>
      <div class="privacy-consent-actions">
        <button class="privacy-consent-button privacy-consent-decline" type="button">Ablehnen</button>
        <button class="privacy-consent-button privacy-consent-accept" type="button">Zustimmen</button>
      </div>`;

    banner.querySelector(".privacy-consent-decline").addEventListener("click", () => {
      writeChatConsent("denied");
      banner.remove();
      updatePrivacyControl();
    });

    banner.querySelector(".privacy-consent-accept").addEventListener("click", () => {
      writeChatConsent("granted");
      banner.remove();
      loadTawkChat();
      updatePrivacyControl();
    });

    document.body.appendChild(banner);
  }

  function initChatConsent() {
    if (isMobile()) return;

    const consent = readChatConsent();
    if (consent === "granted") {
      loadTawkChat();
    } else if (consent !== "denied") {
      createConsentBanner();
    }

    const button = document.querySelector("[data-chat-consent-manage]");
    if (button && button.dataset.chatConsentBound !== "true") {
      button.dataset.chatConsentBound = "true";
      button.addEventListener("click", () => {
        const status = document.querySelector(".privacy-settings-status");
        if (readChatConsent() === "granted") {
          writeChatConsent("denied");
          disableTawkChat();
          if (status) status.textContent = "Der Live-Chat ist jetzt deaktiviert.";
        } else {
          writeChatConsent("granted");
          loadTawkChat();
          if (status) status.textContent = "Der Live-Chat ist jetzt erlaubt.";
        }
        updatePrivacyControl();
      });
    }

    updatePrivacyControl();
  }

  function applyMobileEnhancements() {
    hideTawkOnMobile();
    removeTawkBubbleSpace();
    initPhilosophieImageToggle();
    initQualifikationenYears();
    initPhilosophieImageToggle();
  }

  function init() {
    setViewportHeightVar();
    setPageClass();
    initMenu();
    initChatConsent();
    applyMobileEnhancements();
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", () => {
    setViewportHeightVar();
    initChatConsent();
    applyMobileEnhancements();
  });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      setViewportHeightVar();
      applyMobileEnhancements();
    }, 120);
  });

  const cleaner = setInterval(() => {
  applyMobileEnhancements();
}, 500);

const observer = new MutationObserver(() => {
  applyMobileEnhancements();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
})();
