/* ══════════════════════════════════════════════
   zZzlim® Erklär-Landingpage – JavaScript
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initMobileMenu();
    initActiveNav();
    initCheckboxes();
    initExpandableCards();
    initPillarTabs();
    initTabs();
    initRoutineTimeline();
    initTestimonials();
    initFAQ();
    initVideoLazyLoad();
    initStickyMobileCTA();
    initCloserParticles();
    initBackToTop();

    // Hero reveal on load
    requestAnimationFrame(() => {
        document.querySelectorAll('.hero-reveal').forEach(el => el.classList.add('visible'));
    });
});

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
    if (!tabs.length || !panels.length) return;

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

/* ─── Back to Top ─── */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
