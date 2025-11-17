// PennerDash Frontend v10 mit Szenenbildern, Laune, neuen Aktionen,
// Innenräumen & erweiterten Animationen (Parallax, Loot-Popups, Partikel)
const API_BASE_URL = "https://penner-server.onrender.com/api";

const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const nameInput = document.getElementById("player-name-input");
const pinInput = document.getElementById("player-pin-input");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const resetSessionBtn = document.getElementById("reset-session-btn");
const forgotPinBtn = document.getElementById("forgot-pin-btn");
const logoutBtn = document.getElementById("logout-btn");

const statusIndicator = document.getElementById("status-indicator");

const nameDisplay = document.getElementById("player-name-display");
const levelDisplay = document.getElementById("level-display");
const bottlesDisplay = document.getElementById("bottles-display");
const moneyDisplay = document.getElementById("money-display");
const xpDisplay = document.getElementById("xp-display");
const moodDisplay = document.getElementById("mood-display");
const xpBarFill = document.getElementById("xp-bar-fill");
const energyDisplay = document.getElementById("energy-display");
const hungerDisplay = document.getElementById("hunger-display");
const locationDisplay = document.getElementById("location-display");
const messageLog = document.getElementById("message-log");
const sceneImage = document.getElementById("scene-image");
const sceneOverlay = document.getElementById("scene-overlay");

const locationButtons = document.querySelectorAll(".location-btn");
const collectBtn = document.getElementById("collect-btn");
const sellBtn = document.getElementById("sell-btn");
const breadBtn = document.getElementById("bread-btn");
const sleepBtn = document.getElementById("sleep-btn");
const dumpsterBtn = document.getElementById("dumpster-btn");
const riskyBtn = document.getElementById("risky-btn");
const toggleInsideBtn = document.getElementById("toggle-inside-btn");
const leaderboardContainer = document.getElementById("leaderboard");
const refreshLeaderboardBtn = document.getElementById("refresh-leaderboard-btn");
const clanCurrentLabel = document.getElementById("clan-current-label");
const clanInput = document.getElementById("clan-input");
const clanSetBtn = document.getElementById("clan-set-btn");

const inventoryList = document.getElementById("inventory-list");

const locationInfoCard = document.getElementById("location-info-card");
const locationInfoToggle = document.getElementById("location-info-toggle");
const locationInfoBody = document.getElementById("location-info-body");
const locationInfoText = document.getElementById("location-info-text");
const locationInfoTitle = document.getElementById("location-info-title");
const locationInfoChevron = document.getElementById("location-info-chevron");

const menuToggleBtn = document.getElementById("menu-toggle-btn");
const menuOverlay = document.getElementById("main-menu-overlay");
const menuCloseBtn = document.getElementById("menu-close-btn");
const menuEntries = document.querySelectorAll(".menu-entry");

const soundToggleBtn = document.getElementById("sound-toggle-btn");
const volumeSlider = document.getElementById("sound-volume");

const dailyBonusSection = document.getElementById("daily-bonus-section");
const dailyBonusToggleBtn = document.getElementById("daily-bonus-toggle");
const dailyBonusBody = document.getElementById("daily-bonus-body");
const dailyBonusStreakEl = document.getElementById("daily-bonus-streak");
const dailyBonusStatusEl = document.getElementById("daily-bonus-status");
const dailyBonusCalendarEl = document.getElementById("daily-bonus-calendar");
const dailyBonusClaimBtn = document.getElementById("daily-bonus-claim-btn");

const actionsContainer = document.getElementById("actions-container");
const shopContainer = document.getElementById("shop-container");
const shopTitle = document.getElementById("shop-title");
const shopItemsList = document.getElementById("shop-items");

let currentPlayerName = null;
let currentPin = null;
let player = null;
let currentLocation = "park";
let isInside = false;
let currentShop = null;

let soundVolume = 0.8;

const ENERGY_MAX = 100;
const HUNGER_MIN = 0;
const HUNGER_MAX = 100;
const MOOD_MIN = 0;
const MOOD_MAX = 100;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Hauptmenü-Logik
if (menuToggleBtn && menuOverlay) {
  menuToggleBtn.addEventListener("click", () => {
    menuOverlay.classList.toggle("hidden");
    playSound("click");
  });
}
if (menuCloseBtn && menuOverlay) {
  menuCloseBtn.addEventListener("click", () => {
    menuOverlay.classList.add("hidden");
    playSound("click");
  });
}
if (menuEntries && menuEntries.length) {
  menuEntries.forEach((entry) => {
    entry.addEventListener("click", () => {
      const action = entry.getAttribute("data-menu-action");
      if (!action) return;
      if (action === "start") {
        menuOverlay.classList.add("hidden");
        if (player) {
          loginScreen.classList.add("hidden");
          gameScreen.classList.remove("hidden");
        } else {
          loginScreen.classList.remove("hidden");
          gameScreen.classList.add("hidden");
        }
      } else if (action === "login") {
        menuOverlay.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        gameScreen.classList.add("hidden");
      } else if (action === "register") {
        menuOverlay.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        gameScreen.classList.add("hidden");
        alert("Neuer Account? Gib einfach einen neuen Namen + PIN ein. Der Account wird beim ersten Login automatisch erstellt.");
      } else if (action === "profile") {
        if (!player) return;
        menuOverlay.classList.add("hidden");
        loginScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        const card = document.querySelector(".player-card");
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (action === "locations") {
        if (!player) return;
        menuOverlay.classList.add("hidden");
        loginScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        const mapCard = document
          .querySelector("#game-screen .scene-image")
          ?.closest(".card");
        if (mapCard) {
          mapCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

// Sound-Toggle
if (soundToggleBtn) {
  // Lautstärke-Slider
if (volumeSlider) {
  volumeSlider.value = Math.round(soundVolume * 100);
  volumeSlider.addEventListener("input", (e) => {
    const v = Number(e.target.value) || 0;
    setGlobalVolume(v / 100);
  });
}

soundToggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔈";
    if (!soundEnabled) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
      playSound("click");
    }
  });
}



/* Location-Info Panel (ein-/ausklappbar) */
if (locationInfoToggle && locationInfoBody) {
  locationInfoToggle.addEventListener("click", () => {
    const collapsed = locationInfoBody.classList.toggle("collapsed");
    if (locationInfoChevron) {
      locationInfoChevron.textContent = collapsed ? "▶" : "▼";
    }
  });
}

function xpNeededForLevel(level) {
  return 50 + (level - 1) * 35;
}

let audioCtx = null;
let soundEnabled = true;

// Hintergrundmusik (ortsabhängige Ambient-Sounds je nach Ort)
let musicEnabled = true;
let locationMusic = null;
let locationMusicLocation = null;

const LOCATION_MUSIC_FILES = {
  park: null,
  station: "static/sfx/city.mp3",
  bakery: null,
  deposit: null,
  city: "static/sfx/city.mp3",
  kebab: "static/sfx/city.mp3",
};

const sfx = {};
function loadSfx(name, file) {
  if (typeof Audio === "undefined") return;
  try {
    const a = new Audio(file);
    a.volume = soundVolume;
    sfx[name] = a;
  } catch (e) {
    console.warn("Konnte Sound nicht laden:", name, e);
  }
}

// Sounddateien für wichtige Aktionen
loadSfx("cash", "static/sfx/cash.mp3");
loadSfx("eat", "static/sfx/eat.mp3");
loadSfx("paper", "static/sfx/paper.mp3");
loadSfx("snore", "static/sfx/snore.mp3");
loadSfx("warn", "static/sfx/warn.mp3");




// iOS / PWA: Audio-Unlock beim ersten Tap/Klick
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  try {
    // WebAudio ggf. aktivieren
    ensureAudioCtx();
    if (audioCtx && audioCtx.state === "suspended" && audioCtx.resume) {
      audioCtx.resume();
    }
  } catch (e) {
    console.warn("Konnte AudioContext nicht aktivieren:", e);
  }

  // Alle geladenen SFX einmal ganz kurz "anstoßen",
  // damit iOS sie danach normal abspielen lässt
  try {
    const values = Object.values(sfx || {});
    for (const a of values) {
      if (!a) continue;
      try {
        a.muted = true;
        const p = a.play();
        if (p && p.then) {
          p.then(() => {
            a.pause();
            a.currentTime = 0;
            a.muted = false;
          }).catch(() => {
            a.muted = false;
          });
        } else {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }
      } catch (e) {
        console.warn("Fehler beim Vorinitialisieren eines Sounds:", e);
      }
    }
  } catch (e) {
    console.warn("Konnte SFX nicht vorinitialisieren:", e);
  }
}

// Beim ersten Nutzer-Input Audio freischalten
["touchstart", "touchend", "mousedown", "mouseup", "click"].forEach(ev => {
  document.addEventListener(ev, unlockAudio, { once: true, passive: true });
});

function ensureAudioCtx() {
  if (!audioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) {
      audioCtx = new Ctor();
    }
  }
}

function playSound(type) {
  if (!soundEnabled) return;

  // Erst versuchen wir, eine passende Sounddatei abzuspielen
  if (sfx[type]) {
    try {
      const a = sfx[type];
      a.currentTime = 0;
      a.play();
      return;
    } catch (e) {
      console.warn("Fehler beim Abspielen von", type, e);
    }
  }

  // Fallback: Synth-Beep über WebAudio
  ensureAudioCtx();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  let freq = 440;
  if (type === "click") freq = 520;
  else if (type === "success") freq = 720;
  else if (type === "error") freq = 260;
  else if (type === "levelup") freq = 880;
  else if (type === "loot") freq = 600;

  osc.frequency.value = freq;
  gain.gain.value = 0.2;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.2 * soundVolume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.start(now);
  osc.stop(now + 0.2);
}

function setGlobalVolume(vol) {
  soundVolume = Math.max(0, Math.min(1, vol));
  // Auf alle HTML-Audio-SFX anwenden
  const values = Object.values(sfx || {});
  for (const a of values) {
    if (!a) continue;
    try {
      a.volume = soundVolume;
    } catch (e) {
      console.warn("Konnte Lautstärke nicht setzen:", e);
    }
  }
  // Hintergrundmusik ggf. anpassen
  if (locationMusic) {
    try {
      locationMusic.volume = soundVolume * 0.4;
    } catch (e) {
      console.warn("Konnte Musik-Lautstärke nicht setzen:", e);
    }
  }
}

// Ortsabhängige Ambient-Hintergrundmusik
function playLocationMusicFor(loc) {
  if (!musicEnabled || !soundEnabled) return;
  const file = LOCATION_MUSIC_FILES[loc] || null;
  if (!file) {
    // Kein Ambient-Sound für diesen Ort
    if (locationMusic) {
      try {
        locationMusic.pause();
        locationMusic.currentTime = 0;
      } catch (e) {}
    }
    locationMusic = null;
    locationMusicLocation = null;
    return;
  }

  // Wenn bereits der richtige Track läuft, nur Lautstärke anpassen
  if (locationMusic && locationMusicLocation === loc) {
    try {
      locationMusic.volume = soundVolume * 0.4;
      if (locationMusic.paused) {
        const p = locationMusic.play();
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {
      console.warn("Konnte Ortsmusik nicht fortsetzen:", e);
    }
    return;
  }

  // Alten Track stoppen
  if (locationMusic) {
    try {
      locationMusic.pause();
      locationMusic.currentTime = 0;
    } catch (e) {}
  }

  // Neuen Ambient-Track starten
  locationMusic = new Audio(file);
  locationMusic.loop = true;
  locationMusicLocation = loc;
  try {
    locationMusic.volume = soundVolume * 0.4;
    const p = locationMusic.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) {
    console.warn("Konnte Ortsmusik nicht starten:", e);
  }
}

function startBackgroundMusic() {
  if (!musicEnabled || !soundEnabled) return;
  playLocationMusicFor(currentLocation);
}

function stopBackgroundMusic() {
  if (locationMusic) {
    try {
      locationMusic.pause();
      locationMusic.currentTime = 0;
    } catch (e) {}
  }
}

function updateStatus(online) {
  statusIndicator.textContent = online ? "Online" : "Offline";
  statusIndicator.classList.toggle("status--online", online);
  statusIndicator.classList.toggle("status--offline", !online);
}

async function apiGet(path) {
  const url = API_BASE_URL + path;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      const error = new Error("API error " + res.status + ": " + text);
      error.status = res.status;
      throw error;
    }
    updateStatus(true);
    return await res.json();
  } catch (err) {
    console.error(err);
    updateStatus(false);
    throw err;
  }
}

async function apiPost(path, body) {
  const url = API_BASE_URL + path;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      const error = new Error("API error " + res.status + ": " + text);
      error.status = res.status;
      throw error;
    }
    updateStatus(true);
    return await res.json();
  } catch (err) {
    console.error(err);
    updateStatus(false);
    throw err;
  }
}

function displayLocation(locKey) {
  const mapping = {
    park: "🌳 Park",
    city: "🍺 Kneipenviertel",
    station: "🚇 Unterführung",
    kebab: "🥙 Dönerladen",
    bakery: "🔥 Feuerstelle",
    deposit: "🌉 Unter der Brücke",
  };
  return mapping[locKey] || locKey;
}

const LOCATION_INFO = {
  park: {
    title: "🌳 Park",
    text: "Im Park kannst du auf der Parkbank schlafen und Energie zurückholen. Hier ist es eher ruhig."
  },
  station: {
    title: "🚇 Unterführung",
    text: "In der Unterführung kannst du Mülltonnen durchsuchen und riskante Aktionen wagen. Gute Chancen auf Loot, aber auch Stress mit den Leuten dort."
  },
  bakery: {
    title: "🔥 Feuerstelle",
    text: "An der Feuerstelle kannst du dich aufwärmen, andere Penner treffen und gemütlich am Feuer sitzen."
  },
  deposit: {
    title: "🌉 Unter der Brücke (Pfandstelle)",
    text: "Unter der Brücke gibst du dein Pfand ab und tauschst Flaschen in Geld um. Ohne Flaschen lohnt sich der Weg kaum."
  },
  city: {
    title: "🍺 Kneipenviertel",
    text: "Im Kneipenviertel ist nachts viel los. Riskante Aktionen können hier besonders lukrativ sein – aber auch gefährlich."
  },
  kebab: {
    title: "🥙 Dönerladen",
    text: "Im Dönerladen bekommst du später Essen und Snacks, um Hunger zu stillen und deine Laune zu pushen."
  }
};

function updateLocationInfo() {
  if (!locationInfoText || !locationInfoTitle || !locationInfoBody) return;
  const info = LOCATION_INFO[currentLocation];
  if (!info) {
    locationInfoTitle.textContent = "Ort-Info";
    locationInfoText.textContent =
      "Wähle einen Spot in der Stadt, um zu sehen, was du dort machen oder finden kannst.";
    return;
  }
  locationInfoTitle.textContent = info.title;
  let text = info.text;

  if (isInside) {
    if (currentLocation === "kebab") {
      text += " Du bist im Laden – hier kannst du einkaufen, sobald das Angebot freigeschaltet ist.";
    } else if (currentLocation === "deposit") {
      text += " Du stehst direkt an der Pfandstelle und kannst deine Flaschen abgeben.";
    } else {
      text += " Du befindest dich gerade im Gebäude / Unterschlupf an diesem Ort.";
    }
  }

  locationInfoText.textContent = text;
}

function pushMessage(msg) {
  messageLog.textContent = msg;
}

/** Loot-Popups */
function spawnFloatingText(text, color = "#4ef58f") {
  if (!sceneOverlay) return;
  const span = document.createElement("span");
  span.className = "floating-text";
  span.textContent = text;
  span.style.color = color;
  sceneOverlay.appendChild(span);
  setTimeout(() => {
    span.remove();
  }, 900);
}

/** Partikel-Effekt: ein paar „Regen/Staub“-Streifen */
function spawnParticles(count = 8) {
  if (!sceneOverlay) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = 1.5 + Math.random();
    p.style.left = left + "%";
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = delay + "s";
    sceneOverlay.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000);
  }
}

/** Parallax: bewegt das Bild leicht bei Scroll / Maus */
function initParallax() {
  if (!sceneImage) return;
  sceneImage.classList.add("parallax");

  function applyParallax(evYFraction) {
    const maxOffset = 4; // px
    const offsetY = (evYFraction - 0.5) * maxOffset * -1;
    sceneImage.style.transform = `translateY(${offsetY}px)`;
  }

  window.addEventListener("scroll", () => {
    const rect = sceneImage.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const center = rect.top + rect.height / 2;
    const frac = clamp(center / vh, 0, 1);
    applyParallax(frac);
  });

  window.addEventListener("mousemove", (ev) => {
    const vh = window.innerHeight || 1;
    const frac = clamp(ev.clientY / vh, 0, 1);
    applyParallax(frac);
  });
}

function defaultPlayer() {
  return {
    level: 1,
    xp: 0,
    bottles: 0,
    money: 0,
    totalBottles: 0,
    totalMoneyEarned: 0,
    energy: 100,
    hunger: 30,
    mood: 50,
    locationStats: {
      park: 0,
      city: 0,
      station: 0,
      kebab: 0,
      bakery: 0,
      deposit: 0,
    },
    dailyBonus: {
      lastClaimDate: null,
      streak: 0,
      claimedDates: [],
    },
    clan: null,
    inventory: [],
    stats: {
      itemsFound: 0,
      dumpsterSearches: 0,
      riskyActions: 0,
    },
  };
}

function applyBackgroundForLocation() {
  const body = document.body;
  body.className = body.className
    .split(" ")
    .filter((c) => !c.startsWith("bg-"))
    .join(" ")
    .trim();
  switch (currentLocation) {
    case "city":
      body.classList.add("bg-city");
      break;
    case "station":
      body.classList.add("bg-station");
      break;
    case "kebab":
      body.classList.add("bg-kebab");
      break;
    case "bakery":
      body.classList.add("bg-bakery");
      break;
    case "deposit":
      body.classList.add("bg-deposit");
      break;
    case "park":
    default:
      body.classList.add("bg-park");
      break;
  }
}

function applySceneImage() {
  if (!sceneImage) return;

  sceneImage.classList.add("scene-changing");
  setTimeout(() => {
    sceneImage.className = "scene-image parallax";
    switch (currentLocation) {
      case "park":
        sceneImage.classList.add("scene-park");
        break;
      case "station":
        sceneImage.classList.add("scene-station");
        break;
      case "bakery":
        sceneImage.classList.add("scene-bakery");
        break;
      case "deposit":
        sceneImage.classList.add("scene-deposit");
        break;
      case "city":
        sceneImage.classList.add("scene-city");
        break;
      case "kebab":
        sceneImage.classList.add("scene-kebab");
        break;
      default:
        sceneImage.classList.add("scene-park");
        break;
    }
    if (isInside) {
      sceneImage.classList.add("scene-inside");
    }
    // reflow & raus aus 'changing'
    void sceneImage.offsetWidth;
    sceneImage.classList.remove("scene-changing");
  }, 40);

  // Immer ein paar Partikel nach einem Wechsel
  spawnParticles(5);
}

function updateInsideButton() {
  const canEnter = ["bakery", "station", "deposit", "city", "kebab"].includes(
    currentLocation
  );
  if (!canEnter) {
    isInside = false;
    currentShop = null;
    toggleInsideBtn.disabled = true;
    toggleInsideBtn.textContent = "Nur draußen";
  } else {
    toggleInsideBtn.disabled = false;
    if (["kebab", "city"].includes(currentLocation)) {
      toggleInsideBtn.textContent = isInside
        ? "🛒 Laden verlassen"
        : "🛒 Laden betreten";
    } else {
      toggleInsideBtn.textContent = isInside
        ? "⬅️ Auf die Straße gehen"
        : "🏠 Gebäude betreten";
    }
  }
}

function ensurePlayerStructures() {
  if (!player) return;
  if (!Array.isArray(player.inventory)) {
    player.inventory = [];
  }
  if (!player.stats) {
    player.stats = { itemsFound: 0, dumpsterSearches: 0, riskyActions: 0 };
  }
}

function renderInventory() {
  if (!inventoryList || !player) return;
  ensurePlayerStructures();
  const items = player.inventory || [];
  inventoryList.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.className = "inventory-empty";
    li.textContent =
      "Noch keine Items gefunden. Durchsuche Mülltonnen oder geh riskante Aktionen ein!";
    inventoryList.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "inventory-item-row";

    const iconSpan = document.createElement("span");
    iconSpan.className = "inventory-icon";
    iconSpan.textContent = item.icon || "🎒";

    const nameSpan = document.createElement("span");
    nameSpan.className = "inventory-name";
    nameSpan.textContent = item.name || "Unbekannter Fund";

    const qtySpan = document.createElement("span");
    qtySpan.className = "inventory-qty";
    qtySpan.textContent = "x" + (item.qty || 1);

    // Tooltip / Beschreibung auf die ganze Zeile legen
    const descr = item.description || "";
    if (descr) {
      li.title = descr;
    }

    li.appendChild(iconSpan);
    li.appendChild(nameSpan);
    li.appendChild(qtySpan);

    const useBtn = document.createElement("button");
    useBtn.className = "inventory-use-btn";
    useBtn.textContent = "Benutzen";
    if (descr) {
      useBtn.title = descr;
    }
    useBtn.addEventListener("click", () => {
      useInventoryItem(item.id);
    });
    li.appendChild(useBtn);

    inventoryList.appendChild(li);
  });
}

function useInventoryItem(itemId) {
  if (!player) return;
  ensurePlayerStructures();
  const items = player.inventory || [];
  const idx = items.findIndex((it) => it.id === itemId);
  if (idx === -1) {
    pushMessage("Dieses Item ist nicht mehr in deinem Rucksack.");
    return;
  }
  const item = items[idx];

  let used = false;

  switch (itemId) {
    case "lucky_charm": {
      // Glücksbringer: kleine Buffs auf Laune & Energie
      const moodGain = 15;
      const energyGain = 15;
      player.mood = clamp((player.mood || 50) + moodGain, MOOD_MIN, MOOD_MAX);
      player.energy = clamp((player.energy || 50) + energyGain, 0, ENERGY_MAX);
      pushMessage(
        "Du spielst mit deinem Glücksbringer und fühlst dich direkt motivierter. (+Laune, +Energie)"
      );
      spawnFloatingText("+Laune/+Energie", "#7dd3fc");
      playSound("success");
      used = true;
      break;
    }
    case "trash_treasure": {
      // Kurioser Fund: auf dem Flohmarkt zu Geld machen
      const moneyGain = 2 + Math.random() * 4;
      player.money = (player.money || 0) + moneyGain;
      player.totalMoneyEarned = (player.totalMoneyEarned || 0) + moneyGain;
      pushMessage(
        "Du vertickst deinen kuriosen Fund auf dem Flohmarkt. (+ " +
          moneyGain.toFixed(2) +
          " €)"
      );
      spawnFloatingText("+" + moneyGain.toFixed(2) + " €", "#facc15");
      playSound("cash");
      used = true;
      break;
    }
    default: {
      pushMessage("Dieses Item kannst du aktuell noch nicht benutzen.");
      break;
    }
  }

  if (!used) return;

  // Itemverbrauch
  item.qty = (item.qty || 1) - 1;
  if (item.qty <= 0) {
    items.splice(idx, 1);
  }
  player.inventory = items;

  applyPlayerToUI();
  renderInventory();
  savePlayer();
  refreshLeaderboard();
}

function addItemToInventory(id, name, icon, description) {
  if (!player) return;
  ensurePlayerStructures();
  const items = player.inventory || [];
  let existing = items.find((it) => it.id === id);
  if (!existing) {
    existing = { id, name, icon, description, qty: 0 };
    items.push(existing);
  }
  existing.qty += 1;
  player.inventory = items;
  if (player.stats) {
    player.stats.itemsFound = (player.stats.itemsFound || 0) + 1;
  }
  renderInventory();
  playSound("loot");
  pushMessage("Neuer Fund: " + name + " wurde deinem Inventar hinzugefügt.");
}


const kebabShopItems = [
  { id: "kebab_bread", name: "Aufgewärmtes Brot", price: 3.50, mood: 1, hunger: 2 },
  { id: "kebab_fries", name: "Pommes", price: 7.50, mood: 5, hunger: 3 },
  { id: "kebab_doner", name: "Döner", price: 22.50, mood: 10, hunger: 10 },
  { id: "kebab_lahmacun", name: "Lahmacun", price: 15.50, mood: 9, hunger: 8 },
  { id: "kebab_pizza", name: "Pizzastück", price: 6.50, mood: 4, hunger: 4 },
  { id: "kebab_adana", name: "Adana", price: 16.50, mood: 6, hunger: 6 },
  { id: "kebab_schnitzel", name: "Schnitzel", price: 12.50, mood: 5, hunger: 8 },
  { id: "kebab_salat", name: "Salat", price: 9.50, mood: 1, hunger: 5 },
  { id: "kebab_soup", name: "Suppe", price: 5.50, mood: 3, hunger: 7 },
  { id: "kebab_baklava", name: "Baklava", price: 9.50, mood: 4, hunger: 6 }
];

const drinkShopItems = [
  { id: "drink_beer", name: "Bier", price: 1.50, mood: 1, hunger: 3 },
  { id: "drink_vodka", name: "Vodka", price: 12.66, mood: 4, hunger: 7 },
  { id: "drink_wine", name: "Wein", price: 4.77, mood: 4, hunger: 3 },
  { id: "drink_cola", name: "Cola", price: 2.89, mood: 4, hunger: 2 },
  { id: "drink_water", name: "Wasser", price: 0.30, mood: 1, hunger: 0 },
  { id: "drink_tea", name: "Eistee", price: 0.89, mood: 2, hunger: 2 },
  { id: "drink_energy", name: "Energydrink", price: 2.50, mood: 4, hunger: 1 },
  { id: "drink_fusel", name: "Pennerglück (Billiger Fusel)", price: 0.57, mood: 1, hunger: 3 }
];

function getShopItemsFor(type) {
  return type === "kebab" ? kebabShopItems : drinkShopItems;
}

function updateShopUI() {
  if (!actionsContainer || !shopContainer) return;
  if (!currentShop) {
    actionsContainer.classList.remove("hidden");
    shopContainer.classList.add("hidden");
    return;
  }

  actionsContainer.classList.add("hidden");
  shopContainer.classList.remove("hidden");

  const isKebab = currentShop === "kebab";
  if (shopTitle) {
    shopTitle.textContent = isKebab ? "Dönerladen" : "Getränkemarkt";
  }

  if (!shopItemsList) return;

  shopItemsList.innerHTML = "";
  const items = getShopItemsFor(currentShop);
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "shop-row";
    row.innerHTML = `
      <div class="shop-info">
        <div class="shop-name">${item.name}</div>
        <div class="shop-meta">${item.price.toFixed(2)} € · Laune +${item.mood} · Hunger -${item.hunger}</div>
      </div>
      <button class="small-btn shop-buy-btn" data-item-id="${item.id}">Kaufen</button>
    `;
    shopItemsList.appendChild(row);
  });

  const buttons = shopItemsList.querySelectorAll(".shop-buy-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-item-id");
      if (!id || !currentShop) return;
      buyShopItem(currentShop, id);
    });
  });
}

function buyShopItem(shopType, itemId) {
  if (!player) return;
  const items = getShopItemsFor(shopType);
  const item = items.find((it) => it.id === itemId);
  if (!item) return;

  const cost = item.price || 0;
  const money = player.money || 0;
  if (money < cost) {
    pushMessage("Du hast nicht genug Geld für " + item.name + ".");
    playSound("error");
    return;
  }

  player.money = money - cost;

  // Laune hoch
  player.mood = clamp((player.mood || 50) + (item.mood || 0), MOOD_MIN, MOOD_MAX);
  // Hunger runter (gutes Essen / Trinken = Hunger sinkt)
  const currentHunger = player.hunger || 0;
  player.hunger = clamp(currentHunger - (item.hunger || 0), HUNGER_MIN, HUNGER_MAX);

  const label = shopType === "kebab" ? "Dönerladen" : "Getränkemarkt";
  spawnFloatingText("-" + cost.toFixed(2) + " €", "#ffcf40");
  pushMessage("Du kaufst im " + label + " " + item.name + ". Dir geht es etwas besser.");

  playSound(shopType === "kebab" ? "eat" : "warn");

  applyPlayerToUI();
  savePlayer();
}

function applyPlayerToUI() {
  if (!player) return;
  if (!player.dailyBonus) {
    player.dailyBonus = { lastClaimDate: null, streak: 0, claimedDates: [] };
  }
  if (!Array.isArray(player.dailyBonus.claimedDates)) {
    player.dailyBonus.claimedDates = [];
  }
  ensurePlayerStructures();

  nameDisplay.textContent = currentPlayerName || "Spieler";
  levelDisplay.textContent = "Lv. " + (player.level || 1);
  bottlesDisplay.textContent = player.bottles ?? 0;
  moneyDisplay.textContent = (player.money ?? 0).toFixed(2) + " €";
  xpDisplay.textContent = player.xp ?? 0;
  energyDisplay.textContent = Math.round(player.energy ?? 0);
  hungerDisplay.textContent = Math.round(player.hunger ?? 0);
  moodDisplay.textContent = Math.round(player.mood ?? 50);

  const level = player.level || 1;
  const xp = player.xp || 0;
  const needed = xpNeededForLevel(level);
  const pct = Math.max(0, Math.min(100, (xp / needed) * 100));
  xpBarFill.style.width = pct + "%";

  const locLabel = displayLocation(currentLocation);
  locationDisplay.textContent = locLabel + (isInside ? " (innen)" : "");

  locationButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.location === currentLocation);
  });

  if (clanCurrentLabel) {
    const clan = player.clan;
    clanCurrentLabel.textContent = clan && clan.trim() ? "[" + clan + "]" : "Kein Clan";
  }

  updateLocationInfo();

  renderInventory();
  applyBackgroundForLocation();
  applySceneImage();
  updateInsideButton();
  updateShopUI();
  updateDailyBonusUI();
  playLocationMusicFor(currentLocation);

  // Menü-Einträge für Profil/Orte aktivieren, sobald eingeloggt
  if (menuEntries && menuEntries.length) {
    menuEntries.forEach((entry) => {
      const action = entry.getAttribute("data-menu-action");
      if (action === "profile" || action === "locations") {
        entry.disabled = !player;
      }
    });
  }
}

async function savePlayer() {
  if (!currentPlayerName || !currentPin || !player) return;
  try {
    await apiPost("/player", { name: currentPlayerName, pin: currentPin, player });
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
  }
}

async function loginOrCreate(name, pin) {
  currentPlayerName = name;
  currentPin = pin;
  const res = await apiPost("/login", { name, pin });
  const loaded = res.player || {};
  player = Object.assign(defaultPlayer(), loaded);
  player.mood = clamp(player.mood ?? 50, MOOD_MIN, MOOD_MAX);
  applyPlayerToUI();
  refreshLeaderboard();
}

loginBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const pin = pinInput.value.trim();
  if (!name) {
    alert("Bitte gib einen Namen ein.");
    return;
  }
  if (!/^[0-9]{4}$/.test(pin)) {
    alert("PIN muss genau 4 Ziffern haben.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Verbinde...";
  playSound("click");
  try {
    await loginOrCreate(name, pin);
    // zuletzt verwendete Daten speichern
    localStorage.setItem("pennerdash_last_name", name);
    localStorage.setItem("pennerdash_last_pin", pin);
    loginScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    startBackgroundMusic();
    playSound("success");
    pushMessage("Eingeloggt als " + name + ".");
  } catch (err) {
    console.error(err);
    playSound("error");
    if (err.status === 401) {
      alert("PIN stimmt nicht zu diesem Namen.");
    } else {
      alert("Fehler beim Verbinden mit dem Server.");
    }
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Einloggen";
  }
});



registerBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const pin = pinInput.value.trim();
  if (!name) {
    alert("Bitte gib einen Namen für deinen neuen Penner ein.");
    return;
  }
  if (!/^[0-9]{4}$/.test(pin)) {
    alert("PIN muss genau 4 Ziffern haben.");
    return;
  }

  if (!confirm("Neuen Penner erstellen?\nWenn unter diesem Namen schon ein Penner existiert und die PIN stimmt, wird dieser geladen.")) {
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Erstelle...";
  playSound("click");
  try {
    await loginOrCreate(name, pin);
    localStorage.setItem("pennerdash_last_name", name);
    localStorage.setItem("pennerdash_last_pin", pin);
    loginScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    playSound("success");
    pushMessage("Neuer Account erstellt oder geladen als " + name + ".");
  } catch (err) {
    console.error(err);
    playSound("error");
    if (err.status === 401) {
      alert("PIN stimmt nicht zu diesem Namen.");
    } else {
      alert("Fehler beim Verbinden mit dem Server.");
    }
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Penner erstellen";
  }
});

if (resetSessionBtn) {
resetSessionBtn.addEventListener("click", () => {
  if (!currentPlayerName || !currentPin || !player) {
    localStorage.removeItem("pennerdash_last_name");
    localStorage.removeItem("pennerdash_last_pin");
  
    nameInput.value = "";
    pinInput.value = "";
    if (clanInput) clanInput.value = "";
    pushMessage("Session zurückgesetzt. Neuer Penner wird beim nächsten Login erstellt.");
    return;
  }
  if (!confirm("Willst du diesen Penner wirklich zurücksetzen?")) {
    return;
  }
  player = defaultPlayer();
  isInside = false;
  applyPlayerToUI();
  savePlayer();
  pushMessage("Dein Penner wurde zurückgesetzt.");
  refreshLeaderboard();
});

}



if (forgotPinBtn) {
  forgotPinBtn.addEventListener("click", async () => {
    let baseName = nameInput ? nameInput.value.trim() : "";
    if (!baseName) {
      baseName = prompt("Wie heißt dein Penner? (Name genau wie im Spiel / in der Rangliste)");
      if (!baseName) return;
      baseName = baseName.trim();
    }
    const newPin = prompt("Gib eine neue PIN ein (genau 4 Ziffern):");
    if (!newPin) return;
    if (!/^[0-9]{4}$/.test(newPin)) {
      alert("Die neue PIN muss genau 4 Ziffern haben.");
      return;
    }

    try {
      await apiPost("/resetPin", { name: baseName, newPin });
      alert("Deine PIN wurde zurückgesetzt. Du kannst dich jetzt mit der neuen PIN einloggen.");
      if (nameInput) nameInput.value = baseName;
      if (pinInput) pinInput.value = newPin;
      localStorage.setItem("pennerdash_last_name", baseName);
      localStorage.setItem("pennerdash_last_pin", newPin);
    } catch (err) {
      console.error(err);
      playSound("error");
      alert("Konnte PIN nicht zurücksetzen. Bitte frag den Admin oder versuch es später erneut.");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Lokale Session und Spielzustand zurücksetzen
    currentPlayerName = null;
    currentPin = null;
    player = null;
    currentLocation = "park";
    isInside = false;
    if (typeof currentShop !== "undefined") {
      currentShop = null;
    }

    // Login-Daten aus dem LocalStorage entfernen
    localStorage.removeItem("pennerdash_last_name");
    localStorage.removeItem("pennerdash_last_pin");

    stopBackgroundMusic();

    // UI anpassen
    nameInput.value = "";
    pinInput.value = "";
    if (clanInput) clanInput.value = "";
    loginScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
    logoutBtn.classList.add("hidden");

    if (statusIndicator) {
      statusIndicator.textContent = "Offline";
      statusIndicator.classList.remove("status--online");
      statusIndicator.classList.add("status--offline");
    }

    if (messageLog) {
      messageLog.textContent = "Du hast dich ausgeloggt.";
    }

    // Hintergrund / Buttons zurücksetzen
    applyBackgroundForLocation();
    applySceneImage();
    updateInsideButton();
  });
}

locationButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const newLoc = btn.dataset.location;
    currentLocation = newLoc;
    isInside = false;
    currentShop = null;
    if (player && player.locationStats) {
      player.locationStats[newLoc] = (player.locationStats[newLoc] || 0) + 1;
      savePlayer();
    }
    applyPlayerToUI();
  });
});

toggleInsideBtn.addEventListener("click", () => {
  const canEnter = ["bakery", "station", "deposit", "city", "kebab"].includes(
    currentLocation
  );
  if (!canEnter) {
    pushMessage("Hier gibt es kein Gebäude, das du betreten kannst.");
    return;
  }

  const goingInside = !isInside;
  isInside = goingInside;

  if (goingInside) {
    if (currentLocation === "kebab") {
      currentShop = "kebab";
    } else if (currentLocation === "city") {
      currentShop = "city";
    } else {
      currentShop = null;
    }
    spawnFloatingText("🏠", "#ffd56b");
    pushMessage(
      currentShop
        ? "Du betrittst den Laden."
        : "Du betrittst das Gebäude."
    );
  } else {
    currentShop = null;
    spawnFloatingText("⬅️", "#ffffff");
    pushMessage("Du gehst wieder auf die Straße.");
  }

  applyPlayerToUI();
});

collectBtn.addEventListener("click", async () => {
  if (!player) return;
  if (currentShop) {
    pushMessage("Du kannst im Laden kein Pfand sammeln. Verlass zuerst den Laden.");
    return;
  }
  if (!player.dailyBonus) {
    player.dailyBonus = { lastClaimDate: null, streak: 0 };
  }
  if ((player.energy ?? 0) <= 0) {
    pushMessage("Du bist zu müde. Geh auf die Parkbank pennen.");
    return;
  }

  let found = 1 + Math.floor(Math.random() * 4);
  let xpGain = 5 + Math.floor(Math.random() * 6);
  let energyCost = 10;
  let hungerGain = 8;
  let bonusText = "";
  let popupText = "";

  // Laune-Effekt
  if (player.mood > 70) {
    found += 1;
    xpGain += 2;
    bonusText += " (Gute Laune – du bist motivierter!)";
  } else if (player.mood < 30) {
    hungerGain += 3;
    energyCost += 2;
    bonusText += " (Schlechte Laune – alles strengt mehr an.)";
  }

  // Orts-Effekte
  switch (currentLocation) {
    case "station":
      found += 1;
      xpGain += 2;
      bonusText += " (Bonus in der Unterführung!)";
      break;
    case "city":
      hungerGain += 4;
      bonusText += " (Kneipenviertel stresst, du wirst hungriger.)";
      break;
    case "kebab":
      hungerGain = Math.max(0, hungerGain - 5);
      bonusText += " (Beim Dönerladen schnorrst du Reste, weniger Hunger.)";
      break;
    case "park":
      energyCost = Math.max(5, energyCost - 3);
      bonusText += " (Im Park ist es entspannt, weniger Energieverbrauch.)";
      break;
    case "bakery":
    case "deposit":
    default:
      break;
  }

  // Kleine Polizei-/Glück-Events als Mix
  const roll = Math.random();
  ensurePlayerStructures();
  if (player && player.stats) {
    player.stats.riskyActions = (player.stats.riskyActions || 0) + 1;
  }
  playSound("click");
  ensurePlayerStructures();
  if (player.stats) {
    player.stats.dumpsterSearches = (player.stats.dumpsterSearches || 0) + 1;
  }
  playSound("click");
  if (roll < 0.1 && player.bottles > 0) {
    const lost = Math.min(player.bottles, 2);
    player.bottles -= lost;
    bonusText += " 👮 Polizei-Kontrolle! Du verlierst " + lost + " Flaschen.";
    popupText = "-"+lost+" 🍾";
  } else if (roll > 0.9) {
    found *= 2;
    xpGain += 3;
    bonusText += " 🍀 Glückssträhne – doppelte Flaschen!";
    popupText = "x2 🍾";
  }

  player.bottles = (player.bottles || 0) + found;
  player.totalBottles = (player.totalBottles || 0) + found;

  player.xp = (player.xp || 0) + xpGain;

  player.energy = clamp(
    (player.energy || 0) - energyCost,
    0,
    ENERGY_MAX
  );
  player.hunger = clamp(
    (player.hunger || 0) + hungerGain,
    HUNGER_MIN,
    HUNGER_MAX
  );
  player.mood = clamp((player.mood || 50) + 1, MOOD_MIN, MOOD_MAX);

  let leveledUp = false;
  while (player.xp >= xpNeededForLevel(player.level || 1)) {
    player.xp -= xpNeededForLevel(player.level || 1);
    player.level = (player.level || 1) + 1;
    player.energy = ENERGY_MAX;
    player.mood = clamp((player.mood || 50) + 5, MOOD_MIN, MOOD_MAX);
    leveledUp = true;
  }

  if (!popupText) {
    popupText = "+" + found + " 🍾";
  }
  spawnFloatingText(popupText, "#4ef58f");

  if (leveledUp) {
    pushMessage("Level UP! Du bist jetzt Level " + player.level + "!");
    spawnFloatingText("LEVEL UP!", "#ffd56b");
  } else {
    pushMessage(
      "Du hast " +
        found +
        " Flaschen im " +
        displayLocation(currentLocation) +
        " gefunden (+ " +
        xpGain +
        " XP)." +
        bonusText
    );
  }

  applyPlayerToUI();
  await savePlayer();
  refreshLeaderboard();
});

sellBtn.addEventListener("click", async () => {
  if (!player) return;
  if (!player.dailyBonus) {
    player.dailyBonus = { lastClaimDate: null, streak: 0 };
  }
  if (currentLocation !== "deposit" || !isInside) {
    pushMessage("Geh unter die Brücke (Pfandstelle), um deine Flaschen abzugeben.");
    return;
  }
  const bottles = player.bottles || 0;
  if (bottles <= 0) {
    pushMessage("Du hast keine Flaschen zum Abgeben.");
    return;
  }
  playSound("cash");
  const pricePerBottle = 0.25;
  const gain = bottles * pricePerBottle;
  player.bottles = 0;
  player.money = (player.money || 0) + gain;
  player.totalMoneyEarned = (player.totalMoneyEarned || 0) + gain;
  player.mood = clamp((player.mood || 50) + 4, MOOD_MIN, MOOD_MAX);

  spawnFloatingText("+" + gain.toFixed(2) + " €", "#ffcf40");
  pushMessage("Du gibst " + bottles + " Flaschen unter der Brücke für " + gain.toFixed(2) + " € ab.");
  applyPlayerToUI();
  await savePlayer();
  refreshLeaderboard();
});

breadBtn.addEventListener("click", () => {
  if (!player) {
    pushMessage("Logge dich zuerst ein, um dein Inventar zu öffnen.");
    return;
  }
  const invCard = document.getElementById("inventory-card");
  if (!invCard) return;
  const isHidden = invCard.classList.toggle("hidden");
  if (!isHidden) {
    // Inventar wurde geöffnet
    renderInventory();
    pushMessage("Du kramst in deinem Rucksack und schaust, was du dabei hast.");
  } else {
    pushMessage("Du packst deinen Kram wieder weg.");
  }
});

sleepBtn.addEventListener("click", async () => {
  if (!player) return;
  if (!player.dailyBonus) {
    player.dailyBonus = { lastClaimDate: null, streak: 0 };
  }
  if (currentLocation !== "park") {
    pushMessage("Zum Pennen musst du in den Park gehen.");
    return;
  }
  playSound("snore");
  const energyGain = 40;
  const hungerGain = 5;
  player.energy = clamp(
    (player.energy || 0) + energyGain,
    0,
    ENERGY_MAX
  );
  player.hunger = clamp(
    (player.hunger || 0) + hungerGain,
    HUNGER_MIN,
    HUNGER_MAX
  );
  player.mood = clamp((player.mood || 50) + 3, MOOD_MIN, MOOD_MAX);

  spawnFloatingText("+Energie", "#40cfff");
  pushMessage("Du pennst auf der Parkbank und fühlst dich etwas erholter.");
  applyPlayerToUI();
  await savePlayer();
  refreshLeaderboard();
});

dumpsterBtn.addEventListener("click", async () => {
  if (!player) return;
  if (!player.dailyBonus) {
    player.dailyBonus = { lastClaimDate: null, streak: 0 };
  }
  if ((player.energy ?? 0) <= 0) {
    pushMessage("Du bist zu erschöpft für Mülltonnen-Action.");
    return;
  }
  playSound("paper");

  let energyCost = 12;
  let hungerGain = 6;
  let moodDelta = -1;
  let msg = "";
  let popup = "";

  const roll = Math.random();

  if (roll < 0.6) {
    const bottles = 1 + Math.floor(Math.random() * 3);
    const xpGain = 4 + Math.floor(Math.random() * 4);
    player.bottles = (player.bottles || 0) + bottles;
    player.totalBottles = (player.totalBottles || 0) + bottles;
    player.xp = (player.xp || 0) + xpGain;
    msg = "Du wühlst in der Mülltonne und findest " + bottles + " zusätzliche Flaschen (+ " + xpGain + " XP).";
    moodDelta = 1;
    popup = "+" + bottles + " 🍾";
    if (Math.random() < 0.25) {
      addItemToInventory(
        "trash_treasure",
        "Kurioser Fund aus dem Müll",
        "🧩",
        "Ein seltsamer Gegenstand, der vielleicht noch nützlich ist."
      );
    }
  } else if (roll < 0.85) {
    const money = 0.5 + Math.random() * 2.5;
    const xpGain = 3;
    player.money = (player.money || 0) + money;
    player.totalMoneyEarned = (player.totalMoneyEarned || 0) + money;
    player.xp = (player.xp || 0) + xpGain;
    msg = "Zwischen alten Zeitungen findest du " + money.toFixed(2) + " € im Müll.";
    moodDelta = 4;
    popup = "+" + money.toFixed(2) + " €";
  } else {
    const loss = Math.min(player.bottles || 0, 3);
    player.bottles = (player.bottles || 0) - loss;
    energyCost += 5;
    hungerGain += 4;
    moodDelta = -10;
    msg =
      "Du schneidest dich an Glasscherben und verlierst " +
      loss +
      " Flaschen. Das tat weh.";
    popup = "-" + loss + " 🍾";
  }

  player.energy = clamp(
    (player.energy || 0) - energyCost,
    0,
    ENERGY_MAX
  );
  player.hunger = clamp(
    (player.hunger || 0) + hungerGain,
    HUNGER_MIN,
    HUNGER_MAX
  );
  player.mood = clamp((player.mood || 50) + moodDelta, MOOD_MIN, MOOD_MAX);

  if (popup) spawnFloatingText(popup, "#ffffff");

  pushMessage(msg);
  if (moodDelta >= 0) {
    playSound("success");
  } else {
    playSound("error");
  }
  applyPlayerToUI();
  await savePlayer();
  refreshLeaderboard();
});

riskyBtn.addEventListener("click", async () => {
  if (!player) return;
  if (!player.dailyBonus) {
    player.dailyBonus = { lastClaimDate: null, streak: 0 };
  }
  if ((player.energy ?? 0) <= 0) {
    pushMessage("Du hast keine Energie für riskante Aktionen.");
    return;
  }
  playSound("warn");

  const roll = Math.random();

  let msg = "";
  let energyCost = 15;
  let hungerGain = 6;
  let moodDelta = 0;
  let popup = "";

  if (roll < 0.4) {
    const bottles = 3 + Math.floor(Math.random() * 4);
    const money = 1 + Math.random() * 4;
    const xpGain = 10;
    player.bottles = (player.bottles || 0) + bottles;
    player.totalBottles = (player.totalBottles || 0) + bottles;
    player.money = (player.money || 0) + money;
    player.totalMoneyEarned = (player.totalMoneyEarned || 0) + money;
    player.xp = (player.xp || 0) + xpGain;
    moodDelta = 8;
    msg =
      "Du ziehst eine krasse Aktion durch und kassierst " +
      bottles +
      " Flaschen und " +
      money.toFixed(2) +
      " €. (+ " +
      xpGain +
      " XP)";
    popup = "🔥 +" + bottles + "🍾 +" + money.toFixed(0) + "€";
    if (Math.random() < 0.3) {
      addItemToInventory(
        "lucky_charm",
        "Glücksbringer",
        "🍀",
        "Dieses Stück bringt dir angeblich Glück bei zukünftigen Aktionen."
      );
    }
  } else if (roll < 0.8) {
    const xpGain = 5;
    player.xp = (player.xp || 0) + xpGain;
    moodDelta = -2;
    msg = "Deine Aktion bringt nicht viel. Nur ein bisschen Erfahrung (+ " + xpGain + " XP).";
    popup = "+XP";
  } else {
    const fine = Math.min(player.money || 0, 5);
    const lostBottles = Math.min(player.bottles || 0, 4);
    player.money = (player.money || 0) - fine;
    player.bottles = (player.bottles || 0) - lostBottles;
    energyCost += 10;
    hungerGain += 6;
    moodDelta = -15;
    msg =
      "Die Polizei kontrolliert dich. Du verlierst " +
      fine.toFixed(2) +
      " € und " +
      lostBottles +
      " Flaschen.";
    popup = "-" + fine.toFixed(0) + "€ -" + lostBottles + "🍾";
  }

  player.energy = clamp(
    (player.energy || 0) - energyCost,
    0,
    ENERGY_MAX
  );
  player.hunger = clamp(
    (player.hunger || 0) + hungerGain,
    HUNGER_MIN,
    HUNGER_MAX
  );
  player.mood = clamp((player.mood || 50) + moodDelta, MOOD_MIN, MOOD_MAX);

  let leveledUp = false;
  while (player.xp >= xpNeededForLevel(player.level || 1)) {
    player.xp -= xpNeededForLevel(player.level || 1);
    player.level = (player.level || 1) + 1;
    player.energy = ENERGY_MAX;
    player.mood = clamp((player.mood || 50) + 5, MOOD_MIN, MOOD_MAX);
    leveledUp = true;
  }

  if (popup) spawnFloatingText(popup, "#ffb84d");

  if (leveledUp) {
    msg += " Level UP! Du bist jetzt Level " + player.level + ".";
    spawnFloatingText("LEVEL UP!", "#ffd56b");
  }
  pushMessage(msg);
  if (moodDelta >= 0) {
    playSound("success");
  } else {
    playSound("error");
  }
  applyPlayerToUI();
  await savePlayer();
  refreshLeaderboard();
});

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 75%, 55%)`;
}

function parseClanAndName(name) {
  const match = name.match(/^\[([^\]]+)\]\s*(.*)$/);
  if (match) {
    const clan = match[1];
    const rest = match[2] || "";
    return { clan, baseName: rest || `[${clan}]` };
  }
  return { clan: null, baseName: name };
}


function currentDateString() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}


function updateDailyBonusUI() {
  if (!dailyBonusStreakEl || !player || !player.dailyBonus) return;

  // Sicherstellen, dass claimedDates ein Array ist
  if (!Array.isArray(player.dailyBonus.claimedDates)) {
    player.dailyBonus.claimedDates = [];
  }

  const streak = player.dailyBonus.streak || 0;
  dailyBonusStreakEl.textContent = streak;

  const todayStr = currentDateString();
  const claimedToday = player.dailyBonus.lastClaimDate === todayStr;

  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth(); // 0-11
  const monthNames = [
    "Januar","Februar","März","April","Mai","Juni",
    "Juli","August","September","Oktober","November","Dezember"
  ];

  dailyBonusStatusEl.textContent =
    (claimedToday ? "Heute schon eingesammelt ✅" : "Du kannst heute noch einsammeln.") +
    " (" + monthNames[monthIndex] + " " + year + ")";

  if (dailyBonusCalendarEl) {
    dailyBonusCalendarEl.innerHTML = "";

    const firstOfMonth = new Date(year, monthIndex, 1);
    const startWeekday = firstOfMonth.getDay(); // 0 = So, 1 = Mo ...
    // Wir wollen Montag als Start (0 = Mo ...)
    const offset = (startWeekday + 6) % 7;

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Set aus allen eingelösten Datumsstrings
    const claimedSet = new Set(player.dailyBonus.claimedDates || []);

    // Leere Felder vor dem 1. des Monats
    for (let i = 0; i < offset; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "day-cell";
      emptyCell.textContent = "";
      dailyBonusCalendarEl.appendChild(emptyCell);
    }

    // Alle Tage im Monat rendern
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "day-cell";
      const dayStr = String(day).padStart(2, "0");
      const dateStr = year + "-" + String(monthIndex + 1).padStart(2, "0") + "-" + dayStr;

      const isClaimed = claimedSet.has(dateStr);
      const isToday = dateStr === todayStr;

      if (isClaimed) {
        cell.classList.add("day-cell--claimed");
        cell.textContent = "✖";
      } else {
        cell.textContent = String(day);
        if (isToday) {
          // heutiger Tag extra hervorheben, wenn noch nicht eingelöst
          cell.style.borderColor = "rgba(255, 207, 64, 0.9)";
          cell.style.boxShadow = "0 0 10px rgba(255,207,64,0.7)";
        }
      }

      dailyBonusCalendarEl.appendChild(cell);
    }
  }
}


async function refreshLeaderboard() {
  try {
    const res = await apiGet("/leaderboard");
    const entries = res.entries || res.leaderboard || res.players || [];
    if (!entries.length) {
      leaderboardContainer.innerHTML = '<p class="hint">Noch keine Spieler vorhanden.</p>';
      return;
    }

    let playersHtml =
      '<div class="leaderboard-row header"><div>#</div><div>Spieler</div><div>Level</div><div>Flaschen</div></div>';

    entries.slice(0, 100).forEach((entry, idx) => {
      const rawName = entry.name || "Penner";
      const { clan, baseName } = parseClanAndName(rawName);
      const initial = baseName.charAt(0).toUpperCase() || rawName.charAt(0).toUpperCase() || "?";
      const color = avatarColor(rawName);

      let rankLabel = String(idx + 1);
      if (idx === 0) rankLabel = "👑1";
      else if (idx === 1) rankLabel = "🥈2";
      else if (idx === 2) rankLabel = "🥉3";

      const rowClass =
        idx === 0 ? "top1" : idx === 1 ? "top2" : idx === 2 ? "top3" : "";

      const clanClass = clan && clan.toLowerCase() === "son" ? "clan-tag clan-son" : "clan-tag";
      const tooltip =
        clan && clan.toLowerCase() === "son"
          ? "SON-Familie"
          : clan
          ? `Clan: ${clan}`
          : "";

      playersHtml += `<div class="leaderboard-row ${rowClass}">
        <div class="lb-rank">${rankLabel}</div>
        <div class="lb-player">
          <div class="avatar" style="background:${color}">${initial}</div>
          <span class="lb-name">
            ${
              clan
                ? `<span class="${clanClass}" data-tooltip="${tooltip}">[${clan}]</span>`
                : ""
            }
            <span>${baseName}</span>
          </span>
        </div>
        <div>${entry.level || 1}</div>
        <div>${entry.totalBottles || 0}</div>
      </div>`;
    });

    const clanMap = {};
    entries.forEach((entry) => {
      const rawName = entry.name || "Penner";
      const { clan } = parseClanAndName(rawName);
      if (!clan) return;
      const key = clan.toUpperCase();
      if (!clanMap[key]) {
        clanMap[key] = {
          clan: key,
          members: 0,
          totalBottles: 0,
          totalMoney: 0,
        };
      }
      clanMap[key].members += 1;
      clanMap[key].totalBottles += entry.totalBottles || 0;
      clanMap[key].totalMoney += (entry.totalMoneyEarned || entry.money || 0);
    });

    let clanHtml = "";
    const clans = Object.values(clanMap).sort(
      (a, b) => (b.totalBottles || 0) - (a.totalBottles || 0)
    );

    if (!clans.length) {
      clanHtml = '<p class="hint">Noch keine Clans mit Tag vorhanden. Nutze z.B. [SON] Name.</p>';
    } else {
      clanHtml +=
        '<div class="clan-table-row header"><div>Clan</div><div>Mitglieder</div><div>Flaschen</div></div>';
      clans.forEach((c) => {
        const isSon = c.clan.toLowerCase() === "son";
        const clanClass = isSon ? "clan-tag clan-son" : "clan-tag";
        clanHtml += `<div class="clan-table-row">
          <div>
            <span class="${clanClass}" data-tooltip="${
          isSon ? "SON-Familie" : `Clan: ${c.clan}`
        }">[${c.clan}]</span>
          </div>
          <div>${c.members}</div>
          <div>${c.totalBottles}</div>
        </div>`;
      });
    }

    leaderboardContainer.innerHTML = `
      <div class="lb-tabs">
        <button class="tab-btn tab-btn--active" data-tab="players">Spieler</button>
        <button class="tab-btn" data-tab="clans">Clans</button>
      </div>
      <div id="lb-players" class="lb-panel lb-panel--active">
        ${playersHtml}
      </div>
      <div id="lb-clans" class="lb-panel">
        ${clanHtml}
      </div>
    `;

    const tabButtons = leaderboardContainer.querySelectorAll(".tab-btn");
    const playersPanel = leaderboardContainer.querySelector("#lb-players");
    const clansPanel = leaderboardContainer.querySelector("#lb-clans");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        tabButtons.forEach((b) => b.classList.remove("tab-btn--active"));
        btn.classList.add("tab-btn--active");
        if (tab === "players") {
          playersPanel.classList.add("lb-panel--active");
          clansPanel.classList.remove("lb-panel--active");
        } else {
          clansPanel.classList.add("lb-panel--active");
          playersPanel.classList.remove("lb-panel--active");
        }
      });
    });
  } catch (err) {
    console.error("Fehler beim Laden der Rangliste:", err);
    leaderboardContainer.innerHTML = '<p class="hint">Fehler beim Laden der Rangliste.</p>';
  }
}

refreshLeaderboardBtn.addEventListener("click", refreshLeaderboard);
if (dailyBonusToggleBtn && dailyBonusBody) {
  const updateDailyBonusToggleLabel = () => {
    const isHidden = dailyBonusBody.classList.contains("hidden");
    dailyBonusToggleBtn.textContent = isHidden ? "Öffnen" : "Schließen";
  };
  updateDailyBonusToggleLabel();
  dailyBonusToggleBtn.addEventListener("click", () => {
    dailyBonusBody.classList.toggle("hidden");
    updateDailyBonusToggleLabel();
  });
}

if (dailyBonusClaimBtn) {
  dailyBonusClaimBtn.addEventListener("click", async () => {
    if (!player) return;
    if (!player.dailyBonus) {
      player.dailyBonus = { lastClaimDate: null, streak: 0, claimedDates: [] };
    }
    if (!Array.isArray(player.dailyBonus.claimedDates)) {
      player.dailyBonus.claimedDates = [];
    }

    const today = currentDateString();
    if (player.dailyBonus.lastClaimDate === today) {
      pushMessage("Du hast den Tagesbonus heute schon eingesammelt.");
      return;
    }

    // Streak aktualisieren
    if (player.dailyBonus.lastClaimDate) {
      const last = new Date(player.dailyBonus.lastClaimDate + "T00:00:00Z");
      const now = new Date(today + "T00:00:00Z");
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        player.dailyBonus.streak = (player.dailyBonus.streak || 0) + 1;
      } else {
        player.dailyBonus.streak = 1;
      }
    } else {
      player.dailyBonus.streak = 1;
    }
    player.dailyBonus.lastClaimDate = today;

    // Datum im Verlauf merken (Hardcore-Kalender)
    if (!player.dailyBonus.claimedDates.includes(today)) {
      player.dailyBonus.claimedDates.push(today);
      // optional: alte Einträge wegschneiden, damit es nicht unendlich wächst
      if (player.dailyBonus.claimedDates.length > 90) {
        player.dailyBonus.claimedDates = player.dailyBonus.claimedDates.slice(-60);
      }
    }

    // Belohnung abhängig von Streak (Basis) + Meilensteine
    const streak = player.dailyBonus.streak || 1;
    let bottlesReward = 10;
    let xpReward = 20;
    let moodReward = 8;
    let moneyReward = 0;
    let milestoneText = "";

    if (streak <= 3) {
      bottlesReward = 10;
      xpReward = 20;
      moodReward = 8;
    } else if (streak <= 6) {
      bottlesReward = 15;
      xpReward = 30;
      moodReward = 10;
    } else {
      bottlesReward = 25;
      xpReward = 50;
      moodReward = 12;
      moneyReward = 2;
    }

    // Zusätzliche Meilensteine
    if (streak === 3) {
      bottlesReward += 5;
      xpReward += 10;
      milestoneText = " (Meilenstein: 3 Tage in Folge!)";
    } else if (streak === 7) {
      bottlesReward += 10;
      xpReward += 25;
      moneyReward += 3;
      milestoneText = " (Meilenstein: 7 Tage in Folge!)";
    } else if (streak === 14) {
      bottlesReward += 20;
      xpReward += 60;
      moneyReward += 8;
      milestoneText = " (Meilenstein: 14 Tage in Folge!)";
    } else if (streak === 30) {
      bottlesReward += 50;
      xpReward += 200;
      moneyReward += 20;
      milestoneText = " (Meilenstein: 30 Tage in Folge – Hardcore!)";
    }

    player.bottles = (player.bottles || 0) + bottlesReward;
    player.totalBottles = (player.totalBottles || 0) + bottlesReward;
    player.xp = (player.xp || 0) + xpReward;
    player.mood = clamp((player.mood || 50) + moodReward, MOOD_MIN, MOOD_MAX);

    if (moneyReward > 0) {
      player.money = (player.money || 0) + moneyReward;
      player.totalMoneyEarned = (player.totalMoneyEarned || 0) + moneyReward;
    }

    spawnFloatingText(
      "Tagesbonus (Streak " + streak + "): +" +
        bottlesReward + "🍾 +" + xpReward + "XP" +
        (moneyReward > 0 ? " +" + moneyReward.toFixed(2) + "€" : ""),
      "#ffcf40"
    );
    pushMessage(
      "Du holst dir deinen Tagesbonus ab (Streak " + streak +
      "): " + bottlesReward + " Flaschen und " + xpReward + " XP" +
      (moneyReward > 0 ? " und " + moneyReward.toFixed(2) + " €." : ".") +
      milestoneText
    );

    applyPlayerToUI();
    updateDailyBonusUI();
    await savePlayer();
    refreshLeaderboard();
  });
}


window.addEventListener("load", () => {
  const lastName = localStorage.getItem("pennerdash_last_name");
  const lastPin = localStorage.getItem("pennerdash_last_pin");

  if (lastName) {
    nameInput.value = lastName;
  }
  if (lastPin) pinInput.value = lastPin;

  const hasAccount = !!lastName;
  if (hasAccount && registerBtn) {
    registerBtn.classList.add("hidden");
  }

  applyBackgroundForLocation();
  applySceneImage();
  updateInsideButton();
  initParallax();
});
if (clanSetBtn) {
  clanSetBtn.addEventListener("click", async () => {
    if (!player) return;
    let raw = clanInput ? clanInput.value.trim() : "";
    let clean = raw.replace(/[\[\]\s]/g, "").toUpperCase();
    if (!clean) {
      player.clan = null;
      pushMessage("Du hast keinen Clan mehr.");
    } else {
      player.clan = clean;
      pushMessage("Du bist jetzt im Clan [" + clean + "].");
    }
    applyPlayerToUI();
    await savePlayer();
    refreshLeaderboard();
  });
}


// Prevent zoom on canvas touch
const canvasElem = document.getElementById("gameCanvas");
if (canvasElem) {
    canvasElem.addEventListener("touchstart", (e) => {
        e.preventDefault();
    }, { passive: false });
}


// ==== Mobile zoom preventer (iOS double-tap & pinch) ====
// Completely block double-tap zoom and pinch zoom for the whole document.
(function() {
    let lastTouchEnd = 0;

    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // Prevent pinch zoom (2+ fingers)
    document.addEventListener('touchmove', function(event) {
        if (event.scale !== undefined && event.scale !== 1) {
            event.preventDefault();
        }
        if (event.touches && event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    // Also block dblclick zoom just in case
    document.addEventListener('dblclick', function(event) {
        event.preventDefault();
    }, { passive: false });
})();
