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
const opportunities =
  typeof window !== "undefined" && window.opportunities ? window.opportunities : [];
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

const impactStatements = document.querySelectorAll(".impact__statement");
impactStatements.forEach((item, idx) => {
  item.addEventListener("click", () => item.classList.toggle("is-active"));
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

function setupSlider(containerSelector, itemSelector, prevSelector, nextSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const items = Array.from(container.querySelectorAll(itemSelector));
  const panel = container.closest(".impact__panel") || container.parentElement;
  const prevBtn = panel?.querySelector(prevSelector);
  const nextBtn = panel?.querySelector(nextSelector);
  if (!items.length || !prevBtn || !nextBtn) return;
  let index = 0;
  const maxIndex = items.length - 1;
  function render() {
    items.forEach((item, idx) => {
      const isActive = idx === index;
      item.classList.toggle("is-current", isActive);
      item.classList.toggle("is-active", isActive);
    });
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex;
  }
  prevBtn.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    render();
  });
  nextBtn.addEventListener("click", () => {
    index = Math.min(maxIndex, index + 1);
    render();
  });
  render();
}

setupSlider(".journey", ".journey__step", ".journey-prev", ".journey-next");
setupSlider(".dashboard", ".dashboard__metric", ".dashboard-prev", ".dashboard-next");



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
    logoImage: "assets/logos/rfea.svg",
    detail: "Circuito inteligente para fans y atletas con retos patrocinados.",
    highlight: "Eventos > Deporte",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Activamos dinámicas phygital en pista y gradas, con retos en vivo, recompensas y contenidos de marca sin pedir datos personales.",
    tags: ["Deporte", "Eventos", "App"],
    link: "#rfea",
  },
  {
    logoImage: "assets/logos/Bourgeois-Fincas.png",
    detail: "Retail experiencial con guías y picks personalizados.",
    highlight: "Administración de Fincas",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Contenidos de marcas, playlists y cross-sell inmediato según zona y afinidades, con Wi‑Fi prioritario y avisos en tienda.",
    tags: ["Comunidades", "Administracion de Fincas", "App"],
    link: "#bourgeois",
  },
  {
    logoImage: "assets/logos/Can-Felipa.svg",
    detail: "Centro cultural conectado con microlandings por sala.",
    highlight: "Centros Deportivos",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Programación contextual por salas, donaciones instantáneas y comunidad de visitantes con retos culturales y multimedia.",
    tags: ["Deporte", "Comunidad", "App"],
    link: "#canf",
  },
  {
    logoImage: "assets/logos/crec.png",
    detail: "Coworking que reconoce roles y activa servicios al llegar.",
    highlight: "Coworkings",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Check-in invisible, reservas de salas y lockers, avisos segmentados y networking sin exponer datos personales.",
    tags: ["App", "Comunidad", "Networking"],
    link: "#crec",
  },
  {
    logoImage: "assets/logos/rfea.svg",
    detail: "Fan engagement itinerante con contenidos geolocalizados.",
    highlight: "Eventos > Deporte",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Cada etapa desbloquea retos, contenidos premium y perks de patrocinadores; mapas anónimos de afluencia en tiempo real.",
    tags: ["Eventos", "WebApp", "Operativa"],
    link: "#tdf",
  },
  {
    logoImage: "assets/logos/rfea.svg",
    detail: "Evento con journeys digitales por rol y patrocinador.",
    highlight: "Universidades",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Micrositios de marca, dinámicas de stand, colas inteligentes y lead capture sin datos personales.",
    tags: ["Universidades", "Comunidad", "App"],
    link: "#ies",
  },
  {
    logoImage: "assets/logos/rfea.svg",
    detail: "Experiencias fitness con retos y recompensas inmediatas.",
    highlight: "Deporte",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Check-in automático, playlists dinámicas, challenges patrocinados y kioskos de recompensas in situ.",
    tags: ["Deporte", "App"],
    link: "#inshape",
  },
  {
    logoImage: "assets/logos/rfea.svg",
    detail: "Zona fan con misiones, drops y contenidos exclusivos.",
    highlight: "Eventos > Deporte",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Misiones phygital por zona, drops coleccionables, streaming y analítica anónima de movimiento.",
    tags: ["Eventos", "WebApp", "Operativa"],
    link: "#f1",
  },
  {
    detail: "Explora otros despliegues y verticales que ya activamos.",
    highlight: "Ver más casos",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Conectamos comunidades en retail, educación, smart cities y más. Descubre el resto del universo Placenet.",
    tags: ["Retail", "Eventos", "Smart venues"],
    link: "https://placenet.ai",
  },
];

const caseTrack = document.getElementById("caseTrack");
const caseModal = document.getElementById("caseModal");
const caseModalTitle = document.getElementById("caseModalTitle");
const caseModalDescription = document.getElementById("caseModalDescription");
const caseModalTags = document.getElementById("caseModalTags");
const caseModalLink = document.getElementById("caseModalLink");
const caseModalMedia = document.getElementById("caseModalMedia");
const caseModalClose = document.querySelector(".case-modal__close");

function populateCases() {
  if (!caseTrack) return;
  caseTrack.innerHTML = "";
  cases.forEach((cs, idx) => {
    const card = document.createElement("article");
    const isMore = cs.highlight === "Ver más casos";
    card.className = isMore ? "case-card case-card--more" : "case-card";
    card.setAttribute("role", "listitem");
    card.dataset.index = String(idx);
    const logoMarkup = cs.logoImage
      ? `<div class="case-card__logo"><img src="${cs.logoImage}" alt="${cs.logo}" /></div>`
      : `<div class="case-card__logo">${cs.logo}</div>`;
    const bodyMarkup = isMore
      ? `<p>${cs.detail}</p><button class="primary case-card__cta">Ver más casos</button>`
      : `<p>${cs.detail}</p><span class="eyebrow">${cs.highlight}</span>`;
    card.innerHTML = `${logoMarkup}${bodyMarkup}`;
    if (isMore) {
      const cta = card.querySelector(".case-card__cta");
      cta?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (cs.link) window.open(cs.link, "_blank", "noopener");
      });
    } else {
      card.addEventListener("click", () => openCaseModal(cs));
    }
    caseTrack.appendChild(card);
  });
}

function openCaseModal(cs) {
  if (!caseModal) return;
  caseModalTitle.textContent = cs.logo;
  caseModalDescription.textContent = cs.description || cs.detail;
  caseModalTags.innerHTML = "";
  (cs.tags || []).forEach((tag) => {
    const span = document.createElement("span");
    span.className = "case-modal__tag";
    span.textContent = tag;
    caseModalTags.appendChild(span);
  });
  if (caseModalLink) {
    caseModalLink.href = cs.link || "#";
    caseModalLink.textContent = "Leer más";
  }
  if (caseModalMedia) {
    caseModalMedia.textContent = "";
    caseModalMedia.style.backgroundImage = cs.modalMedia ? `url(${cs.modalMedia})` : "none";
  }
  caseModal.hidden = false;
}

function closeCaseModal() {
  if (caseModal) {
    caseModal.hidden = true;
  }
}

caseModalClose?.addEventListener("click", closeCaseModal);
caseModal?.addEventListener("click", (event) => {
  if (event.target === caseModal || event.target.classList.contains("case-modal__backdrop")) {
    closeCaseModal();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCaseModal();
  }
});
populateCases();

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
