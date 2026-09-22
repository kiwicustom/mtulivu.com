(() => {
  const quotes = Array.isArray(window.MTULIVU_QUOTES) ? window.MTULIVU_QUOTES : [];
  const quoteEl = document.getElementById("quote");
  const guru = document.querySelector(".guru img");
  const weather = document.getElementById("weather");
  const life = document.getElementById("life");
  const PHOTO = window.matchMedia("(min-width: 901px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SEASONS = ["summer", "fall", "winter", "spring"];
  const SEASON_MS = 5000;
  const VIEWS = ["home", "about", "work", "values", "contact"];
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

  function loadVista() {
    if (!PHOTO.matches) return;
    for (const img of document.querySelectorAll(".vista__shot")) {
      if (!img.getAttribute("src")) {
        img.src = `gfx-guru-sam/season-${img.dataset.shot}.jpg`;
      }
    }
  }

  function viewFromHash() {
    const name = (location.hash || "#home").slice(1);
    return VIEWS.includes(name) ? name : "home";
  }

  function setView(name) {
    const view = VIEWS.includes(name) ? name : "home";
    document.documentElement.dataset.view = view;
    for (const id of ["about", "work", "values", "contact"]) {
      const sheet = document.getElementById(id);
      if (sheet) sheet.hidden = id !== view;
    }
    for (const link of document.querySelectorAll(".plank[data-view]")) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-on", href === `#${view}`);
    }
    const want = view === "home" ? "#home" : `#${view}`;
    if (location.hash !== want) history.replaceState(null, "", want);
    if (view !== "contact") {
      const cal = document.getElementById("cal");
      const scrim = document.getElementById("cal-scrim");
      if (cal) cal.hidden = true;
      if (scrim) scrim.hidden = true;
    }
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
    if (event.target.closest("a, button, .sheet, .quote, .nav, .planks, .together, .cal, .cal-scrim")) return;
    if (document.documentElement.dataset.view !== "home") {
      setView("home");
      return;
    }
    showQuote();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const cal = document.getElementById("cal");
    if (cal && !cal.hidden) {
      cal.dispatchEvent(new Event("mtulivu:close"));
      return;
    }
    setView("home");
  });

  window.addEventListener("hashchange", () => setView(viewFromHash()));
  window.addEventListener("resize", resizeWeather);
  PHOTO.addEventListener("change", loadVista);

  loadVista();
  setView(viewFromHash());

  guru.addEventListener("load", start, { once: true });
  if (guru.complete) start();
  window.setTimeout(start, 1200);

  if ("serviceWorker" in navigator) {
    let reloading = false;
    navigator.serviceWorker.register("./sw.js?v=27").catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      location.reload();
    });
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

  (function wireBook() {
    const form = document.getElementById("book");
    const done = document.getElementById("book-done");
    const err = document.getElementById("book-err");
    const tzEl = document.getElementById("book-tz");
    const choices = document.getElementById("book-choices");
    const picked = document.getElementById("book-picked");
    const again = document.getElementById("book-again");
    const cal = document.getElementById("cal");
    const scrim = document.getElementById("cal-scrim");
    const calTitle = document.getElementById("cal-title");
    const calWhich = document.getElementById("cal-which");
    const calGrid = document.getElementById("cal-grid");
    const calHours = document.getElementById("cal-hours");
    const calMins = document.getElementById("cal-mins");
    if (!form || !done || !cal) return;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "local time";
    if (tzEl) tzEl.textContent = tz.replace(/_/g, " ");

    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const slotInputs = ["slot1", "slot2", "slot3"].map((name) => form.elements.namedItem(name));
    const slotBtns = [1, 2, 3].map((n) => form.querySelector(`.slot-pick[data-slot="${n}"]`));
    let len = 30;
    let calSlot = 1;
    let viewY = new Date().getFullYear();
    let viewM = new Date().getMonth();
    let pickDay = null;
    let pickHour = null;
    let pickMin = null;

    const pad = (n) => String(n).padStart(2, "0");

    function showErr(msg) {
      if (!err) return;
      err.hidden = !msg;
      err.textContent = msg || "";
    }

    function startOfDay(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function parseSlot(value) {
      if (!value) return null;
      const stamp = new Date(value);
      return Number.isNaN(stamp.getTime()) ? null : stamp;
    }

    function toLocalValue(date) {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function labelSlot(date) {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    function labelSlotMail(date) {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(date);
    }

    function paintSlotBtn(i) {
      const btn = slotBtns[i];
      const date = parseSlot(slotInputs[i] && slotInputs[i].value);
      const label = btn && btn.querySelector("b");
      if (!btn || !label) return;
      btn.classList.toggle("is-set", Boolean(date));
      label.textContent = date ? labelSlot(date) : "Pick a time";
    }

    function snapMinutes(mins) {
      return Math.floor(mins / len) * len;
    }

    function isPastStamp(date) {
      return date.getTime() < Date.now() + 20 * 60 * 1000;
    }

    function closeCal() {
      cal.hidden = true;
      if (scrim) scrim.hidden = true;
      for (const btn of slotBtns) btn && btn.classList.remove("is-on");
    }

    function paintCal() {
      calTitle.textContent = `${MONTHS[viewM]} ${viewY}`;
      calWhich.textContent = `Time ${calSlot} of 3 · ${len} min`;
      calGrid.innerHTML = "";
      const first = new Date(viewY, viewM, 1);
      const lead = (first.getDay() + 6) % 7;
      const days = new Date(viewY, viewM + 1, 0).getDate();
      const today = startOfDay(new Date());
      for (let i = 0; i < lead; i += 1) {
        calGrid.appendChild(document.createElement("span"));
      }
      for (let day = 1; day <= days; day += 1) {
        const btn = document.createElement("button");
        const stamp = new Date(viewY, viewM, day);
        btn.type = "button";
        btn.className = "cal__day";
        btn.textContent = String(day);
        if (stamp < today) btn.disabled = true;
        if (stamp.getTime() === today.getTime()) btn.classList.add("is-today");
        if (pickDay && stamp.getTime() === pickDay.getTime()) btn.classList.add("is-on");
        btn.addEventListener("click", () => {
          pickDay = stamp;
          pickHour = null;
          pickMin = null;
          paintCal();
        });
        calGrid.appendChild(btn);
      }
      calHours.innerHTML = "";
      HOURS.forEach((hour) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal__chip";
        btn.textContent = pad(hour);
        if (!pickDay) {
          btn.disabled = true;
        } else {
          const last = new Date(pickDay);
          last.setHours(hour, 0, 0, 0);
          if (isPastStamp(last)) btn.disabled = true;
        }
        if (pickHour === hour) btn.classList.add("is-on");
        btn.addEventListener("click", () => {
          pickHour = hour;
          pickMin = null;
          paintCal();
        });
        calHours.appendChild(btn);
      });
      calMins.innerHTML = "";
      const mins = len === 15 ? [0, 15, 30, 45] : [0, 30];
      mins.forEach((minute) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal__chip";
        btn.textContent = `${pickHour == null ? "--" : pad(pickHour)}:${pad(minute)}`;
        if (pickDay == null || pickHour == null) {
          btn.disabled = true;
        } else {
          const stamp = new Date(pickDay);
          stamp.setHours(pickHour, minute, 0, 0);
          if (isPastStamp(stamp)) btn.disabled = true;
        }
        if (pickMin === minute) btn.classList.add("is-on");
        btn.addEventListener("click", () => {
          if (pickDay == null || pickHour == null) return;
          pickMin = minute;
          const stamp = new Date(pickDay);
          stamp.setHours(pickHour, minute, 0, 0);
          slotInputs[calSlot - 1].value = toLocalValue(stamp);
          paintSlotBtn(calSlot - 1);
          closeCal();
        });
        calMins.appendChild(btn);
      });
    }

    function openCal(i) {
      calSlot = i;
      const existing = parseSlot(slotInputs[i - 1] && slotInputs[i - 1].value);
      const now = new Date();
      viewY = existing ? existing.getFullYear() : now.getFullYear();
      viewM = existing ? existing.getMonth() : now.getMonth();
      pickDay = existing ? startOfDay(existing) : null;
      pickHour = existing ? existing.getHours() : null;
      pickMin = existing ? snapMinutes(existing.getMinutes()) : null;
      for (const btn of slotBtns) btn && btn.classList.toggle("is-on", btn === slotBtns[i - 1]);
      cal.hidden = false;
      if (scrim) scrim.hidden = false;
      paintCal();
    }

    slotBtns.forEach((btn, i) => {
      btn?.addEventListener("click", () => openCal(i + 1));
    });

    document.getElementById("cal-prev")?.addEventListener("click", () => {
      viewM -= 1;
      if (viewM < 0) {
        viewM = 11;
        viewY -= 1;
      }
      paintCal();
    });
    document.getElementById("cal-next")?.addEventListener("click", () => {
      viewM += 1;
      if (viewM > 11) {
        viewM = 0;
        viewY += 1;
      }
      paintCal();
    });
    scrim?.addEventListener("click", closeCal);
    cal.addEventListener("mtulivu:close", closeCal);

    form.querySelectorAll(".book__len button").forEach((btn) => {
      btn.addEventListener("click", () => {
        len = Number(btn.dataset.len) === 15 ? 15 : 30;
        form.querySelectorAll(".book__len button").forEach((other) => {
          other.classList.toggle("is-on", other === btn);
        });
        slotInputs.forEach((input, i) => {
          const date = parseSlot(input && input.value);
          if (!date) return;
          date.setMinutes(snapMinutes(date.getMinutes()), 0, 0);
          input.value = toLocalValue(date);
          paintSlotBtn(i);
        });
        if (!cal.hidden) paintCal();
      });
    });

    function readRequest() {
      const name = String(form.elements.namedItem("name")?.value || "").trim();
      const email = String(form.elements.namedItem("email")?.value || "").trim();
      const why = String(form.elements.namedItem("why")?.value || "").trim();
      const slots = slotInputs.map((input) => parseSlot(input && input.value));
      if (!name) return { error: "Name first." };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "A real email." };
      if (!why) return { error: "One line on why." };
      if (slots.some((slot) => !slot)) return { error: "All three times, please." };
      if (slots.some((slot) => isPastStamp(slot))) {
        return { error: "All three have to be in the future." };
      }
      const keys = slots.map((slot) => toLocalValue(slot));
      if (new Set(keys).size !== 3) return { error: "Three different times — not the same slot twice." };
      return { name, email, why, slots, tz, len };
    }

    function mailBody(req) {
      const lines = [
        "Propose three times",
        "",
        `Name: ${req.name}`,
        `Email: ${req.email}`,
        `Why: ${req.why}`,
        `Timezone: ${req.tz}`,
        `Length: ${req.len} min`,
        "",
        `1) ${labelSlotMail(req.slots[0])}`,
        `2) ${labelSlotMail(req.slots[1])}`,
        `3) ${labelSlotMail(req.slots[2])}`,
        "",
        "Reply with 1, 2 or 3.",
        "The call is a private room on https://meet.infra.kiwicustom.com/",
        "Mint the lounge invite the morning of — not now.",
      ];
      return lines.join("\n");
    }

    function paintChoices(req) {
      choices.innerHTML = "";
      req.slots.forEach((slot, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = `<b>Slot ${i + 1} · ${req.len} min</b>${labelSlotMail(slot)}`;
        btn.addEventListener("click", () => {
          for (const other of choices.querySelectorAll("button")) other.classList.remove("is-on");
          btn.classList.add("is-on");
          picked.hidden = false;
          picked.innerHTML =
            `Locked: <b>${labelSlotMail(slot)}</b> · ${req.len} min. Morning of, open a Chill room on ` +
            `<a href="https://meet.infra.kiwicustom.com/" rel="noopener">meet.infra.kiwicustom.com</a> ` +
            `and send them the invite URL.`;
        });
        li.appendChild(btn);
        choices.appendChild(li);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const req = readRequest();
      if (req.error) {
        showErr(req.error);
        return;
      }
      showErr("");
      const subject = encodeURIComponent(`Three times from ${req.name}`);
      const body = encodeURIComponent(mailBody(req));
      window.open(`mailto:hello@mtulivu.com?subject=${subject}&body=${body}`);
      form.hidden = true;
      done.hidden = false;
      picked.hidden = true;
      paintChoices(req);
    });

    again?.addEventListener("click", () => {
      done.hidden = true;
      form.hidden = false;
      form.reset();
      len = 30;
      form.querySelectorAll(".book__len button").forEach((btn) => {
        btn.classList.toggle("is-on", btn.dataset.len === "30");
      });
      slotInputs.forEach((_, i) => paintSlotBtn(i));
      showErr("");
      picked.hidden = true;
      choices.innerHTML = "";
      closeCal();
    });
  })();
})();
