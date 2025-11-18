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
promptCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-active");
  });
});

const layerData = {
  contenido: [
    {
      title: "Menús y catálogos dinámicos",
      detail: "Cada entrada entrega lo relevante del lugar.",
    },
    {
      title: "Historias del espacio",
      detail: "Relatos inmersivos según la zona en la que estás.",
    },
  ],
  personas: [
    {
      title: "Quien está aquí ahora",
      detail: "Conecta con perfiles afines sin exponer datos.",
    },
    {
      title: "Comunidades vivas",
      detail: "Activa grupos temporales según intereses.",
    },
  ],
  servicios: [
    {
      title: "Servicios on demand",
      detail: "Reserva, pide o recibe asistencia desde tu móvil.",
    },
    {
      title: "Rutinas guiadas",
      detail: "El espacio te acompaña durante todo tu journey.",
    },
  ],
  comunicaciones: [
    {
      title: "Alertas y señales contextuales",
      detail: "Notificaciones que solo aparecen si son relevantes.",
    },
    {
      title: "Conversaciones bidireccionales",
      detail: "Los lugares también responden.",
    },
  ],
};

const layerTabs = document.querySelectorAll(".layer-tab");
const mapNodes = document.getElementById("mapNodes");

function renderLayer(layer) {
  if (!mapNodes) return;
  mapNodes.innerHTML = "";
  layerData[layer].forEach((item) => {
    const li = document.createElement("li");
    li.className = "map__node";
    li.innerHTML = `<strong>${item.title}</strong><span>${item.detail}</span>`;
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

const opportunityTrack = document.getElementById("opportunityTrack");
const opportunities = [
  {
    title: "Sponsors",
    detail: "Impactos hipercontextuales sin saturar al visitante.",
  },
  {
    title: "Engagement",
    detail: "Retos, recompensas y dinámicas que nacen del lugar.",
  },
  {
    title: "Experiencias phygital",
    detail: "Loops físicos + digitales sincronizados.",
  },
  {
    title: "Insights",
    detail: "Movimiento y comportamiento sin datos personales.",
  },
  {
    title: "Conexiones",
    detail: "Redes entre visitantes y con el espacio.",
  },
];

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
