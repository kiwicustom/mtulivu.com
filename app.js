(() => {
  const quotes = Array.isArray(window.MTULIVU_QUOTES) ? window.MTULIVU_QUOTES : [];
  const quoteEl = document.getElementById("quote");
  const guru = document.querySelector(".guru img");
  const weather = document.getElementById("weather");
  const flock = document.getElementById("butterflies");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SEASONS = ["summer", "fall", "winter", "spring"];
  const SEASON_MS = 15000;
  const VIEWS = ["home", "about", "work", "contact"];
  const WING = [
    ["#ff7eb6", "#7ad3ff"],
    ["#ffd36a", "#e25c2a"],
    ["#f7fbff", "#b9d6f2"],
    ["#9dffb0", "#f4a0c0"],
  ];

  let bag = [];
  let started = false;
  let season = 0;
  let quoteTimer = 0;
  let flakes = [];
  let wx = weather.getContext("2d");

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function nextQuote() {
    if (!bag.length) bag = shuffle(quotes);
    return bag.pop() || "Ideas flow better in calm waters.";
  }

  function quoteDelay() {
    return 5000 + Math.random() * 5000;
  }

  function showQuote() {
    if (quoteEl && quotes.length) quoteEl.textContent = nextQuote();
    window.clearTimeout(quoteTimer);
    quoteTimer = window.setTimeout(showQuote, quoteDelay());
  }

  function viewFromHash() {
    const name = (location.hash || "#home").slice(1);
    if (name === "values") return "home";
    return VIEWS.includes(name) ? name : "home";
  }

  function setView(name) {
    const view = VIEWS.includes(name) ? name : "home";
    document.documentElement.dataset.view = view;
    for (const id of ["about", "work", "contact"]) {
      const sheet = document.getElementById(id);
      if (sheet) sheet.hidden = id !== view;
    }
    for (const link of document.querySelectorAll(".nav a[data-view]")) {
      link.classList.toggle("is-on", link.dataset.view === view);
    }
    const want = view === "home" ? "#home" : `#${view}`;
    if (location.hash !== want) history.replaceState(null, "", want);
  }

  function butterflyMarkup(i) {
    const pair = WING[i % WING.length];
    return `<svg viewBox="0 0 40 40" fill="none">
      <ellipse class="wing left" cx="12" cy="20" rx="12" ry="16" fill="${pair[0]}" opacity="0.92"/>
      <ellipse class="wing right" cx="28" cy="20" rx="12" ry="16" fill="${pair[1]}" opacity="0.92"/>
      <rect x="18.5" y="10" width="3" height="20" rx="1.5" fill="#24160c"/>
    </svg>`;
  }

  function makeButterflies() {
    const n = reduce ? 0 : 10;
    for (let i = 0; i < n; i += 1) {
      const b = document.createElement("div");
      b.className = "butterfly";
      b.style.setProperty("--fly", `${18 + Math.random() * 16}s`);
      b.style.setProperty("--delay", `${-Math.random() * 18}s`);
      b.innerHTML = butterflyMarkup(i);
      flock.appendChild(b);
    }
  }

  function resizeWeather() {
    weather.width = window.innerWidth;
    weather.height = window.innerHeight;
    const count = reduce ? 0 : Math.round((weather.width * weather.height) / 18000);
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * weather.width,
      y: Math.random() * weather.height,
      r: 1.4 + Math.random() * 3.2,
      s: 0.4 + Math.random() * 1.4,
      w: Math.random() * Math.PI * 2,
      k: Math.random(),
    }));
  }

  function paintWeather() {
    const name = SEASONS[season];
    wx.clearRect(0, 0, weather.width, weather.height);
    for (const f of flakes) {
      f.y += f.s * (name === "winter" ? 1.4 : 0.9);
      f.x += Math.sin(f.w + f.y * 0.01) * (name === "fall" ? 1.3 : 0.6);
      if (f.y > weather.height + 8) {
        f.y = -8;
        f.x = Math.random() * weather.width;
      }
      if (f.x < -10) f.x = weather.width + 8;
      if (f.x > weather.width + 10) f.x = -8;

      if (name === "winter") {
        wx.fillStyle = "rgba(255,255,255,0.85)";
        wx.beginPath();
        wx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        wx.fill();
      } else if (name === "fall") {
        wx.save();
        wx.translate(f.x, f.y);
        wx.rotate(f.y * 0.04);
        wx.fillStyle = f.k > 0.5 ? "#d35400" : "#f0c14b";
        wx.fillRect(-f.r, -f.r * 0.5, f.r * 2.2, f.r * 1.1);
        wx.restore();
      } else if (name === "spring") {
        wx.fillStyle = f.k > 0.5 ? "rgba(244,160,192,0.85)" : "rgba(255,227,138,0.8)";
        wx.beginPath();
        wx.ellipse(f.x, f.y, f.r * 1.4, f.r * 0.7, f.y * 0.03, 0, Math.PI * 2);
        wx.fill();
      } else {
        wx.fillStyle = "rgba(255,241,168,0.55)";
        wx.beginPath();
        wx.arc(f.x, f.y, f.r * 0.6, 0, Math.PI * 2);
        wx.fill();
      }
    }
    if (!reduce) requestAnimationFrame(paintWeather);
  }

  function setSeason(next) {
    season = next;
    document.documentElement.dataset.season = SEASONS[season];
  }

  function startSeasons() {
    if (reduce) return;
    window.setInterval(() => setSeason((season + 1) % SEASONS.length), SEASON_MS);
  }

  function start() {
    if (started) return;
    started = true;
    showQuote();
    makeButterflies();
    resizeWeather();
    paintWeather();
    startSeasons();
  }

  document.addEventListener("click", (event) => {
    const viewLink = event.target.closest("[data-view]");
    if (viewLink) {
      event.preventDefault();
      setView(viewLink.dataset.view);
      return;
    }
    if (event.target.closest("a, button, .sheet, .quote, .nav")) return;
    if (document.documentElement.dataset.view !== "home") {
      setView("home");
      return;
    }
    showQuote();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setView("home");
  });

  window.addEventListener("hashchange", () => setView(viewFromHash()));
  window.addEventListener("resize", resizeWeather);

  setView(viewFromHash());

  guru.addEventListener("load", start, { once: true });
  if (guru.complete) start();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  const installBtn = document.getElementById("install");
  let installEvent = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event;
    if (installBtn) installBtn.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    installEvent = null;
    if (installBtn) installBtn.hidden = true;
  });

  installBtn?.addEventListener("click", async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice.catch(() => {});
    installEvent = null;
    installBtn.hidden = true;
  });
})();
