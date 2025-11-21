const bootMessages = [
  "Accediendo a tu ubicación…",
  "Comprobación de indentidad en curso...",
  "Listo. Sexto sentido activado.",
];

const bootLog = document.querySelector(".boot__log");
const holdButton = document.getElementById("activateSense");
const skipButton = document.getElementById("skipBoot");
const audioToggle = document.getElementById("audioToggle");
const storySteps = Array.from(document.querySelectorAll(".story-step"));
const nextSceneButtons = document.querySelectorAll(".next-scene");
const prevSceneButtons = document.querySelectorAll(".prev-scene");
let logIndex = 0;
let holdTimer;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);
let reduceMotion = prefersReducedMotion.matches;
let currentSceneIndex = -1;

prefersReducedMotion.addEventListener("change", (event) => {
  reduceMotion = event.matches;
});

function addBootMessage() {
  if (!bootLog || logIndex >= bootMessages.length) return false;
  const message = bootMessages[logIndex];
  const li = document.createElement("li");
  li.textContent = message;
  bootLog.appendChild(li);
  bootLog.scrollTop = bootLog.scrollHeight;
  logIndex += 1;
  return logIndex < bootMessages.length;
}

const bootInterval = setInterval(() => {
  const hasMorePending = addBootMessage();
  if (document.body.classList.contains("boot-complete") || !hasMorePending) {
    clearInterval(bootInterval);
  }
}, 1700);

function setActiveScene(index) {
  if (!storySteps.length) return;
  const safeIndex = Math.max(0, Math.min(index, storySteps.length - 1));
  storySteps.forEach((section, idx) => {
    const isActive = idx === safeIndex;
    section.classList.toggle("is-active", isActive);
    if (isActive) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  currentSceneIndex = safeIndex;
  updateNavControls();
}

function completeBoot() {
  if (document.body.classList.contains("boot-complete")) return;
  document.body.classList.add("boot-complete", "story-started");
  holdButton?.setAttribute("aria-pressed", "true");
  setActiveScene(0);
}

function startHold(event) {
  event.preventDefault();
  if (document.body.classList.contains("boot-complete")) return;
  holdButton.classList.add("is-holding");
  holdTimer = setTimeout(() => {
    completeBoot();
  }, 2000);
}

function cancelHold(event) {
  event.preventDefault();
  holdButton.classList.remove("is-holding");
  clearTimeout(holdTimer);
}

holdButton?.addEventListener("pointerdown", startHold);
holdButton?.addEventListener("pointerup", cancelHold);
holdButton?.addEventListener("pointerleave", cancelHold);
holdButton?.addEventListener("keydown", (event) => {
  if (event.code === "Enter" || event.code === "Space") {
    startHold(event);
  }
});
holdButton?.addEventListener("keyup", cancelHold);

skipButton?.addEventListener("click", completeBoot);

audioToggle?.addEventListener("click", () => {
  const pressed = audioToggle.getAttribute("aria-pressed") === "true";
  audioToggle.setAttribute("aria-pressed", String(!pressed));
  audioToggle.textContent = pressed ? "Activar audio ambiente" : "Audio silenciado";
});



const promptCards = document.querySelectorAll(".prompt-card");
const greetNote = document.getElementById("greetNote");
const placeNote = document.getElementById("placeNote");
const portalOverlay = document.getElementById("portalOverlay");
const greetNames = ["Alex", "Camila", "Luis", "Eva", "Kai", "Riley"];
const placeNames = ["Placenet", "PulseFest", "Distrito Vivo", "Arena 360", "Roots Retail", "Tu Espacio"];
const entryPhrases = [
  "Tu entrada digital está lista.",
  "Tu check-in se completó solo.",
  "Ya activamos tu pase VIP.",
  "Tienes Wi‑Fi prioritario habilitado.",
  "Tu guía personalizada te espera.",
  "Reservamos tu asiento favorito.",
  "Asignamos tu locker seguro.",
  "Tu bebida de siempre va en camino.",
  "Configuramos la sala según tu mood.",
  "Tus accesos y credenciales están listos.",
  "Tu playlist se sincronizó con el ambiente.",
  "Tu asistente ya tiene tu agenda de hoy."
];
let greetTimeout;
let placeTimeout;
let portalTimeout;
let greetIndex = 0;
let placeIndex = 0;
let entryIndex = 0;

function showGreet() {
  if (!greetNote) return;
  clearTimeout(greetTimeout);
  const name = greetNames[greetIndex];
  greetIndex = (greetIndex + 1) % greetNames.length;
  const nameTarget = greetNote.querySelector(".memory__name");
  if (nameTarget) {
    nameTarget.textContent = name;
  }
  greetNote.classList.add("is-visible");
  greetTimeout = setTimeout(() => greetNote.classList.remove("is-visible"), 2800);
}

function showWelcome() {
  if (!placeNote) return;
  clearTimeout(placeTimeout);
  const place = placeNames[placeIndex];
  placeIndex = (placeIndex + 1) % placeNames.length;
  const entry = entryPhrases[entryIndex];
  entryIndex = (entryIndex + 1) % entryPhrases.length;
  const placeTarget = placeNote.querySelector(".memory__place");
  const entryTarget = placeNote.querySelector(".memory__entry");
  if (placeTarget) {
    placeTarget.textContent = place;
  }
  if (entryTarget) {
    entryTarget.textContent = entry;
  }
  placeNote.classList.add("is-visible");
  placeTimeout = setTimeout(() => placeNote.classList.remove("is-visible"), 3200);
}

function triggerPortal() {
  if (reduceMotion) {
    setActiveScene(currentSceneIndex + 1);
    return;
  }
  if (!portalOverlay) {
    setActiveScene(currentSceneIndex + 1);
    return;
  }
  clearTimeout(portalTimeout);
  portalOverlay.classList.add("is-active");
  portalOverlay.setAttribute("aria-hidden", "false");
  portalTimeout = setTimeout(() => {
    portalOverlay.classList.remove("is-active");
    portalOverlay.setAttribute("aria-hidden", "true");
    setActiveScene(currentSceneIndex + 1);
  }, 750);
}

promptCards.forEach((card) => {
  card.addEventListener("click", () => {
    const action = card.dataset.action;
    card.classList.add("is-active");
    if (action === "greet") {
      showGreet();
    } else if (action === "welcome") {
      showWelcome();
    } else if (action === "portal") {
      triggerPortal();
    }
  });
});

const layerData = {
  contenido: [
    "Información en tiempo real",
    "Micrositios y landings contextuales",
    "Contenido web",
    "Multimedia y streaming",
    "Historias, playlists, podcasts, etc.",
    "+ todo lo que te imagines",
  ],
  personas: [
    "Smart-Networking",
    "Chats sin datos personales",
    "Comunidades vivas y por intereses",
    "Contacto guiado",
    "Socialización y dinamización por roles",
    "+ todo lo que te imagines",
  ],
  servicios: [
    "Reservas de espacios",
    "Turnos, colas virtuales y check-in",
    "Soporte y asistencia en sitio desde el móvil",
    "Recordatorios de servicios",
    "Concierge digital y experiencias",
    "+ todo lo que te imagines",
  ],
  comunicaciones: [
    "Avisos contextuales según ubicación",
    "Alertas en tiempo real",
    "Notificaciones prsonalizadas",
    "Mensajes segmentados",
    "Panel de alertas y comunicaciones",
    "+ todo lo que te imagines",
  ],
  funcionalidades: [
    "Control horario",
    "Pasarelas de pago integradas",
    "Asistentes IA",
    "Apertura y control remoto de puertas",
    "Automatizaciones y workflows conectados",
    "+ todo lo que te imagines",
  ],
};

const layerTabs = document.querySelectorAll(".layer-tab");
const mapNodes = document.getElementById("mapNodes");

function renderLayer(layer) {
  if (!mapNodes) return;
  mapNodes.innerHTML = "";
  layerData[layer].forEach((tag) => {
    const li = document.createElement("li");
    li.className = "map__pill";
    li.textContent = tag;
    mapNodes.appendChild(li);
  });
}

layerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    layerTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderLayer(tab.dataset.layer);
  });
});

renderLayer("contenido");

nextSceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    if (targetId) {
      const targetIndex = storySteps.findIndex((section) => section.id === targetId);
      if (targetIndex !== -1) {
        setActiveScene(targetIndex);
      }
    } else {
      setActiveScene(currentSceneIndex + 1);
    }
  });
});

prevSceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    if (targetId) {
      const targetIndex = storySteps.findIndex((section) => section.id === targetId);
      if (targetIndex !== -1) {
        setActiveScene(targetIndex);
      }
    } else {
      setActiveScene(currentSceneIndex - 1);
    }
  });
});

function updateNavControls() {
  storySteps.forEach((section, idx) => {
    const prev = section.querySelector(".prev-scene");
    if (prev) {
      prev.disabled = idx === 0;
    }
    const next = section.querySelector(".next-scene");
    if (next) {
      next.disabled = idx === storySteps.length - 1;
    }
  });
}

updateNavControls();



if (opportunityTrack) {
  [...opportunities, ...opportunities].forEach((op) => {
    const card = document.createElement("article");
    card.className = "op-card";
    card.innerHTML = `<h4>${op.title}</h4><p>${op.detail}</p>`;
    opportunityTrack.appendChild(card);
  });

  let offset = 0;
  function animateCarousel() {
    if (reduceMotion) {
      opportunityTrack.style.transform = "none";
      return;
    }
    offset -= 0.3;
    opportunityTrack.style.transform = `translateX(${offset}px)`;
    if (Math.abs(offset) > opportunityTrack.scrollWidth / 2) {
      offset = 0;
    }
    requestAnimationFrame(animateCarousel);
  }
  animateCarousel();
}

const cases = [
  {
    logo: "PulseFest",
    detail: "Festival donde cada zona desbloquea contenidos exclusivos.",
    highlight: "Activación por proximidad",
  },
  {
    logo: "Distrito Vivo",
    detail: "Barrio corporativo con comunidad digital y servicios guiados.",
    highlight: "Servicios contextualizados",
  },
  {
    logo: "Arena 360",
    detail: "Eventos deportivos con experiencias phygital para fans.",
    highlight: "Gamificación in situ",
  },
  {
    logo: "Roots Retail",
    detail: "Tiendas conectadas que reconocen al visitante y personalizan.",
    highlight: "Retail inteligente",
  },
];

const caseGrid = document.getElementById("caseGrid");
if (caseGrid) {
  cases.forEach((cs) => {
    const card = document.createElement("article");
    card.className = "case-card";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="case-card__logo">${cs.logo}</div>
      <p>${cs.detail}</p>
      <span class="eyebrow">${cs.highlight}</span>
      <div class="case-card__media" aria-hidden="true"></div>
    `;
    caseGrid.appendChild(card);
  });
}

const form = document.querySelector(".co-create-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = document.getElementById("goalInput").value.trim();
    const transformation = document.getElementById("transformationSelect").value;
    alert(
      `Gracias por compartir tu visión. Exploraremos cómo ${goal || "esa idea"} puede transformarse en ${transformation}.`
    );
  });
}
