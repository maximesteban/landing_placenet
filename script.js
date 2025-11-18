// ===================================
// GLOBAL STATE
// ===================================
let currentSection = 0;
const totalSections = document.querySelectorAll('.section').length;
let isAnimating = false;

// ===================================
// INITIALIZE
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Setup event listeners
    setupNavigationListeners();
    setupRevealCards();
    setupInfoCards();
    setupUseCases();
    setupContinueButtons();

    // Show first section
    const firstSection = document.querySelector('.section:first-of-type');
    if (firstSection) {
        firstSection.classList.add('active');
        firstSection.style.opacity = '1';
    }

    // Initialize animations for first section with a small delay
    setTimeout(() => {
        animateApertura();
    }, 100);

    // Update progress bar
    updateProgressBar();
}

// ===================================
// SECTION NAVIGATION
// ===================================
function showSection(index) {
    if (isAnimating || index < 0 || index >= totalSections) return;

    isAnimating = true;
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');

    // Hide current section
    if (sections[currentSection]) {
        sections[currentSection].classList.remove('active');
        sections[currentSection].style.display = 'none';
    }

    // Update current section
    currentSection = index;

    // Show new section immediately
    sections[currentSection].style.display = 'flex';
    sections[currentSection].style.opacity = '1';
    sections[currentSection].classList.add('active');

    isAnimating = false;

    // Update navigation dots
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSection);
    });

    // Update progress bar
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((currentSection + 1) / totalSections) * 100;
    gsap.to('.progress-fill', {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out'
    });
}

function setupNavigationListeners() {
    // Navigation dots
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSection(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < totalSections - 1) {
                showSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                showSection(currentSection - 1);
            }
        }
    });

    // Touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - next section
                if (currentSection < totalSections - 1) {
                    showSection(currentSection + 1);
                }
            } else {
                // Swipe down - previous section
                if (currentSection > 0) {
                    showSection(currentSection - 1);
                }
            }
        }
    }
}

function setupContinueButtons() {
    const continueButtons = document.querySelectorAll('.continue-btn, .restart-btn');
    continueButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextSection = parseInt(btn.dataset.next);
            showSection(nextSection);
        });
    });

    // Primary CTA button
    const primaryCTA = document.querySelector('.primary-cta');
    if (primaryCTA) {
        primaryCTA.addEventListener('click', () => {
            alert('¡Gracias por tu interés! Esta sería la llamada a acción para contactar.');
        });
    }
}

// ===================================
// SECTION-SPECIFIC ANIMATIONS
// ===================================
function triggerSectionAnimation(sectionIndex) {
    switch(sectionIndex) {
        case 0:
            animateApertura();
            break;
        case 1:
            animateIntro();
            break;
        case 2:
            animatePlacenet();
            break;
        case 3:
            animateImpacto();
            break;
        case 4:
            animateCasos();
            break;
        case 5:
            animateCierre();
            break;
    }
}

// APERTURA Animation
function animateApertura() {
    // Animation disabled - content visible by default via CSS
}

// INTRO Animation
function animateIntro() {
    if (typeof gsap === 'undefined') return;

    const title = document.querySelector('.section-intro .section-title');
    const cards = document.querySelectorAll('.section-intro .reveal-card');

    // Animate only if elements exist
    if (title) {
        gsap.fromTo(title,
            { opacity: 1, y: 0 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
    }

    if (cards.length > 0) {
        gsap.fromTo(cards,
            { opacity: 1, y: 0 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                delay: 0.3,
                ease: 'power2.out'
            }
        );
    }
}

// PLACENET Animation
function animatePlacenet() {
    const logo = document.querySelector('.brand-logo');
    const largeText = document.querySelector('.section-placenet .large-text');
    const infoCards = document.querySelectorAll('.section-placenet .info-card');

    gsap.fromTo(logo,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
    );

    gsap.fromTo(largeText,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
    );

    gsap.fromTo(infoCards,
        { opacity: 0, x: -30 },
        {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.8,
            ease: 'power2.out'
        }
    );
}

// IMPACTO Animation
function animateImpacto() {
    const title = document.querySelector('.section-impacto .section-title');
    const subtitle = document.querySelector('.section-impacto .subtitle');
    const impactItems = document.querySelectorAll('.impact-item');

    gsap.fromTo(title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
    );

    gsap.fromTo(subtitle,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.3 }
    );

    gsap.fromTo(impactItems,
        { opacity: 0, y: 40, scale: 0.9 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.5,
            ease: 'back.out(1.2)'
        }
    );
}

// CASOS Animation
function animateCasos() {
    const title = document.querySelector('.section-casos .section-title');
    const subtitle = document.querySelector('.section-casos .subtitle');
    const useCaseCards = document.querySelectorAll('.use-case-card');

    gsap.fromTo(title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
    );

    gsap.fromTo(subtitle,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.3 }
    );

    gsap.fromTo(useCaseCards,
        { opacity: 0, y: 30, rotationY: -15 },
        {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out'
        }
    );
}

// CIERRE Animation
function animateCierre() {
    const title = document.querySelector('.section-cierre .section-title');
    const closingMessage = document.querySelector('.closing-message');
    const ctaContainer = document.querySelector('.cta-container');

    gsap.fromTo(title,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8 }
    );

    gsap.fromTo(closingMessage,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3 }
    );

    gsap.fromTo(ctaContainer,
        { opacity: 0, scale: 0.95 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.6,
            ease: 'back.out(1.2)'
        }
    );
}

// ===================================
// INTERACTIVE REVEAL CARDS (INTRO)
// ===================================
function setupRevealCards() {
    const revealCards = document.querySelectorAll('.reveal-card');

    revealCards.forEach(card => {
        const trigger = card.querySelector('.reveal-trigger');

        trigger.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            if (isActive) {
                // Close card
                card.classList.remove('active');
                gsap.to(card.querySelector('.reveal-content'), {
                    maxHeight: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            } else {
                // Close other cards
                revealCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('active')) {
                        otherCard.classList.remove('active');
                        gsap.to(otherCard.querySelector('.reveal-content'), {
                            maxHeight: 0,
                            duration: 0.4,
                            ease: 'power2.inOut'
                        });
                    }
                });

                // Open this card
                card.classList.add('active');
                const content = card.querySelector('.reveal-content');
                gsap.to(content, {
                    maxHeight: content.scrollHeight + 'px',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// ===================================
// INTERACTIVE INFO CARDS (PLACENET)
// ===================================
function setupInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');

    infoCards.forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            if (isActive) {
                // Close card
                card.classList.remove('active');
                gsap.to(card.querySelector('.card-body'), {
                    maxHeight: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            } else {
                // Close other cards
                infoCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('active')) {
                        otherCard.classList.remove('active');
                        gsap.to(otherCard.querySelector('.card-body'), {
                            maxHeight: 0,
                            duration: 0.4,
                            ease: 'power2.inOut'
                        });
                    }
                });

                // Open this card
                card.classList.add('active');
                const body = card.querySelector('.card-body');
                gsap.to(body, {
                    maxHeight: body.scrollHeight + 'px',
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Pulse animation on arrow
                gsap.fromTo(card.querySelector('.arrow'),
                    { scale: 1 },
                    { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
                );
            }
        });
    });
}

// ===================================
// USE CASE CARDS (CASOS)
// ===================================
function setupUseCases() {
    const useCaseCards = document.querySelectorAll('.use-case-card');

    useCaseCards.forEach(card => {
        const learnMoreBtn = card.querySelector('.learn-more');

        learnMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = card.classList.contains('expanded');

            if (isExpanded) {
                // Collapse
                card.classList.remove('expanded');
                learnMoreBtn.textContent = 'Ver más detalles';
                gsap.to(card.querySelector('.case-details'), {
                    maxHeight: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            } else {
                // Expand
                card.classList.add('expanded');
                learnMoreBtn.textContent = 'Ver menos';
                const details = card.querySelector('.case-details');
                gsap.to(details, {
                    maxHeight: details.scrollHeight + 'px',
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Add a nice scale animation
                gsap.fromTo(card,
                    { scale: 1 },
                    { scale: 1.02, duration: 0.3, yoyo: true, repeat: 1 }
                );
            }
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Add particle effect on hover (optional enhancement)
function addParticleEffect(element) {
    element.addEventListener('mouseenter', () => {
        // Create particle elements
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.background = 'var(--color-primary)';
            particle.style.pointerEvents = 'none';

            element.appendChild(particle);

            gsap.to(particle, {
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                opacity: 0,
                duration: 1,
                onComplete: () => particle.remove()
            });
        }
    });
}

// Smooth scroll to section (alternative navigation method)
function scrollToSection(index) {
    const sections = document.querySelectorAll('.section');
    if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
    }
}

// Log initialization
console.log('🎨 Placenet Presentation initialized');
console.log('✨ Total sections:', totalSections);
console.log('🚀 GSAP version:', gsap.version);
