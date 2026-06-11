// ========================= ANIMATIONS & SCROLL EFFECTS =========================
// All GSAP-based animations and ScrollTrigger effects

let programsScrollTween = null;
let storiesLoopTween = null;
let storiesLoopResizeBound = false;

let heroMarqueeTween = null;
let heroMarqueeResizeBound = false;

/**
 * Initialize all page animations (reveal, parallax, mouse tracking)
 */
export function initializeAnimations() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
            btn.style.opacity = '1';
            btn.style.transform = 'none';
        });
        document.querySelectorAll('[data-reveal]').forEach((item) => {
            item.style.opacity = '1';
            item.style.transform = 'none';
        });
        return;
    }

    gsap.from('nav', { opacity: 0, y: -20, duration: 0.9, ease: 'power3.out' });

    gsap.utils.toArray('[data-reveal]').forEach((item) => {
        const isMedia = item.tagName === 'IMG' || item.classList.contains('media-hover');
        gsap.fromTo(item,
            { autoAlpha: 0, y: isMedia ? 36 : 24, scale: isMedia ? 0.98 : 1 },
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                }
            }
        );
    });

    gsap.utils.toArray('[data-parallax]').forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax) || 0.1;
        gsap.to(layer, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: layer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    const mouseTargets = Array.from(document.querySelectorAll('[data-mouse]'));
    if (mouseTargets.length) {
        const handlers = mouseTargets.map((el) => {
            const depth = parseFloat(el.dataset.mouse) || 0.1;
            return {
                depth,
                xTo: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
                yTo: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' })
            };
        });

        window.addEventListener('mousemove', (event) => {
            const relX = (event.clientX / window.innerWidth - 0.5) * 2;
            const relY = (event.clientY / window.innerHeight - 0.5) * 2;
            handlers.forEach(({ depth, xTo, yTo }) => {
                xTo(relX * 18 * depth);
                yTo(relY * 18 * depth);
            });
        });
    }

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    initializeHeroMarquee();
    initializeStoriesLoop();
}

/**
 * Animated counters for stats section
 */
export function initializeCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;

    const animateCounter = (el) => {
        if (el.dataset.counterStarted === 'true') return;
        el.dataset.counterStarted = 'true';

        const target = parseFloat(el.dataset.counterTarget || '0');
        if (Number.isNaN(target)) return;

        const duration = parseInt(el.dataset.counterDuration || '1600', 10);
        const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
        const suffix = el.dataset.counterSuffix || '';

        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = target * progress;
            const value = current.toFixed(decimals);
            el.textContent = `${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = `${target.toFixed(decimals)}${suffix}`;
            }
        };

        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    animateCounter(el);
                    obs.unobserve(el);
                }
            });
        }, {
            threshold: 0.4
        });

        counters.forEach((el) => observer.observe(el));
    } else {
        counters.forEach((el) => animateCounter(el));
    }
}

/**
 * Infinite scrolling marquee for hero section
 */
export function initializeHeroMarquee() {
    const marquee = document.querySelector('.hero-marquee');
    const track = marquee?.querySelector('.hero-marquee__track');
    if (!marquee || !track || !window.gsap) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (!track.dataset.loopReady) {
        track.dataset.loopReady = 'true';
        track.innerHTML += track.innerHTML;
    }

    if (heroMarqueeTween) {
        heroMarqueeTween.kill();
        heroMarqueeTween = null;
    }

    const containerWidth = marquee.clientWidth || window.innerWidth;

    // Ensure the content is wide enough so we never see a blank bar
    let safety = 0;
    while (track.scrollWidth < containerWidth * 2 && safety < 4) {
        track.innerHTML += track.innerHTML;
        safety += 1;
    }

    const distance = track.scrollWidth / 2;
    if (!distance) return;

    const duration = Math.min(40, Math.max(18, distance / 40));

    gsap.set(track, { x: 0 });
    heroMarqueeTween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        duration,
        repeat: -1
    });

    if (!heroMarqueeResizeBound) {
        heroMarqueeResizeBound = true;
        window.addEventListener('resize', () => {
            initializeHeroMarquee();
        });
    }
}

/**
 * Continuous loop animation for success stories
 */
export function initializeStoriesLoop() {
    const track = document.getElementById('storiesTrack');
    if (!track || !window.gsap) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (!track.dataset.loopReady) {
        track.dataset.loopReady = 'true';
        track.innerHTML += track.innerHTML;
    }

    if (storiesLoopTween) {
        storiesLoopTween.kill();
        storiesLoopTween = null;
    }

    const cards = Array.from(track.children);
    const half = Math.floor(cards.length / 2);
    if (!half) return;

    // Stories are continuously animated; ensure they are visible even if ScrollTrigger reveal didn't fire.
    cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
    });

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const distance = cards.slice(0, half).reduce((sum, card) => {
        return sum + card.getBoundingClientRect().width;
    }, 0) + gap * Math.max(0, half - 1);

    const dir = document.documentElement.getAttribute('dir') || 'ltr';
    const direction = dir.toLowerCase() === 'rtl' ? 1 : -1;

    const duration = Math.min(80, Math.max(28, distance / 35));

    gsap.set(track, { x: 0 });
    storiesLoopTween = gsap.to(track, {
        x: direction * distance,
        ease: 'none',
        duration,
        repeat: -1
    });

    const originalCards = cards.slice(0, half);
    originalCards.forEach((card) => {
        if (card.dataset.loopBound) return;
        card.dataset.loopBound = 'true';
        card.addEventListener('mouseenter', () => storiesLoopTween?.pause());
        card.addEventListener('mouseleave', () => storiesLoopTween?.play());
        card.addEventListener('focusin', () => storiesLoopTween?.pause());
        card.addEventListener('focusout', () => storiesLoopTween?.play());
    });

    if (!storiesLoopResizeBound) {
        storiesLoopResizeBound = true;
        window.addEventListener('resize', () => {
            initializeStoriesLoop();
        });
    }
}
