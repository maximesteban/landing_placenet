const bootMessages = [
  "Preparando sensores contextuales…",
  "Accediendo a tu ubicación…",
  "Comprobación de identidad en curso...",
  "Listo. Sexto sentido activado.",
];

const bootLog = document.querySelector(".boot__log");
const bootLogText = document.querySelector(".boot__log-text");
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
let typewriterTimeout;
let bootIntervalId;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);
let reduceMotion = prefersReducedMotion.matches;
let currentSceneIndex = -1;

prefersReducedMotion.addEventListener("change", (event) => {
  reduceMotion = event.matches;
});

function typewriterEffect(text, element, onComplete) {
  if (!element) return;

  // Limpiar el contenido actual
  element.textContent = "";

  // Si el usuario prefiere reducir el movimiento, mostrar el texto completo
  if (reduceMotion) {
    element.textContent = text;
    if (onComplete) onComplete();
    return;
  }

  let charIndex = 0;

  function typeNextChar() {
    if (charIndex < text.length) {
      element.textContent += text[charIndex];
      charIndex++;
      // Velocidad de escritura variable para efecto más realista (30-70ms)
      const delay = Math.random() * 40 + 30;
      typewriterTimeout = setTimeout(typeNextChar, delay);
    } else {
      if (onComplete) onComplete();
    }
  }

  typeNextChar();
}

function addBootMessage() {
  if (!bootLogText || logIndex >= bootMessages.length) return false;

  const message = bootMessages[logIndex];

  typewriterEffect(message, bootLogText, () => {
    logIndex += 1;

    // Si hay más mensajes, esperar un momento antes de mostrar el siguiente
    if (logIndex < bootMessages.length) {
      bootIntervalId = setTimeout(addBootMessage, 800);
    }
  });

  return logIndex < bootMessages.length;
}

// Iniciar el primer mensaje
if (bootLogText) {
  addBootMessage();
}

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

  // Limpiar todos los timeouts del typewriter y boot
  clearTimeout(typewriterTimeout);
  clearTimeout(bootIntervalId);

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
// Prevenir menú contextual en móvil
holdButton?.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

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
    detail: "Aplicación oficial de los Campeonatos de España de Atletismo.",
    highlight: "Eventos > Deporte",
    modalMedia: "assets/gifs/rfea.gif",
    description:
      "App nativa para los Campeonatos de España de Atletismo. Se transforma según la ciudad y campeonato, proporcionando información contextualizada que la RFEA define para cada evento. Integra un chatbot asistente que acompaña a los visitantes en las ciudades sede. Incluye funcionalidades de dinamización del público en tiempo real. Interacción mediante chat, popups y notificaciones geolocalizadas en los dominios de pista.",
    tags: ["Deporte", "Eventos", "App", "Chatbot"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/Bourgeois-Fincas.png",
    detail: "Aplicación de gestión y comunicación para propiedades y comunidades.",
    highlight: "Admin. de Fincas",
    modalMedia: "assets/gifs/bourgeois.gif",
    description:
      "App nativa para administrados y trabajadores que ofrece una experiencia contextual según la ubicación del usuario (dentro o fuera de la finca) y su perfil (trabajador o cliente). Centraliza todas las necesidades operativas y de comunicación mediante integraciones completas con herramientas de comunicación, sistemas internos propietarios, CMS, PMS, control horario digital y chatbots inteligentes. Una solución integral que mejora tanto la gestión como la experiencia del residente.",
    tags: ["Comunidades", "Administración de Fincas", "App", "Chatbot"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/can_felipa.png",
    detail: "Aplicación nativa con IA para acompañamiento y creación de comunidad.",
    highlight: "Centros Deportivos",
    modalMedia: "assets/gifs/canfelipa.png",
    description:
      "App nativa para la comunidad del gimnasio Can Felipa. Centrada en el acompañamiento contextual mediante IA. Asistente inteligente que proporciona información relevante en cada momento. Mejora los servicios del centro con recomendaciones personalizadas. Se adapta al contexto y necesidades de cada usuario. Transforma la experiencia deportiva en algo único.",
    tags: ["Deporte", "Comunidad", "App", "IA"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/crec.png",
    detail: "Todo en una app: servicios, networking contextual y chat sin datos personales.",
    highlight: "Coworkings",
    modalMedia: "assets/gifs/crec.jpg",
    description:
      "App nativa que centraliza todos los servicios y herramientas digitales de CREC en una única plataforma. Sustituye múltiples aplicaciones dispersas por una solución completa que optimiza la operativa de los administradores y eleva la experiencia de los usuarios. Integra funcionalidades de networking contextualizado por ubicación y necesidades, con chat privado sin intercambio de datos personales y muro comunitario, creando una comunidad digital real y conectada.",
    tags: ["App", "Comunidad", "Networking"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/bcn.png",
    detail: "Coordinación operativa del Tour de France: señalización y balizaje.",
    highlight: "Eventos > Deporte",
    modalMedia: "assets/gifs/tdf.jpg",
    description:
      "Web app a medida desarrollada con tecnología Placenet para IBE Barcelona. Diseñada para planificar y organizar las etapas del Tour de France en Barcelona. Coordina todos los aspectos operativos de señalización y balizaje. Herramienta especializada para la gestión logística. Optimiza la operativa de uno de los eventos deportivos más importantes del mundo.",
    tags: ["Eventos", "WebApp", "Operativa"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/ies.png",
    detail: "Ecosistema educativo completo: comunidad, administración y seguridad.",
    highlight: "Educación",
    modalMedia: "assets/gifs/ies.gif",
    description:
      "App nativa que transforma la presencia digital de centros educativos. Evoluciona de una aplicación estática sin interacción a un ecosistema completo dotado de funcionalidades de comunidad (muro social y chat), integración total con los procesos administrativos del centro y módulos avanzados de seguridad. Una solución integral que resulta verdaderamente útil para los estudiantes, al tiempo que potencia el control y la gestión eficiente por parte de la institución educativa.",
    tags: ["Educación", "Comunidad", "App", "Seguridad"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/inshape.png",
    detail: "Reservas de tenis + comunidad digital viva en una sola webapp multisede.",
    highlight: "Deporte",
    modalMedia: "assets/gifs/inshape.png",
    description:
      "App integrada con la plataforma de un partner húngaro que colabora con la Federación Húngara de Tenis y clubes deportivos. Transforma un portal de reservas tradicional y estático en una comunidad digital viva y dinámica. Los usuarios pueden reservar y gestionar pistas en todos los centros adheridos, acceder a funcionalidades digitales contextualizadas cuando se encuentran en las instalaciones, y participar en la capa de comunidad de Placenet. Todo unificado en una única web app multisede.",
    tags: ["Deporte", "WebApp", "Comunidad"],
    link: "https://placenet.app",
  },
  {
    logoImage: "assets/logos/f1.svg",
    detail: "Colas virtuales inteligentes que eliminan esperas físicas en eventos.",
    highlight: "Eventos",
    modalMedia: "assets/gifs/f1.jpg",
    description:
      "Integración de tecnología Placenet en una web app de gestión de colas digitales para la Fan Zone del Gran Premio de F1 en Barcelona. Optimiza el flujo de asistentes mediante un sistema de colas virtuales contextualizadas que se activan únicamente cuando el usuario se encuentra en el lugar. Permite gestionar la espera en activaciones de forma virtual mientras los visitantes continúan disfrutando del evento, eliminando las esperas físicas y mejorando significativamente la experiencia del fan.",
    tags: ["Eventos", "WebApp", "Operativa"],
    link: "https://placenet.app",
  },
  {
     logoImage: "assets/img/marca white.png",
    detail: "Y muchos más...",
    highlight: "Ver casos",
    modalMedia: "assets/gifs/memories.gif",
    description:
      "Conectamos comunidades en retail, educación, smart cities y más. Descubre el resto del universo Placenet.",
    tags: ["Retail", "Eventos", "Smart venues"],
    link: "https://placenet.app",
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
    const isMore = cs.highlight === "Ver casos";
    card.className = isMore ? "case-card case-card--more" : "case-card";
    card.setAttribute("role", "listitem");
    card.dataset.index = String(idx);
    const logoClass = cs.logoImage && cs.logoImage.includes("crec.png") ? 'class="logo-white"' : '';
    const logoMarkup = cs.logoImage
      ? `<div class="case-card__logo"><img src="${cs.logoImage}" ${logoClass} alt="${cs.logo}" /></div>`
      : `<div class="case-card__logo">${cs.logo}</div>`;
    const bodyMarkup = isMore
      ? `<p>${cs.detail}</p><button class="primary case-card__cta">Ver más</button>`
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

  // Estructura el texto de descripción
  if (cs.description) {
    const description = cs.description;
    // Divide el texto en oraciones por punto
    const sentences = description.split('. ').filter(s => s.trim());

    if (sentences.length > 2) {
      // Si hay más de 2 oraciones, crea una lista
      const intro = sentences[0] + '.';
      const bullets = sentences.slice(1);

      caseModalDescription.innerHTML = `
        <p>${intro}</p>
        <ul>
          ${bullets.map(bullet => `<li>${bullet}${bullet.endsWith('.') ? '' : '.'}</li>`).join('')}
        </ul>
      `;
    } else {
      // Si son pocas oraciones, muestra como párrafo normal
      caseModalDescription.innerHTML = `<p>${description}</p>`;
    }
  } else {
    caseModalDescription.innerHTML = `<p>${cs.detail}</p>`;
  }

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
    caseModalMedia.innerHTML = "";
    if (cs.modalMedia) {
      const img = document.createElement("img");
      img.src = cs.modalMedia;
      img.alt = cs.logo || "Caso multimedia";

      // Detecta si es GIF o foto
      const isGif = cs.modalMedia.toLowerCase().endsWith('.gif');
      if (!isGif) {
        img.classList.add('photo');
      }

      caseModalMedia.appendChild(img);
    }
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

// FLOATING NAVIGATION - TEMPORAL
const floatingNav = document.getElementById("floatingNav");
const floatingNavToggle = document.getElementById("floatingNavToggle");
const floatingNavLinks = document.querySelectorAll(".floating-nav__list a");

if (floatingNavToggle) {
  floatingNavToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    floatingNav.classList.toggle("is-open");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!floatingNav.contains(e.target)) {
      floatingNav.classList.remove("is-open");
    }
  });

  // Handle navigation clicks
  floatingNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionIndex = parseInt(link.dataset.section);

      // Update active state
      floatingNavLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");

      // Navigate to section
      if (sectionIndex === 0) {
        // Go back to boot screen
        document.body.classList.remove("boot-complete", "story-started");
        storySteps.forEach((section) => section.classList.remove("is-active"));
        currentSceneIndex = -1;
        document.getElementById("acto-inicial").scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to story step
        if (!document.body.classList.contains("boot-complete")) {
          completeBoot();
        }
        setActiveScene(sectionIndex - 1);
      }

      // Close nav
      floatingNav.classList.remove("is-open");
    });
  });
}
