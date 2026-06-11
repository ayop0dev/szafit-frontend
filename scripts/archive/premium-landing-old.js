// ================================================
// SZAFIT PREMIUM LANDING PAGE - JAVASCRIPT
// Elite Fitness Training Programs
// ================================================

// =========================================================
// THEME TOGGLE
// =========================================================
const themeLink = document.getElementById('theme-link');
const themeToggle = document.getElementById('themeToggle');
let isDarkTheme = localStorage.getItem('theme') !== 'light';

// Initialize theme on load
function initTheme() {
    if (isDarkTheme) {
        themeLink.href = '1/css/dark-theme.css';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        themeLink.href = '1/css/light-theme.css';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.documentElement.classList.remove('dark-theme');
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
}

themeToggle.addEventListener('click', function() {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Add transition class for smooth change
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    
    // Simple opacity transition
    document.body.style.opacity = '0.7';
    
    setTimeout(function() {
        initTheme();
        document.body.style.opacity = '1';
    }, 200);
    
    // Rotate icon
    const currentRotation = parseInt(themeToggle.style.transform?.match(/rotate\\(([^)]+)deg\\)/)?.[1] || 0);
    themeToggle.style.transform = `rotate(${currentRotation + 180}deg)`;
});

// Initialize theme
initTheme();

// =========================================================
// PROGRAMS DATA
// =========================================================
const programsData = [
    {
        id: 1,
        nameAr: "برنامج البداية",
        nameEn: "Starter",
        price: 99,
        currency: "ريال",
        icon: "🚀",
        subtitle: "للمبتدئين",
        description: "برنامج تأسيسي مناسب للمبتدئين أو اللي راجعين بعد انقطاع. يركز على بناء عادة التمرين، تحسين اللياقة، وتعلم الأساسيات بطريقة سهلة وآمنة بدون ضغط عالي.",
        features: [
            "مناسب للمبتدئ 100%",
            "3 أيام تدريب بالأسبوع",
            "متابعة يومية",
            "النتائج خلال 4-6 أسابيع"
        ],
        featured: false
    },
    {
        id: 2,
        nameAr: "شد الجسم",
        nameEn: "Toning",
        price: 149,
        currency: "ريال",
        icon: "💪",
        subtitle: "نحت وشد",
        description: "برنامج شد ونحت للجسم يركز على إبراز العضلات وتقليل الدهون بدون تضخيم كبير. اللي يبغون جسم مشدود ومظهر رياضي متناسق.",
        features: [
            "4 أيام تدريب بالأسبوع",
            "تمارين مقاومة متقدمة",
            "خطة تغذية محسوبة",
            "نتائج واضحة خلال 8 أسابيع"
        ],
        featured: false
    },
    {
        id: 3,
        nameAr: "حرق الدهون",
        nameEn: "Burn",
        price: 149,
        currency: "ريال",
        icon: "🔥",
        subtitle: "حرق قوي",
        description: "برنامج حرق قوي وسريع يساعدك تنزل دهون بشكل واضح ويزيد نشاطك ولياقتك. يجمع بين تمارين المقاومة والكارديو مع نظام غذائي محسوب.",
        features: [
            "5 أيام تدريب بالأسبوع",
            "كارديو + مقاومة",
            "8-12 ألف خطوة يومياً",
            "نزول وزن سريع وصحي"
        ],
        featured: true
    },
    {
        id: 4,
        nameAr: "بعد الحمل",
        nameEn: "After Pregnancy",
        price: 550,
        currency: "ريال",
        icon: "👶",
        subtitle: "برنامج خاص",
        description: "برنامج مخصص للرجوع التدريجي بعد الحمل، يساعد على تقوية الجسم، شد بسيط، وتحسين اللياقة بدون ضغط على البطن أو الحوض. تركيزه على الأمان والاستمرارية.",
        features: [
            "3 أيام تدريب خفيف",
            "تمارين آمنة بعد الولادة",
            "تركيز على الحوض والتنفس",
            "متابعة طبية مستمرة"
        ],
        featured: false
    },
    {
        id: 5,
        nameAr: "تحدي",
        nameEn: "Challenge",
        price: 150,
        currency: "ريال",
        icon: "⚡",
        subtitle: "تحدي قوي",
        description: "تحدي قوي ومتحمس للي يبغى نتائج سريعة خلال مدة قصيرة. فيه جدول مكثف وتمارين متنوعة مع نظام غذائي واضح، مناسب للي يحب الالتزام والانضباط.",
        features: [
            "6 أيام تدريب بالأسبوع",
            "التزام عالي جداً",
            "نتائج سريعة وواضحة",
            "مستوى متوسط فما فوق"
        ],
        featured: true
    },
    {
        id: 6,
        nameAr: "برنامج VIP",
        nameEn: "VIP Program",
        price: 600,
        currency: "ريال",
        icon: "👑",
        subtitle: "حصري",
        description: "برنامج شخصي كامل مخصص حسب جسمك وهدفك ووقتك. يتم فيه بناء خطة تدريب وتغذية خاصة فيك مع تعديل مستمر حسب النتائج. هذا البرنامج مناسب للي يبغى تغيير جذري ومتابعة قوية.",
        features: [
            "خطة مخصصة 100%",
            "متابعة شخصية يومية",
            "تعديل مستمر حسب التقدم",
            "دعم مباشر من المدرب"
        ],
        featured: true
    }
];

// =========================================================
// DOM ELEMENTS
// =========================================================
const programsGrid = document.getElementById('programsGrid');
const navbar = document.getElementById('premiumNav');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');

// =========================================================
// INITIALIZE
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    loadPrograms();
    initializeAnimations();
    initializeNavbar();
    initializeCounters();
    initializeSmoothScroll();
});

// =========================================================
// LOAD PROGRAMS DYNAMICALLY
// =========================================================
function loadPrograms() {
    if (!programsGrid) return;
    
    programsGrid.innerHTML = '';
    
    programsData.forEach((program, index) => {
        const card = createProgramCard(program, index);
        programsGrid.appendChild(card);
    });
}

function createProgramCard(program, index) {
    const card = document.createElement('div');
    card.className = 'program-card';
    card.style.opacity = '1';
    card.style.transform = 'none';
    
    if (program.featured) {
        card.classList.add('featured');
    }
    
    card.innerHTML = `
        ${program.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> الأكثر طلباً</div>' : ''}
        
        <div class="program-header">
            <div class="program-icon">${program.icon}</div>
            <div class="program-price">
                <div class="price-amount">${program.price}</div>
                <div class="price-currency">${program.currency}</div>
            </div>
        </div>
        
        <h3 class="program-title">${program.nameAr}</h3>
        <div class="program-subtitle">${program.subtitle}</div>
        
        <p class="program-description">${program.description}</p>
        
        <ul class="program-features">
            ${program.features.map(feature => `
                <li>
                    <i class="fas fa-check-circle"></i>
                    <span>${feature}</span>
                </li>
            `).join('')}
        </ul>
        
        <button class="program-cta-btn" onclick="selectProgram(${program.id})">
            اختر البرنامج
            <i class="fas fa-arrow-left"></i>
        </button>
    `;
    
    return card;
}

// =========================================================
// PROGRAM SELECTION
// =========================================================
function selectProgram(programId) {
    const program = programsData.find(p => p.id === programId);
    
    // Show modal or redirect to checkout
    alert(`تم اختيار: ${program.nameAr}\nالسعر: ${program.price} ${program.currency}\n\nسيتم توجيهك لصفحة الدفع...`);
    
    // Here you can add actual checkout logic
    // window.location.href = `/checkout?program=${programId}`;
}

// =========================================================
// GSAP ANIMATIONS
// =========================================================
function initializeAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Title Animation
    gsap.from('.hero-title .title-main', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3
    });
    
    gsap.from('.hero-title .title-highlight', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.6
    });
    
    // Programs Cards Stagger
    gsap.from('.program-card', {
        scrollTrigger: {
            trigger: '.programs-grid',
            start: 'top 80%'
        },
        opacity: 0,
        y: 60,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Features Cards
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%'
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.7)'
    });
    
    // Testimonials
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonials-slider',
            start: 'top 80%'
        },
        opacity: 0,
        x: -50,
        stagger: 0.2,
        duration: 0.8
    });
    
    // App Section
    gsap.from('.app-content-text', {
        scrollTrigger: {
            trigger: '.app-download-section',
            start: 'top 80%'
        },
        opacity: 0,
        x: -80,
        duration: 1
    });
    
    gsap.from('.app-phone-mockup', {
        scrollTrigger: {
            trigger: '.app-download-section',
            start: 'top 80%'
        },
        opacity: 0,
        x: 80,
        duration: 1
    });
}

// =========================================================
// NAVBAR SCROLL EFFECT
// =========================================================
function initializeNavbar() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// =========================================================
// COUNTER ANIMATION
// =========================================================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Trigger on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// =========================================================
// SMOOTH SCROLL
// =========================================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================================
// LANGUAGE TOGGLE
// =========================================================
const langToggle = document.getElementById('langToggle');
let currentLang = 'ar';

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        langToggle.textContent = currentLang === 'ar' ? 'EN' : 'AR';
        
        // Toggle document direction
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);
        
        // Reload programs with new language
        updateLanguage();
    });
}

function updateLanguage() {
    // Update program titles
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach((card, index) => {
        const program = programsData[index];
        const title = card.querySelector('.program-title');
        if (title) {
            title.textContent = currentLang === 'ar' ? program.nameAr : program.nameEn;
        }
    });
}

// =========================================================
// VIDEO MODAL
// =========================================================
const videoButtons = document.querySelectorAll('.btn-secondary-hero');

videoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Create video modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;
        
        modal.innerHTML = `
            <div style="position: relative; max-width: 900px; width: 100%;">
                <button onclick="this.parentElement.parentElement.remove()" 
                    style="position: absolute; top: -40px; right: 0; background: transparent;
                           border: none; color: white; font-size: 2rem; cursor: pointer;">
                    ✕
                </button>
                <iframe width="100%" height="500" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    frameborder="0" allowfullscreen
                    style="border-radius: 12px;">
                </iframe>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
});

// =========================================================
// NEWSLETTER FORM
// =========================================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        
        if (email) {
            alert(`شكراً لاشتراكك! سنرسل لك أحدث العروض على: ${email}`);
            newsletterForm.reset();
        }
    });
}

// =========================================================
// CTA BUTTONS
// =========================================================
const ctaButtons = document.querySelectorAll('.btn-primary-hero, .btn-cta-nav, .btn-final-cta');

ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Scroll to programs section
        const programsSection = document.getElementById('programs');
        if (programsSection) {
            programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =========================================================
// PARALLAX EFFECT
// =========================================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background, .app-shapes');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// =========================================================
// LOADING ANIMATION
// =========================================================
window.addEventListener('load', () => {
    // Fade in animation after page loads
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
});

// =========================================================
// CURSOR EFFECT (PREMIUM)
// =========================================================
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid #01D09A;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s, opacity 0.3s;
    opacity: 0;
`;

document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 20 + 'px';
    cursor.style.top = e.clientY - 20 + 'px';
    cursor.style.opacity = '0.5';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Enlarge cursor on hover over interactive elements
const interactiveElements = document.querySelectorAll('a, button, .program-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderWidth = '3px';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderWidth = '2px';
    });
});

console.log('🚀 SZAFIT Premium Landing Page Initialized');
console.log('✨ All systems ready!');
