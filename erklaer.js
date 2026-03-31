/* ══════════════════════════════════════════════
   zZzlim® Erklär-Landingpage – JavaScript
   ══════════════════════════════════════════════ */

// Always start from top on page load / refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
// Some browsers need a delayed scroll-to-top after layout
window.addEventListener('beforeunload', () => { window.scrollTo(0, 0); });
document.addEventListener('DOMContentLoaded', () => { window.scrollTo(0, 0); });
window.addEventListener('load', () => { window.scrollTo(0, 0); });

// Lock scroll during loading animation
document.documentElement.classList.add('is-loading');

document.addEventListener('DOMContentLoaded', () => {
    // Start loading animation first
    initLoadingScreen(() => {
        // After loading completes, init everything
        initSectionReveals();
        initSlideshowScroll();
        initScrollReveals();
        initMobileMenu();
        initActiveNav();
        initCheckboxes();
        initExpandableCards();
        initTabs();
        initProduktTabs();
        initRoutineTimeline();
        initTestimonials();
        initFAQ();
        initVideoLazyLoad();
        initStickyMobileCTA();
        initCloserParticles();
        initBackToTop();
        initProductPopup();
        initScrollProgress();
        initChatGPTButton();
        initFloatingDustEffect();
        initBlobDriftEffect();
        initScrollIndicator();
        initVideoOverlay();

        // Hero reveal on load
        requestAnimationFrame(() => {
            document.querySelectorAll('.hero-reveal').forEach(el => el.classList.add('visible'));
        });
    });
});

/* ── Loading Screen ── */
function initLoadingScreen(onComplete) {
    const screen = document.getElementById('loading-screen');
    const video = document.getElementById('loading-video');

    if (!screen || !video || getComputedStyle(screen).display === 'none') {
        document.documentElement.classList.remove('is-loading');
        onComplete();
        return;
    }

    // Play video
    video.play().catch(() => {
        // Autoplay blocked — skip loading screen
        screen.remove();
        document.documentElement.classList.remove('is-loading');
        onComplete();
    });

    video.addEventListener('ended', () => {
        // Fade out the loading screen
        screen.classList.add('fade-out');
        screen.addEventListener('transitionend', () => {
            screen.remove();
            document.documentElement.classList.remove('is-loading');
            onComplete();
        }, { once: true });
    }, { once: true });
}

/* ─── Slideshow Scroll (Snap with smooth transition + cooldown + sub-steps) ─── */
function initSlideshowScroll() {
    // Filter out hidden sections (e.g. mobile-only sections on desktop, desktop-only on mobile)
    const sections = Array.from(document.querySelectorAll('main > section')).filter(s => s.offsetHeight > 0);
    if (!sections.length) return;

    const isMobileOrTablet = window.innerWidth <= 1024;

    // Mobile/Tablet: no scroll snap — use native scrolling with IntersectionObserver for reveals
    if (isMobileOrTablet) {
        initMobileNativeScroll(sections);
        return;
    }

    let currentIndex = 0;
    let isAnimating = false;
    const cooldown = 500;
    const duration = 1000;

    // Sub-step tracking per section
    const subStepState = {};
    sections.forEach((sec, i) => {
        const total = parseInt(sec.dataset.substeps, 10);
        if (total > 0) {
            subStepState[i] = { current: 0, total: total };
        }
    });

    // Apply sub-step visuals for a section
    function applySubStep(sectionIndex, step) {
        const sec = sections[sectionIndex];

        // --- Type A: Symptom tiles (Section 2) ---
        const tiles = sec.querySelectorAll('.symptom-tile');
        if (tiles.length) {
            const dots = sec.querySelectorAll('.symptom-dot');
            const state = subStepState[sectionIndex];
            const isClosing = step >= state.total;
            const closingOverlay = sec.querySelector('.selbstcheck-closing');

            tiles.forEach((tile, ti) => {
                const tileStep = ti + 1;
                tile.classList.remove('active', 'seen');
                if (!isClosing) {
                    if (tileStep === step) tile.classList.add('active');
                    else if (tileStep < step) tile.classList.add('seen');
                }
            });

            dots.forEach((dot, di) => {
                dot.style.background = (di + 1 <= Math.min(step, 4)) ? '#861330' : '#e5e5e5';
            });

            // Step 5: fade everything, show centered closing text
            sec.classList.toggle('symptom-complete', isClosing);
            if (closingOverlay) closingOverlay.classList.toggle('visible', isClosing);
            return;
        }

        // --- Type B: Card stack (Section 3) ---
        const cards = sec.querySelectorAll('.stack-card');
        if (cards.length) {
            const stackDots = sec.querySelectorAll('.stack-step-dot');
            const activeIndex = step - 1; // step 1 = card index 0

            cards.forEach((card, ci) => {
                card.classList.remove('dismissed');
                if (ci < activeIndex) {
                    // Already flipped away
                    card.classList.add('dismissed');
                    card.removeAttribute('data-stack');
                } else {
                    // Position in remaining stack
                    const stackPos = ci - activeIndex;
                    card.setAttribute('data-stack', Math.min(stackPos, 3));
                }
            });

            stackDots.forEach((dot, di) => {
                dot.classList.toggle('active', di === activeIndex);
            });
            return;
        }

        // --- Type C: Story scroll cards (Section 5) ---
        // Steps 1-4: cards, step 5: closing
        const storyCards = sec.querySelectorAll('.story-card');
        if (storyCards.length) {
            const state = subStepState[sectionIndex];
            const closingEl = sec.querySelector('.story-closing');
            const thread = sec.querySelector('.story-thread');
            const threadFill = sec.querySelector('.story-thread-fill');
            const isClosingStep = step >= state.total;
            const cardStep = Math.min(step, storyCards.length);

            // Thread: visible from step 2, hidden at closing
            if (thread) {
                thread.style.display = (step >= 2 && !isClosingStep) ? 'block' : '';
                thread.classList.toggle('hidden', isClosingStep);
            }

            storyCards.forEach((card, ci) => {
                card.classList.remove('active', 'seen');
                if (isClosingStep) {
                    card.classList.add('seen'); // all cards slide up at closing
                } else if (ci < cardStep - 1) {
                    card.classList.add('seen');
                } else if (ci === cardStep - 1) {
                    card.classList.add('active');
                }
            });

            if (threadFill) {
                threadFill.style.height = (cardStep / storyCards.length * 100) + '%';
            }

            if (closingEl) closingEl.classList.toggle('visible', isClosingStep);
            sec.classList.toggle('story-complete', isClosingStep);
            return;
        }

        // --- Type D: Pillar carousel (Wirkung section) ---
        // Steps 1-3: reveal pillars one at a time, Step 4: overlay
        const pillarSlides = sec.querySelectorAll('.pillar-slide');
        if (pillarSlides.length) {
            const overlay = sec.querySelector('.pillar-overlay');
            const mobile = window.innerWidth <= 768;

            pillarSlides.forEach((slide, si) => {
                slide.classList.remove('active', 'peek');
                if (mobile) {
                    // Mobile: steps 1-3 show one card at a time, step 4 overlay
                    if (step <= 3) {
                        if (si === step - 1) slide.classList.add('active');
                    }
                } else {
                    // Desktop: accumulate slides + peek
                    if (step >= 4 || si < step) {
                        slide.classList.add('active');
                    } else if (si === step && step <= 2) {
                        slide.classList.add('peek');
                    }
                }
            });

            if (overlay) overlay.classList.toggle('visible', step >= 4);
            return;
        }
    }

    // Initialize first sub-step when entering a section
    function enterSection(index) {
        if (subStepState[index] && subStepState[index].current === 0) {
            subStepState[index].current = 1;
            applySubStep(index, 1);
        }
    }

    // Smooth scroll with custom duration
    function smoothScrollTo(targetY, dur) {
        const startY = window.scrollY;
        const diff = targetY - startY;
        if (Math.abs(diff) < 2) return Promise.resolve();
        const startTime = performance.now();

        return new Promise(resolve => {
            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / dur, 1);
                const ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                window.scrollTo(0, startY + diff * ease);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(step);
        });
    }

    function goToSection(index) {
        if (isAnimating) return;
        index = Math.max(0, Math.min(index, sections.length - 1));
        if (index === currentIndex) return;

        isAnimating = true;
        const oldIndex = currentIndex;
        currentIndex = index;

        // Fade out old section content
        sections[oldIndex].classList.remove('sr-active');

        // Close pillar overlay if leaving the wirkung section
        const pillarOverlay = document.getElementById('pillar-overlay');
        if (pillarOverlay) pillarOverlay.classList.remove('visible');
        const chatgptCopied = document.getElementById('chatgpt-copied');
        if (chatgptCopied) chatgptCopied.style.opacity = '0';

        const target = sections[index].offsetTop;

        smoothScrollTo(target, duration).then(() => {
            // Reset sub-steps AFTER scroll animation (old section is off-screen)
            if (subStepState[oldIndex]) {
                subStepState[oldIndex].current = 0;
                applySubStep(oldIndex, 0);
            }

            // Stagger-reveal new section content
            sections[index].classList.add('sr-active');
            enterSection(index);
            setTimeout(() => {
                isAnimating = false;
            }, cooldown);
        });
    }

    // Auto-hide header on mobile
    const header = document.querySelector('.site-header');

    // Handle scroll direction with sub-step awareness
    function handleScrollDirection(direction) {
        if (isAnimating) return;

        // Header is managed by mobile handler on small screens; on desktop keep visible

        const state = subStepState[currentIndex];

        if (direction > 0) {
            // Scrolling DOWN
            if (state) {
                if (state.current < state.total) {
                    state.current++;
                    applySubStep(currentIndex, state.current);
                    // Lock briefly so it doesn't fly through
                    isAnimating = true;
                    setTimeout(() => { isAnimating = false; }, 600);
                    return;
                }
                // All sub-steps done — cooldown before moving to next section
                isAnimating = true;
                setTimeout(() => {
                    isAnimating = false;
                    goToSection(currentIndex + 1);
                }, 800);
                return;
            }
            goToSection(currentIndex + 1);
        } else {
            // Scrolling UP
            if (state) {
                if (state.current > 1) {
                    state.current--;
                    applySubStep(currentIndex, state.current);
                    isAnimating = true;
                    setTimeout(() => { isAnimating = false; }, 600);
                    return;
                }
                // At sub-step 1, reset and go to previous section
                state.current = 0;
                applySubStep(currentIndex, 0);
            }
            goToSection(currentIndex - 1);
        }
    }

    // Wheel event
    let wheelAccumulator = 0;
    const wheelThreshold = 50;

    window.addEventListener('wheel', (e) => {
        // Allow native scroll inside sections that overflow (e.g. FAQ+footer)
        const sec = sections[currentIndex];
        if (sec && sec.scrollHeight > sec.clientHeight + 2) {
            const atBottom = sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 5;
            const atTop = sec.scrollTop <= 5;
            if (e.deltaY > 0 && !atBottom) return; // scrolling down, not at bottom
            if (e.deltaY < 0 && !atTop) return;    // scrolling up, not at top
        }
        e.preventDefault();
        if (isAnimating) return;

        wheelAccumulator += e.deltaY;
        if (Math.abs(wheelAccumulator) >= wheelThreshold) {
            handleScrollDirection(wheelAccumulator > 0 ? 1 : -1);
            wheelAccumulator = 0;
        }
    }, { passive: false });

    // Keyboard
    window.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
            e.preventDefault();
            handleScrollDirection(1);
        } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
            e.preventDefault();
            handleScrollDirection(-1);
        }
    });

    // Touch/swipe — block native scroll to enforce snap + substeps
    let touchStartY = 0;
    let touchHandled = false;
    window.addEventListener('touchstart', (e) => {
        // Ignore touches on video players (scrubbing, play/pause)
        if (e.target.closest('video, .video2-mobile-only, #video2-inline-vid')) {
            touchHandled = true;
            return;
        }
        touchStartY = e.touches[0].clientY;
        touchHandled = false;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        // Allow native scroll inside sections that overflow (e.g. FAQ+footer)
        const sec = sections[currentIndex];
        if (sec && sec.scrollHeight > sec.clientHeight + 2) {
            // Section has internal scroll — let it scroll natively
            return;
        }
        // Prevent native scroll to keep sections locked
        if (!touchHandled) {
            e.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        if (isAnimating) return;
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 30) {
            // If section has internal scroll, only switch section at scroll boundaries
            const sec = sections[currentIndex];
            if (sec && sec.scrollHeight > sec.clientHeight + 2) {
                const atBottom = sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 5;
                const atTop = sec.scrollTop <= 5;
                if (diff > 0 && !atBottom) return; // scrolling down but not at bottom
                if (diff < 0 && !atTop) return;    // scrolling up but not at top
            }
            touchHandled = true;
            handleScrollDirection(diff > 0 ? 1 : -1);
        }
    }, { passive: true });

    // Sync currentIndex on scroll (anchor links, dev-nav, etc.)
    window.addEventListener('scroll', () => {
        if (isAnimating) return;
        const scrollY = window.scrollY + window.innerHeight / 2;
        for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollY >= sections[i].offsetTop) {
                if (currentIndex !== i) {
                    sections[currentIndex].classList.remove('sr-active');
                    currentIndex = i;
                    sections[i].classList.add('sr-active');
                    enterSection(i);
                }
                break;
            }
        }
    }, { passive: true });

    // Initialize first section with reveal
    sections[0].classList.add('sr-active');
    enterSection(0);
}

/* ─── Mobile/Tablet Native Scroll (no snap, arrow navigation) ─── */
function initMobileNativeScroll(sections) {
    // IntersectionObserver for section reveals (no auto-play)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sec = entry.target;
            if (entry.isIntersecting) {
                sec.classList.add('sr-active');
            } else {
                sec.classList.remove('sr-active');
                // Close pillar overlay when leaving
                const pillarOverlay = document.getElementById('pillar-overlay');
                if (pillarOverlay) pillarOverlay.classList.remove('visible');
                const chatgptCopied = document.getElementById('chatgpt-copied');
                if (chatgptCopied) chatgptCopied.style.opacity = '0';
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(sec => observer.observe(sec));

    // Initialize arrow carousels
    initCarouselArrows();
}

/* ─── Carousel Arrow Navigation (used on mobile & desktop) ─── */
function initCarouselArrows() {
    // --- Selbstcheck (symptom tiles) — 5 steps: 4 tiles + closing ---
    setupCarousel({
        prevBtn: document.getElementById('symptom-prev'),
        nextBtn: document.getElementById('symptom-next'),
        dotsContainer: document.getElementById('symptom-dots'),
        totalSteps: 5,
        onChange: (step) => {
            const tiles = document.querySelectorAll('.symptom-tile');
            const closing = document.getElementById('selbstcheck-closing');
            const sec = document.getElementById('identification');
            const isClosing = step >= 4;

            tiles.forEach((tile, ti) => {
                tile.classList.remove('active', 'seen');
                if (!isClosing) {
                    if (ti === step) tile.classList.add('active');
                    else if (ti < step) tile.classList.add('seen');
                }
            });
            if (sec) sec.classList.toggle('symptom-complete', isClosing);
            if (closing) closing.classList.toggle('visible', isClosing);
        }
    });

    // --- Ursachen (story cards) — 5 steps: 4 cards + closing ---
    setupCarousel({
        prevBtn: document.getElementById('story-prev'),
        nextBtn: document.getElementById('story-next'),
        dotsContainer: document.getElementById('story-dots'),
        totalSteps: 5,
        onChange: (step) => {
            const cards = document.querySelectorAll('.story-card');
            const closing = document.getElementById('story-closing');
            const sec = document.getElementById('ursachen');
            const thread = sec ? sec.querySelector('.story-thread') : null;
            const threadFill = sec ? sec.querySelector('.story-thread-fill') : null;
            const isClosing = step >= 4;

            cards.forEach((card, ci) => {
                card.classList.remove('active', 'seen');
                if (isClosing) {
                    card.classList.add('seen');
                } else {
                    if (ci === step) card.classList.add('active');
                    else if (ci < step) card.classList.add('seen');
                }
            });
            if (thread) {
                thread.style.display = (step > 0 && !isClosing) ? 'block' : '';
                thread.classList.toggle('hidden', isClosing);
            }
            if (threadFill) threadFill.style.height = (Math.min(step + 1, cards.length) / cards.length * 100) + '%';
            if (closing) closing.classList.toggle('visible', isClosing);
            if (sec) sec.classList.toggle('story-complete', isClosing);
        }
    });

    // --- 3 Säulen (pillar slides) — 4 steps: 3 slides + overlay ---
    setupCarousel({
        prevBtn: document.getElementById('pillar-prev'),
        nextBtn: document.getElementById('pillar-next'),
        dotsContainer: document.getElementById('pillar-dots'),
        totalSteps: 4,
        onChange: (step) => {
            const slides = document.querySelectorAll('.pillar-slide');
            const overlay = document.getElementById('pillar-overlay');
            const isOverlay = step >= 3;

            slides.forEach((slide, si) => {
                slide.classList.remove('active', 'peek');
                if (!isOverlay && si === step) slide.classList.add('active');
                if (isOverlay) slide.classList.add('active'); // show all behind overlay
            });
            if (overlay) overlay.classList.toggle('visible', isOverlay);
        }
    });
}

function setupCarousel({ prevBtn, nextBtn, dotsContainer, totalSteps, onChange }) {
    if (!prevBtn || !nextBtn) return;

    let current = 0;
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

    function update() {
        prevBtn.disabled = current <= 0;
        nextBtn.disabled = current >= totalSteps - 1;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
        onChange(current);
    }

    prevBtn.addEventListener('click', () => {
        if (current > 0) { current--; update(); }
    });
    nextBtn.addEventListener('click', () => {
        if (current < totalSteps - 1) { current++; update(); }
    });

    // Initialize first step
    update();

    // Touch swipe support on the section
    const section = prevBtn.closest('section');
    if (section) {
        let touchStartX = 0;
        section.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        section.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && current < totalSteps - 1) { current++; update(); }
                else if (diff < 0 && current > 0) { current--; update(); }
            }
        }, { passive: true });
    }
}

/* ─── Video Overlay ─── */
function initVideoOverlay() {
    const thumb = document.getElementById('video2-thumb');
    const overlay = document.getElementById('video-overlay');
    const player = document.getElementById('video-overlay-player');
    const closeBtn = document.getElementById('video-overlay-close');
    if (!thumb || !overlay || !player) return;

    function openOverlay() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        player.currentTime = 0;
        player.play().catch(() => {});
    }

    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        player.pause();
        player.currentTime = 0;
    }

    thumb.addEventListener('click', openOverlay);
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

    // Click on dark side areas to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeOverlay();
    });

    // Close on scroll (if user manages to scroll past)
    let wasActive = false;
    window.addEventListener('scroll', () => {
        if (overlay.classList.contains('active')) {
            if (!wasActive) { wasActive = true; return; } // skip first scroll event
            closeOverlay();
            wasActive = false;
        }
    }, { passive: true });
}

/* ─── Scroll Progress Dots ─── */
function initScrollDots() {
    const container = document.getElementById('scroll-dots');
    const sections = document.querySelectorAll('main > section');
    if (!container || !sections.length) return;

    // Create one dot per section
    sections.forEach(() => {
        const dot = document.createElement('div');
        dot.classList.add('scroll-dot');
        container.appendChild(dot);
    });

    const dots = container.querySelectorAll('.scroll-dot');

    function updateDots() {
        const scrollY = window.scrollY + window.innerHeight / 2;
        let activeIndex = 0;

        for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollY >= sections[i].offsetTop) {
                activeIndex = i;
                break;
            }
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });

        // Show dots after scrolling past hero
        container.classList.toggle('visible', window.scrollY > 200);
    }

    window.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
}

/* ─── Scroll Reveals ─── */
function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .pillar-reveal').forEach(el => observer.observe(el));
}

/* ─── Mobile Menu ─── */
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const close = document.getElementById('menu-close');
    const panel = document.getElementById('mobile-menu-panel');
    if (!toggle || !panel) return;

    function openMenu() {
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        panel.classList.add('menu-open');
        panel.parentElement.style.pointerEvents = 'auto';
        panel.parentElement.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            panel.querySelectorAll('.mobile-menu-nav a, .mobile-menu-cta').forEach(el => el.classList.add('visible'));
        }, 100);
    }

    function closeMenu() {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.querySelectorAll('.mobile-menu-nav a, .mobile-menu-cta').forEach(el => el.classList.remove('visible'));
        setTimeout(() => {
            panel.classList.remove('menu-open');
            panel.parentElement.style.pointerEvents = 'none';
            panel.parentElement.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }, 300);
    }

    toggle.addEventListener('click', () => panel.classList.contains('menu-open') ? closeMenu() : openMenu());
    if (close) close.addEventListener('click', closeMenu);
    panel.querySelectorAll('.mobile-menu-nav a').forEach(link => link.addEventListener('click', closeMenu));

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('menu-open')) closeMenu();
    });
}

/* ─── Active Nav Highlighting ─── */
function initActiveNav() {
    const navLinks = document.querySelectorAll('.header-nav a[data-nav]');
    if (!navLinks.length) return;

    // Build a map of section IDs from nav link hrefs
    const sectionIds = [];
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.slice(1);
            const section = document.getElementById(id);
            if (section) sectionIds.push({ id, link, section });
        }
    });

    if (!sectionIds.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                navLinks.forEach(link => {
                    const linkId = link.getAttribute('href')?.slice(1);
                    if (linkId === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sectionIds.forEach(({ section }) => observer.observe(section));
}

/* ─── Symptom Checkboxes ─── */
function initCheckboxes() {
    const checkboxes = document.querySelectorAll('.symptom-checkbox');
    const closingEl = document.getElementById('symptom-closing');
    if (!checkboxes.length || !closingEl) return;

    const defaultText = 'Dann bist du nicht allein.';
    const activeText = 'Du bist nicht allein. Und es gibt einen Grund dafür.';

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            // Toggle .checked on parent .symptom-item
            const item = cb.closest('.symptom-item');
            if (item) {
                item.classList.toggle('checked', cb.checked);
            }

            // Count checked checkboxes
            const checkedCount = document.querySelectorAll('.symptom-checkbox:checked').length;
            closingEl.textContent = checkedCount >= 3 ? activeText : defaultText;
        });
    });
}

/* ─── Expandable Cause Cards ─── */
function initExpandableCards() {
    const toggleBtns = document.querySelectorAll('.cause-card-toggle');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.cause-card');
            if (!card) return;
            const wasOpen = card.classList.contains('open');

            // Close all other open cards (accordion behavior)
            document.querySelectorAll('.cause-card.open').forEach(c => c.classList.remove('open'));

            // Toggle current card
            if (!wasOpen) card.classList.add('open');
        });
    });
}

/* ─── Pillar Tabs ─── */
function initPillarTabs() {
    const tabs = document.querySelectorAll('.pillar-tab');
    const panels = document.querySelectorAll('.pillar-panel');
    if (tabs.length && panels.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.pillar;

                // Toggle active class on tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show matching panel, hide others
                panels.forEach(p => p.classList.remove('active'));
                const targetPanel = document.getElementById(`pillar-${target}`);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });
    }

    // Mobile pillar tabs (3 Säulen section)
    const mobileTabs = document.querySelectorAll('.pillar-mobile-tab');
    const pillarCards = document.querySelectorAll('#wirkung .pillar-card');
    if (mobileTabs.length && pillarCards.length) {
        // Initialize: show first card
        pillarCards[0].classList.add('pillar-active');

        mobileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const idx = parseInt(tab.dataset.pillarIdx);
                mobileTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                pillarCards.forEach(c => c.classList.remove('pillar-active'));
                if (pillarCards[idx]) pillarCards[idx].classList.add('pillar-active');
            });
        });
    }
}

/* ─── Generic Tabs (Inhaltsstoffe / Qualität) ─── */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`panel-${target}`)?.classList.add('active');
        });
    });
}

/* ─── Produkt-Info Tabs ─── */
function initProduktTabs() {
    const btns = document.querySelectorAll('.produkt-tab-btn');
    const panels = document.querySelectorAll('.produkt-panel');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.prodtab;
            btns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`prodpanel-${target}`)?.classList.add('active');
        });
    });
}

/* ─── Routine Timeline Animation ─── */
function initRoutineTimeline() {
    const timeline = document.querySelector('.routine-timeline');
    if (!timeline) return;

    const lineFill = timeline.querySelector('.routine-line-fill');
    if (!lineFill) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timeline.classList.add('animated');
                // Animate stroke-dashoffset to 0
                requestAnimationFrame(() => {
                    lineFill.style.transition = 'stroke-dashoffset 1.5s ease-out';
                    lineFill.style.strokeDashoffset = '0';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(timeline);
}

/* ─── Testimonials Carousel ─── */
function initTestimonials() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.getElementById('t-prev');
    const nextBtn = document.getElementById('t-next');
    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.t-card');
    const totalCards = cards.length;

    function getVisibleCount() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function update() {
        const visible = getVisibleCount();
        const maxIndex = Math.max(0, totalCards - visible);
        currentIndex = Math.min(currentIndex, maxIndex);
        const card = cards[0];
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 24; // 1.5rem
        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener('click', () => { currentIndex = Math.max(0, currentIndex - 1); update(); });
    nextBtn.addEventListener('click', () => { currentIndex++; update(); });
    window.addEventListener('resize', update);

    // Touch/swipe support
    let startX = 0, isDragging = false;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    track.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? currentIndex++ : currentIndex = Math.max(0, currentIndex - 1);
            update();
        }
    }, { passive: true });

    update();
}

/* ─── FAQ Accordion ─── */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
}

/* ─── Video Lazy Loading ─── */
function initVideoLazyLoad() {
    const videos = document.querySelectorAll('.lazy-video');
    if (!videos.length) return;

    // Observer to load video sources when near viewport
    const loadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const src = video.dataset.src;
                if (src && !video.querySelector('source')) {
                    const source = document.createElement('source');
                    source.src = src;
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    video.load();
                    try {
                        video.play();
                    } catch (e) {
                        // Autoplay may be blocked by browser policy
                    }
                }
                loadObserver.unobserve(video);
            }
        });
    }, { rootMargin: '200px 0px' });

    // Observer to pause videos when off-screen
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (video.paused && video.querySelector('source')) {
                    try { video.play(); } catch (e) { /* autoplay blocked */ }
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.1 });

    videos.forEach(video => {
        loadObserver.observe(video);
        visibilityObserver.observe(video);
    });

    // Play button: unmute and play with sound
    document.querySelectorAll('.video-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.video-container');
            if (!container) return;
            const video = container.querySelector('video');
            if (!video) return;

            // If video has no source yet, load it first
            const src = video.dataset.src;
            if (src && !video.querySelector('source')) {
                const source = document.createElement('source');
                source.src = src;
                source.type = 'video/mp4';
                video.appendChild(source);
                video.load();
            }

            video.muted = false;
            video.currentTime = 0;
            try {
                video.play();
            } catch (e) {
                // Autoplay with sound may be blocked
            }

            // Hide the play button
            btn.classList.add('hidden');

            // Show play button again when video ends
            video.addEventListener('ended', () => {
                btn.classList.remove('hidden');
                video.muted = true;
            }, { once: true });
        });
    });

    // Video overlay player: handled by initVideoOverlay
}

/* ─── Sticky Mobile CTA ─── */
function initStickyMobileCTA() {
    const stickyBar = document.getElementById('sticky-mobile-cta');
    const productCTA = document.getElementById('product-cta');
    if (!stickyBar || !productCTA) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show sticky bar when product-cta section is NOT in view
            stickyBar.classList.toggle('visible', !entry.isIntersecting);
        });
    }, { threshold: 0 });

    observer.observe(productCTA);
}

/* ─── Closer Section Particles ─── */
function initCloserParticles() {
    const container = document.querySelector('.closer-particles');
    if (!container) return;

    const particleCount = 18; // 15-20 range

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');

        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        // Random size (2-6px)
        const size = 2 + Math.random() * 4;

        // Random opacity (0.1-0.4)
        const opacity = 0.1 + Math.random() * 0.3;

        // Random animation duration (3-8s) and delay (0-5s)
        const duration = 3 + Math.random() * 5;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            left: ${left}%;
            top: ${top}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
        `;

        container.appendChild(particle);
    }

    // Inject keyframes if not already present
    if (!document.getElementById('particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translateY(0) translateX(0); }
                25% { transform: translateY(-12px) translateX(6px); }
                50% { transform: translateY(-6px) translateX(-4px); }
                75% { transform: translateY(-18px) translateX(3px); }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ─── Section Reveal Stagger (tags elements with data-sr for CSS-driven reveals) ─── */
function initSectionReveals() {
    const revealConfig = {
        // Section 2: Identifikation (sub-steps handle tiles)
        'identification': [
            [':scope > div > div:first-child > span', 1],
            [':scope > div > div:first-child > h2', 2],
            ['#symptom-grid', 3],
            ['#symptom-dots', 4],
        ],
        // Section 3: Schlafbiologie (sub-steps handle card stack)
        'schlafbiologie': [
            [':scope > div > div:first-child > span', 1],
            [':scope > div > div:first-child > h2', 2],
            [':scope > div > div:first-child > p', 3],
            ['.card-stack', 4],
            ['.stack-step-indicator', 5],
        ],
        // Section 4: Video1
        'video1': [
            [':scope > div > div > div:first-child', 1],
            [':scope > div > div > div:last-child', 2],
        ],
        // Section 5: Ursachen (sub-steps handle story cards)
        'ursachen': [
            ['.story-header > span', 1],
            ['.story-header > h2', 2],
            ['.story-header > p', 3],
        ],
        // Section 6: Produkt-Info
        'produkt-info': [
            [':scope > div > div:first-child > h2', 1],
            [':scope > div > div:first-child > p', 2],
            ['.produkt-image', 3],
            ['.produkt-tab-nav', 4],
            ['.produkt-panels-wrapper', 5],
            ['.produkt-section-cta', 6],
        ],
        // Section 5b: Video2 (So funktioniert)
        'video2': [
            [':scope > div > span', 1],
            [':scope > div > h2', 2],
            [':scope > div > p', 3],
            ['.video-thumb-container', 5],
        ],
        // Section 7: Wirkung (Pillar Carousel — sub-steps handle slides)
        'wirkung': [
            ['.wirkung-pill', 1],
            [':scope > div > div:first-child > h2', 2],
            [':scope > div > div:first-child > p', 3],
        ],
        // Section 8: Inhaltsstoffe
        'inhaltsstoffe': [
            [':scope > div > div:first-child > span', 1],
            [':scope > div > div:first-child > h2', 2],
            [':scope > div > div:nth-child(2)', 3],
            [':scope > div > div:last-child', 4],
        ],
        // Section 9: Anwendung
        'anwendung': [
            [':scope > div > div:first-child > span', 1],
            [':scope > div > div:first-child > h2', 2],
            [':scope > div > div:nth-child(2)', 3],
            [':scope > div > p', 4],
        ],
        // Section 10: Testimonials
        'testimonials': [
            [':scope > div > div:first-child > span', 1],
            [':scope > div > div:first-child > h2', 2],
            ['.testimonials-outer', 3],
            ['.t-nav', 4],
        ],
        // Section 11: Vertrauen
        'vertrauen': [
            [':scope > div > div:first-of-type', 1],
            [':scope > div > span', 2],
            [':scope > div > h2', 3],
            [':scope > div > p:nth-of-type(1)', 4],
            [':scope > div > p:nth-of-type(2)', 5],
            [':scope > div > p:nth-of-type(3)', 6],
            [':scope > div > p:nth-of-type(4)', 6],
            [':scope > div > div:last-of-type', 7],
        ],
        // Section 12: Product CTA
        'product-cta': [
            [':scope > div > div > div:first-child', 1],
            [':scope > div > div > div:last-child', 2],
        ],
        // Section 13: FAQ
        'faq-section': [
            ['.faq-left h2', 1],
            ['.faq-left p:not(.faq-contact)', 2],
            ['.faq-list', 3],
            ['.faq-contact', 4],
        ],
        // Section 14: Closer
        'closer': [
            [':scope > div:last-of-type > h2:first-of-type', 1],
            [':scope > div:last-of-type > h2:last-of-type', 2],
            [':scope > div:last-of-type > a', 3],
            [':scope > div:last-of-type > p', 4],
        ],
    };

    Object.entries(revealConfig).forEach(([sectionId, rules]) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        rules.forEach(([selector, order]) => {
            const el = section.querySelector(selector);
            if (el) el.setAttribute('data-sr', order);
        });
    });
}

/* ─── Dev Navigation (quick-jump buttons) ─── */
function initDevNav() {
    const container = document.getElementById('dev-nav');
    const sections = document.querySelectorAll('main > section');
    if (!container || !sections.length) return;

    sections.forEach((sec, i) => {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.title = sec.id || `Section ${i + 1}`;
        btn.style.cssText = `
            width: 28px; height: 28px; border-radius: 50%;
            background: rgba(134,19,48,0.85); color: white;
            border: 1px solid rgba(255,255,255,0.3);
            font-size: 0.65rem; font-weight: 700;
            cursor: pointer; font-family: 'Inter', sans-serif;
            transition: transform 0.2s, background 0.2s;
            backdrop-filter: blur(8px);
        `;
        btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.2)'; btn.style.background = '#861330'; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; btn.style.background = 'rgba(134,19,48,0.85)'; });
        btn.addEventListener('click', () => {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        container.appendChild(btn);
    });
}

/* ─── Product Popup (after Section 5 / Ursachen) ─── */
function initProductPopup() {
    const popup = document.getElementById('product-popup');
    if (!popup) return;

    const closeBtn = popup.querySelector('.product-popup-close');
    const shopBtn = popup.querySelector('.product-popup-btn');
    let popupClosed = false;

    function showPopupElements() {
        // Shop button at 2s, close button at 5s
        if (shopBtn) setTimeout(() => shopBtn.classList.add('show'), 2000);
        if (closeBtn) setTimeout(() => closeBtn.classList.add('show'), 5000);
    }

    function hidePopupElements() {
        if (shopBtn) shopBtn.classList.remove('show');
        if (closeBtn) closeBtn.classList.remove('show');
    }

    function closePopup() {
        if (popupClosed) return;
        popupClosed = true;
        sessionStorage.setItem('popupDismissed', '1');
        hidePopupElements();
        setTimeout(() => {
            popup.classList.remove('visible');
            popup.classList.add('hiding');
        }, 400);
    }

    // Show popup after 15 seconds, but not if already dismissed
    if (sessionStorage.getItem('popupDismissed')) return;
    setTimeout(() => {
        if (popupClosed) return;
        popup.classList.add('visible');
        showPopupElements();
    }, 15000);

    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }

    // Mobile auto-close: hide popup when #produkt-info section comes into view
    if (window.innerWidth <= 768) {
        const produktSection = document.getElementById('produkt-info');
        if (produktSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        closePopup();
                        sectionObserver.disconnect();
                    }
                });
            }, { threshold: 0.1 });
            sectionObserver.observe(produktSection);
        }
    }
}

/* ─── ChatGPT Button ─── */
function initChatGPTButton() {
    const btn = document.getElementById('chatgpt-btn');
    const copied = document.getElementById('chatgpt-copied');
    if (!btn) return;

    const prompt = 'Erkläre mir die wissenschaftliche Wirkung dieser Inhaltsstoffe auf den Schlaf und die nächtliche Regeneration: Melatonin, L-Tryptophan, Safran-Extrakt (Crocus sativus), Nopal-Kaktus Pulver (Opuntia ficus-indica), Zink, Chrom, Niacin (B3), Pantothensäure (B5), Pyridoxin (B6), Riboflavin (B2), Thiamin (B1), Biotin (B7), Folat (B9) und Methylcobalamin (B12). Diese Kombination ist im Nahrungsergänzungsmittel zZzlim® Night Complex enthalten.';

    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(prompt).then(() => {
            if (copied) {
                copied.style.opacity = '1';
            }
            // 5s delay so user can read the message before ChatGPT opens
            setTimeout(() => {
                window.open('https://chat.openai.com/', '_blank');
                if (copied) setTimeout(() => copied.style.opacity = '0', 2000);
            }, 5000);
        });
    });

    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

    // Overlay close button
    const overlayClose = document.getElementById('pillar-overlay-close');
    const overlay = document.getElementById('pillar-overlay');
    if (overlayClose && overlay) {
        overlayClose.addEventListener('click', () => {
            overlay.classList.remove('visible');
        });
    }
}

/* ─── Scroll Progress Line ─── */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ─── Back to Top ─── */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Floating Dust Particles (global background effect) ─── */
function initFloatingDustEffect() {
    const container = document.getElementById('effect-dust');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const COUNT = 50;

    function getMarginZones(w) {
        const contentW = Math.min(800, w * 0.85);
        const margin = (w - contentW) / 2;
        return { left: margin, right: w - margin };
    }

    function randMarginX(w) {
        const { left, right } = getMarginZones(w);
        if (Math.random() < 0.5) {
            return Math.random() * left;
        } else {
            return right + Math.random() * (w - right);
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (particles.length === 0) initParticles();
    }

    function initParticles() {
        particles = [];
        const w = canvas.width, h = canvas.height;
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: randMarginX(w),
                y: Math.random() * h,
                r: 1 + Math.random() * 2,
                speed: 0.12 + Math.random() * 0.25,
                drift: (Math.random() - 0.5) * 0.15
            });
        }
    }

    function draw() {
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(196, 151, 106, 0.12)';

        particles.forEach(p => {
            p.y -= p.speed;
            p.x += p.drift;
            if (p.y < -10) {
                p.y = h + 10;
                p.x = randMarginX(w);
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
}

/* ─── Organic Blob Drift (global background effect) ─── */
function initBlobDriftEffect() {
    const container = document.getElementById('effect-blobs');
    if (!container) return;

    const blobs = [
        { color: '#F0E6DC', x: '3%',  y: '10%',  size: 280, dur: 25, anim: 'blobMorphA' },
        { color: '#8BA88E', x: '-2%', y: '45%',  size: 220, dur: 30, anim: 'blobMorphB' },
        { color: '#F0E6DC', x: '82%', y: '8%',   size: 250, dur: 28, anim: 'blobMorphC' },
        { color: '#8BA88E', x: '87%', y: '50%',  size: 300, dur: 22, anim: 'blobMorphA' },
        { color: '#F0E6DC', x: '91%', y: '30%',  size: 180, dur: 35, anim: 'blobMorphB' },
        { color: '#8BA88E', x: '1%',  y: '75%',  size: 200, dur: 32, anim: 'blobMorphC' },
    ];

    blobs.forEach(b => {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            left: ${b.x};
            top: ${b.y};
            width: ${b.size}px;
            height: ${b.size}px;
            background: ${b.color};
            opacity: 0.08;
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            animation: ${b.anim} ${b.dur}s ease-in-out infinite;
            filter: blur(2px);
            pointer-events: none;
        `;
        container.appendChild(div);
    });
}

/* ── Scroll Indicator ── */
function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const sections = document.querySelectorAll('main section');

    function update() {
        const footerRect = footer.getBoundingClientRect();
        // Hide when section 2 (identification) is reached, or when footer is visible
        const section2 = document.getElementById('identification');
        const s2Rect = section2 ? section2.getBoundingClientRect() : null;
        if (footerRect.top <= window.innerHeight || (s2Rect && s2Rect.top <= window.innerHeight * 0.5)) {
            indicator.classList.add('hidden');
        } else {
            indicator.classList.remove('hidden');
        }

        // Check background brightness of section at indicator position
        const indicatorY = window.innerHeight - 40;
        let isDark = false;
        sections.forEach(sec => {
            const r = sec.getBoundingClientRect();
            if (r.top <= indicatorY && r.bottom >= indicatorY) {
                const bg = getComputedStyle(sec).backgroundColor;
                const match = bg.match(/\d+/g);
                if (match) {
                    const brightness = (parseInt(match[0]) * 299 + parseInt(match[1]) * 587 + parseInt(match[2]) * 114) / 1000;
                    isDark = brightness > 180;
                }
            }
        });
        document.body.classList.toggle('scroll-indicator-dark', isDark);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ═══ Mobile Scroll-Down Overlay ═══ */
(function() {
    const overlay = document.getElementById('mobile-scroll-overlay');
    if (!overlay) return;

    const showSections = ['identification', 'ursachen', 'wirkung'];

    function checkVisibility() {
        // Let CSS media query handle desktop hiding; JS only toggles hidden class
        let show = false;
        for (const id of showSections) {
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4) {
                show = true;
                break;
            }
        }
        overlay.classList.toggle('hidden', !show);
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    // Run after a short delay to ensure layout is computed
    setTimeout(checkVisibility, 100);
    checkVisibility();
})();

