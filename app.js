(() => {
  const quotes = Array.isArray(window.MTULIVU_QUOTES) ? window.MTULIVU_QUOTES : [];
  const quoteEl = document.getElementById("quote");
  const guru = document.querySelector(".guru img");
  const weather = document.getElementById("weather");
  const life = document.getElementById("life");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SEASONS = ["summer", "fall", "winter", "spring"];
  const SEASON_MS = 5000;
  const VIEWS = ["home", "about", "work", "contact"];
  const WING = [
    ["#ff7eb6", "#7ad3ff"],
    ["#ffd36a", "#e25c2a"],
    ["#f7fbff", "#b9d6f2"],
    ["#9dffb0", "#f4a0c0"],
  ];
  const LEAF = ["#d35400", "#e67e22", "#c0392b", "#f0c14b", "#8e2f0d"];

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

  function birdMarkup() {
    return `<svg viewBox="0 0 56 24" fill="none">
      <path class="wing left" d="M28 14 C 16 4, 6 6, 2 12 C 14 10, 22 14, 28 16 Z" fill="#1a1410"/>
      <path class="wing right" d="M28 14 C 40 4, 50 6, 54 12 C 42 10, 34 14, 28 16 Z" fill="#24180e"/>
    </svg>`;
  }

  function spawnLife(kind, n, markup) {
    for (let i = 0; i < n; i += 1) {
      const el = document.createElement("div");
      el.className = kind;
      el.style.setProperty("--fly", `${16 + Math.random() * 18}s`);
      el.style.setProperty("--delay", `${-Math.random() * 18}s`);
      el.innerHTML = typeof markup === "function" ? markup(i) : markup;
      life.appendChild(el);
    }
  }

  function makeLife() {
    if (reduce) return;
    spawnLife("butterfly", 10, butterflyMarkup);
    spawnLife("bird", 7, birdMarkup);
  }

  function resizeWeather() {
    weather.width = window.innerWidth;
    weather.height = window.innerHeight;
    const count = reduce ? 0 : Math.round((weather.width * weather.height) / 14000);
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * weather.width,
      y: Math.random() * weather.height,
      r: 1.6 + Math.random() * 3.6,
      s: 0.45 + Math.random() * 1.5,
      w: Math.random() * Math.PI * 2,
      k: Math.random(),
      spin: Math.random() * Math.PI * 2,
    }));
  }

  function paintLeaf(f) {
    wx.save();
    wx.translate(f.x, f.y);
    wx.rotate(f.spin + f.y * 0.03);
    wx.fillStyle = LEAF[Math.floor(f.k * LEAF.length)];
    wx.beginPath();
    wx.moveTo(0, -f.r * 1.6);
    wx.quadraticCurveTo(f.r * 1.6, 0, 0, f.r * 1.8);
    wx.quadraticCurveTo(-f.r * 1.6, 0, 0, -f.r * 1.6);
    wx.fill();
    wx.strokeStyle = "rgba(80,30,8,0.35)";
    wx.lineWidth = 0.8;
    wx.beginPath();
    wx.moveTo(0, -f.r * 1.4);
    wx.lineTo(0, f.r * 1.5);
    wx.stroke();
    wx.restore();
  }

  function paintWeather() {
    const name = document.documentElement.dataset.season || SEASONS[season];
    wx.clearRect(0, 0, weather.width, weather.height);
    if (name === "summer" || name === "spring") {
      if (!reduce) requestAnimationFrame(paintWeather);
      return;
    }
    for (const f of flakes) {
      f.y += f.s * (name === "winter" ? 1.5 : 0.95);
      f.x += Math.sin(f.w + f.y * 0.01) * (name === "fall" ? 1.4 : 0.55);
      f.spin += name === "fall" ? 0.04 : 0;
      if (f.y > weather.height + 12) {
        f.y = -12;
        f.x = Math.random() * weather.width;
      }
      if (f.x < -12) f.x = weather.width + 10;
      if (f.x > weather.width + 12) f.x = -10;

      if (name === "winter") {
        wx.fillStyle = "rgba(255,255,255,0.9)";
        wx.beginPath();
        wx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        wx.fill();
      } else {
        paintLeaf(f);
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
    makeLife();
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
  window.setTimeout(start, 1200);

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
