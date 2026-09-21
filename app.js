(() => {
  const quotes = Array.isArray(window.MTULIVU_QUOTES) ? window.MTULIVU_QUOTES : [];
  const sky = document.getElementById("bubbles");
  const guru = document.querySelector(".guru img");
  const weather = document.getElementById("weather");
  const flock = document.getElementById("butterflies");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HEAD = { x: 0.5, y: 0.235 };
  const SEASONS = ["summer", "fall", "winter", "spring"];
  const SEASON_MS = 15000;
  const SLOTS = [
    { deg: -150, dist: 0.42 },
    { deg: -30, dist: 0.42 },
    { deg: 178, dist: 0.48 },
    { deg: 2, dist: 0.48 },
    { deg: -118, dist: 0.5 },
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
    return Math.min(max, Math.max(min, n));
  }

  function placeBubble(el) {
    const head = headPoint();
    const box = guru.getBoundingClientRect();
    const chosen = SLOTS[slot % SLOTS.length];
    slot += 1;
    const deg = chosen.deg + (Math.random() * 10 - 5);
    const rad = (deg * Math.PI) / 180;
    const dist = box.width * (chosen.dist + Math.random() * 0.04);
    let x = head.x + Math.cos(rad) * dist;
    let y = head.y + Math.sin(rad) * dist;
    const faceLeft = box.left + box.width * 0.32;
    const faceRight = box.left + box.width * 0.68;
    const faceTop = box.top + box.height * 0.02;
    const faceBottom = box.top + box.height * 0.44;
    if (x > faceLeft && x < faceRight && y > faceTop && y < faceBottom) {
      x = x < (faceLeft + faceRight) / 2 ? faceLeft - 24 : faceRight + 24;
    }
    x = clamp(x, 108, window.innerWidth - 108);
    y = clamp(y, 78, window.innerHeight - 88);
    const tail = (Math.atan2(head.y - y, head.x - x) * 180) / Math.PI;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--tail", `${tail}deg`);
    const reach = el.offsetWidth / 2;
    el.style.setProperty("--reach", `${reach}px`);
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
    placeBubble(el);
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
    if (event.target.closest("a")) return;
    showQuote();
  });

  window.addEventListener("resize", () => {
    resizeWeather();
    for (const el of sky.children) placeBubble(el);
  });

  guru.addEventListener("load", start, { once: true });
  if (guru.complete) start();
})();
