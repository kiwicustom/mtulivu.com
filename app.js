(() => {
  const quotes = Array.isArray(window.MTULIVU_QUOTES) ? window.MTULIVU_QUOTES : [];
  const sky = document.getElementById("bubbles");
  const guru = document.querySelector(".guru img");
  const weather = document.getElementById("weather");
  const flock = document.getElementById("butterflies");
  const folio = document.getElementById("work");
  const brand = document.querySelector(".brand");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HEAD = { x: 0.5, y: 0.235 };
  const SEASONS = ["summer", "fall", "winter", "spring"];
  const SEASON_MS = 15000;
  const SLOTS = [
    { deg: -38, dist: 0.36 },
    { deg: -16, dist: 0.34 },
    { deg: 24, dist: 0.32 },
    { deg: 148, dist: 0.3 },
    { deg: -54, dist: 0.32 },
  ];
  const WING = [
    ["#ff7eb6", "#7ad3ff"],
    ["#ffd36a", "#e25c2a"],
    ["#f7fbff", "#b9d6f2"],
    ["#9dffb0", "#f4a0c0"],
  ];

  let bag = [];
  let started = false;
  let slot = 0;
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
    return bag.pop() || "Come back. That is the whole book.";
  }

  function quoteDelay() {
    return 5000 + Math.random() * 5000;
  }

  function headPoint() {
    const box = guru.getBoundingClientRect();
    return {
      x: box.left + box.width * HEAD.x,
      y: box.top + box.height * HEAD.y,
    };
  }

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function clamp(n, min, max) {
    if (min > max) return (min + max) / 2;
    return Math.min(max, Math.max(min, n));
  }

  function lakeRect() {
    const pad = 16;
    const folioBox = folio?.getBoundingClientRect();
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const box = {
      left: pad,
      top: pad,
      right: window.innerWidth - pad,
      bottom: window.innerHeight - pad,
    };
    if (!folioBox || folioBox.width < 8) return box;
    if (mobile) {
      box.bottom = Math.min(box.bottom, folioBox.top - pad);
    } else {
      box.right = Math.min(box.right, folioBox.left - pad);
    }
    return box;
  }

  function headerBlock() {
    if (!brand) return null;
    const b = brand.getBoundingClientRect();
    return {
      left: 0,
      top: 0,
      right: b.right + 18,
      bottom: b.bottom + 18,
    };
  }

  function hits(x, y, hw, hh, rect) {
    if (!rect) return false;
    return x + hw > rect.left && x - hw < rect.right && y + hh > rect.top && y - hh < rect.bottom;
  }

  function keepInLake(x, y, hw, hh, lake, from) {
    const minX = lake.left + hw;
    const maxX = Math.max(minX, lake.right - hw);
    const minY = lake.top + hh;
    const maxY = Math.max(minY, lake.bottom - hh);
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) return { x, y };
    const dx = x - from.x;
    const dy = y - from.y;
    let t0 = 0;
    let t1 = 1;
    for (let i = 0; i < 14; i += 1) {
      const t = (t0 + t1) / 2;
      const cx = from.x + dx * t;
      const cy = from.y + dy * t;
      if (cx >= minX && cx <= maxX && cy >= minY && cy <= maxY) t0 = t;
      else t1 = t;
    }
    return {
      x: clamp(from.x + dx * t0, minX, maxX),
      y: clamp(from.y + dy * t0, minY, maxY),
    };
  }

  function legal(x, y, hw, hh, lake, face, header) {
    const minX = lake.left + hw;
    const maxX = Math.max(minX, lake.right - hw);
    const minY = lake.top + hh;
    const maxY = Math.max(minY, lake.bottom - hh);
    if (x < minX - 0.5 || x > maxX + 0.5 || y < minY - 0.5 || y > maxY + 0.5) return false;
    if (hits(x, y, hw, hh, header)) return false;
    if (hits(x, y, hw, hh, face)) return false;
    return true;
  }

  function shoveOut(x, y, hw, hh, lake, header, head) {
    if (!hits(x, y, hw, hh, header)) return { x, y };
    const down = keepInLake(x, header.bottom + hh + 8, hw, hh, lake, head);
    const right = keepInLake(header.right + hw + 8, y, hw, hh, lake, head);
    const dr = (right.x - head.x) ** 2 + (right.y - head.y) ** 2;
    const dd = (down.x - head.x) ** 2 + (down.y - head.y) ** 2;
    return dr < dd ? right : down;
  }

  function placeBubble(el, slotIndex = slot) {
    const lake = lakeRect();
    const header = headerBlock();
    const lakeW = Math.max(140, lake.right - lake.left);
    el.style.maxWidth = `${Math.min(280, lakeW)}px`;

    const head = headPoint();
    const box = guru.getBoundingClientRect();
    const hw = el.offsetWidth / 2;
    const hh = el.offsetHeight / 2;
    const face = {
      left: box.left + box.width * 0.28,
      right: box.left + box.width * 0.72,
      top: box.top,
      bottom: box.top + box.height * 0.46,
    };

    const preferred = SLOTS[slotIndex % SLOTS.length];
    const angles = [preferred.deg, -36, -14, -56, 20, 40, 150, 170, -170];
    const dists = [0.34, 0.28, 0.42, 0.22, 0.5];
    let best = null;
    let bestScore = Infinity;

    for (const deg of angles) {
      const rad = (deg * Math.PI) / 180;
      for (const scale of dists) {
        let x = head.x + Math.cos(rad) * box.width * scale;
        let y = head.y + Math.sin(rad) * box.width * scale;
        ({ x, y } = keepInLake(x, y, hw, hh, lake, head));
        ({ x, y } = shoveOut(x, y, hw, hh, lake, header, head));
        if (!legal(x, y, hw, hh, lake, face, header)) continue;
        const score =
          (deg - preferred.deg) ** 2 * 4 +
          (x - head.x) ** 2 * 0.002 +
          (y - head.y) ** 2 * 0.002;
        if (score < bestScore) {
          bestScore = score;
          best = { x, y };
        }
      }
    }

    let x;
    let y;
    if (best) {
      ({ x, y } = best);
    } else {
      const left = Math.max(lake.left, header ? header.right : lake.left);
      const top = Math.max(lake.top, header ? header.bottom : lake.top);
      x = (left + lake.right) / 2;
      y = (top + lake.bottom) / 2;
      ({ x, y } = keepInLake(x, y, hw, hh, lake, { x, y }));
    }

    const tail = (Math.atan2(head.y - y, head.x - x) * 180) / Math.PI;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--tail", `${tail}deg`);
    el.style.setProperty("--reach", `${hw}px`);
  }

  function spawn() {
    if (!quotes.length) return;
    const thought = Math.random() < 0.45;
    const el = document.createElement("article");
    el.className = `bubble ${thought ? "thought" : "speech"}`;
    el.innerHTML = `<p>${escapeHtml(nextQuote())}</p>`;
    if (thought) {
      el.insertAdjacentHTML(
        "beforeend",
        '<i class="puff a"></i><i class="puff b"></i><i class="puff c"></i>',
      );
    } else {
      el.insertAdjacentHTML("beforeend", '<i class="tail"></i>');
    }
    sky.replaceChildren();
    sky.appendChild(el);
    placeBubble(el, slot);
    slot += 1;
  }

  function showQuote() {
    spawn();
    window.clearTimeout(quoteTimer);
    quoteTimer = window.setTimeout(showQuote, quoteDelay());
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
    if (event.target.closest("a, button, .folio")) return;
    showQuote();
  });

  folio?.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
    },
    { passive: false },
  );

  window.addEventListener("resize", () => {
    resizeWeather();
    for (const el of sky.children) placeBubble(el);
  });

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
