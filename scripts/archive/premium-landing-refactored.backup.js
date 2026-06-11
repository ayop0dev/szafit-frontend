// ========================= PAGE: PREMIUM LANDING =========================
// Context: Neo Athletic + Minimal Luxury single-page experience
// ========================================================================

// ========================= BLOCK: CONSTANTS & STATE =========================
const PROGRAMS_ENDPOINT = 'https://z.szafit.com/wp-json/szafit/v1/programs';

// Saudi Riyal SVG icon (inherits current text color via CSS)
var SAR_ICON_SVG = '<span class="sar-currency-symbol" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39"><path class="cls-1" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path class="cls-1" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg></span>';

const elements = {
    langToggle: document.getElementById('langToggle'),
    themeToggle: document.getElementById('themeToggle'),
    mobileToggle: document.getElementById('mobileToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    programsGrid: document.getElementById('programsGrid'),
    heroPrimary: document.getElementById('heroPrimary'),
    heroSecondary: document.getElementById('heroSecondary'),
    navCTA: document.getElementById('navCTA')
};

const state = {
    lang: localStorage.getItem('lang') || 'ar',
    theme: localStorage.getItem('theme') || 'dark'
};

// ========================= BLOCK: TRANSLATIONS =========================
const translations = {
    ar: {
        'nav.tagline': 'Elite Coaching',
        'nav.programs': 'البرامج',
        'nav.method': 'المنهجية',
        'nav.app': 'التطبيق',
        'nav.stories': 'قصص النجاح',
        'nav.cta': 'احجز برنامجك',
        'hero.label': 'مدربة لياقة للنخبة بأداء محارب',
        'hero.line1': 'خلي جسمك',
        'hero.line2': 'إيصير لوحة رياضية',
        'hero.sub': 'برامج مدفوعة عبرخطط تدريب عبر التطبيق للبنات الطموحات، مع متابعة لحظية ونتائج تفرق فعلًا.',
        'hero.ctaPrimary': 'ابدأ التحدي الآن',
        'hero.ctaSecondary': 'احجز تقييم الأداء',
        'hero.stat1': '+98% انضباط عملاء النخبة',
        'hero.stat2': '6 برامج رياضية مدفوعة',
        'hero.card.label': 'نتائج أول 30 يوم',
        'hero.card.note': 'قفزة في القوة والانضباط',
        'hero.card.item1': 'جلسات متابعة أسبوعية',
        'hero.card.item2': 'بروتوكول تغذية مخصص',
        'hero.card.item3': 'تتبع التطبيق الذكي',
        'stats.label1': 'عميل نخبة خدمناهم',
        'stats.label2': 'برامج مدفوعة جاهزة الآن',
        'stats.label3': 'متوسط تقييم العملاء',
        'programs.label': 'البرامج المدفوعة',
        'programs.title': 'اختر برنامجك الرياضي',
        'programs.desc': 'ستة مسارات قوية بمستوى احترافي، مع شروط دقيقة تضمن أقصى نتائج بدنية.',
        'programs.filter1': 'برامج النخبة',
        'programs.filter2': 'تخصيص',
        'method.label': 'منهجية التدريب',
        'method.title': 'رؤية صارمة بطاقة عالية',
        'method.desc': 'منهجية تعتمد على القوة والانضباط. كل تمرين له هدف، وكل رقم له معنى.',
        'method.point1': 'تحليل عميق للجسم ونمط الحياة',
        'method.point1Desc': 'جلسة تقييم أولية تفصيلية لضمان خطة دقيقة من اليوم الأول.',
        'method.point2': 'بروتوكولات تدريب هجومية',
        'method.point2Desc': 'جداول محسوبة ترفع الأداء وتحافظ على الزخم.',
        'method.point3': 'متابعة فورية عبر التطبيق',
        'method.point3Desc': 'تقارير أسبوعية، رسائل تحفيزية، وتعديلات دقيقة.',
        'method.point4': 'قياس واضح للنتائج',
        'method.point4Desc': 'لوحات رقمية تتابع التقدم وتوضح أين تتحسن.',
        'method.card.label': 'Performance Ledger',
        'method.card.metric1': 'الالتزام الأسبوعي',
        'method.card.metric2': 'تحسن اللياقة',
        'method.card.note': 'تقارير أسبوعية مع توصيات فورية لضمان استمرار النتائج.',
        'app.label': 'تجربة التطبيق',
        'app.title': 'الأداء في جيبك',
        'app.desc': 'واجهة رياضية متقدمة تعرض تقدمك، تغذيتك، ورسائل التحفيز في الوقت الحقيقي.',
        'app.point1': 'فيديوهات تدريب عالية الجودة',
        'app.point2': 'تتبع ذكي للأداء',
        'app.point3': 'خطط تغذية مخصصة',
        'app.point4': 'دعم خاص للنخبة',
        'app.card.metric1': 'جلسات هذا الأسبوع',
        'app.card.metric2': 'سعرات اليوم',
        'app.card.metric3': 'تقدم القوة',
        'stories.label': 'قصص النخبة',
        'stories.title': 'نتائج قوية لأصحاب الأداء العالي',
        'stories.person1': 'راشد العتيبي',
        'stories.person1Role': 'CEO - Challenge',
        'stories.quote1': '"خطة دقيقة، نتائج ملموسة خلال أسابيع. الفريق محترف بكل التفاصيل."',
        'stories.person2': 'سارة المالكي',
        'stories.person2Role': 'Founder - VIP',
        'stories.quote2': '"التزام عالي، متابعة شخصية، والنتائج تجاوزت توقعاتي."',
        'stories.person3': 'نورة القحطاني',
        'stories.person3Role': 'Entrepreneur - After Pregnancy',
        'stories.quote3': '"برنامج آمن وراقي. التوازن مثالي بين الأداء والصحة."',
        'stories.person4': 'لينا الغامدي',
        'stories.person4Role': 'Designer - Sculpt',
        'stories.quote4': '"تدرج واضح، ونتائج محسوبة بدون ضغط مبالغ فيه."',
        'stories.person5': 'جود الشمري',
        'stories.person5Role': 'Consultant - Burn',
        'stories.quote5': '"التزامي صار أسهل مع المتابعة اليومية والتقارير."',
        'stories.person6': 'سلمان الحربي',
        'stories.person6Role': 'CFO - Challenge',
        'stories.quote6': '"انضباط عالي وخطة دقيقة خلّت النتائج أسرع من المتوقع."',
        'stories.person7': 'ريم الزهراني',
        'stories.person7Role': 'Marketing - VIP',
        'stories.quote7': '"تفاصيل دقيقة ومتابعة قوية حسّنت أدائي في وقت قصير."',
        'final.title': 'جاهز تضاعف قوتك؟',
        'final.desc': 'احجز برنامجك الآن وانضم لصفوف النخبة.',
        'final.cta': 'احجز مكالمتك الآن',
        'footer.tagline': 'Elite Coaching',
        'programs.requirements': 'الشروط'
    },
    en: {
        'nav.tagline': 'Elite Coaching',
        'nav.programs': 'Programs',
        'nav.method': 'Method',
        'nav.app': 'App',
        'nav.stories': 'Success Stories',
        'nav.cta': 'Book Your Program',
        'hero.label': 'Elite Coach For High-Performance Athletes',
        'hero.line1': 'Transform Your Body',
        'hero.line2': 'Into Athletic Art',
        'hero.sub': 'Paid app-based programs for high performers. Hard structure, real-time follow-up, and athletic results.',
        'hero.ctaPrimary': 'Start The Challenge',
        'hero.ctaSecondary': 'Book Performance Review',
        'hero.stat1': '98% elite client discipline',
        'hero.stat2': 'Six paid athletic programs',
        'hero.card.label': 'First 30 Days',
        'hero.card.note': 'Strength & discipline surge',
        'hero.card.item1': 'Weekly progress reviews',
        'hero.card.item2': 'Personal nutrition protocol',
        'hero.card.item3': 'Smart app tracking',
        'stats.label1': 'Elite clients served',
        'stats.label2': 'Paid programs available',
        'stats.label3': 'Average client rating',
        'programs.label': 'Paid Programs',
        'programs.title': 'Choose Your Athletic Track',
        'programs.desc': 'Six high-performance tracks with strict requirements to maximize results.',
        'programs.filter1': 'Elite Tracks',
        'programs.filter2': 'Customization',
        'method.label': 'Training Method',
        'method.title': 'Neo Athletic, High Output',
        'method.desc': 'Performance coaching built on discipline. Every session has a target, every metric matters.',
        'method.point1': 'Deep body & lifestyle assessment',
        'method.point1Desc': 'Structured onboarding to ensure a precise plan from day one.',
        'method.point2': 'Aggressive training protocols',
        'method.point2Desc': 'Structured schedules that protect momentum and intensity.',
        'method.point3': 'Real-time app follow-up',
        'method.point3Desc': 'Weekly reports, motivation, and calibrated adjustments.',
        'method.point4': 'Clear result tracking',
        'method.point4Desc': 'Digital checkpoints that show exactly where you are improving.',
        'method.card.label': 'Performance Ledger',
        'method.card.metric1': 'Weekly adherence',
        'method.card.metric2': 'Fitness improvement',
        'method.card.note': 'Weekly reviews with precision recommendations.',
        'app.label': 'App Experience',
        'app.title': 'Performance On Your Phone',
        'app.desc': 'A high-performance interface showing progress, nutrition, and coach feedback in real time.',
        'app.point1': 'HD training videos',
        'app.point2': 'Smart performance tracking',
        'app.point3': 'Personalized nutrition plans',
        'app.point4': 'Elite support access',
        'app.card.metric1': 'Sessions this week',
        'app.card.metric2': 'Daily calories',
        'app.card.metric3': 'Strength gain',
        'stories.label': 'Elite Stories',
        'stories.title': 'Real Results For High Performers',
        'stories.person1': 'Rashed Alotaibi',
        'stories.person1Role': 'CEO - Challenge',
        'stories.quote1': '"A precise plan with immediate impact. Every detail feels premium."',
        'stories.person2': 'Sarah Almaliki',
        'stories.person2Role': 'Founder - VIP',
        'stories.quote2': '"High commitment, personal follow-up, and results beyond expectations."',
        'stories.person3': 'Noura Alqahtani',
        'stories.person3Role': 'Entrepreneur - After Pregnancy',
        'stories.quote3': '"Safe, elevated, and perfectly balanced for performance and wellbeing."',
        'stories.person4': 'Lina Alghamdi',
        'stories.person4Role': 'Designer - Sculpt',
        'stories.quote4': '"Clear progress, strong results, and zero overwhelm."',
        'stories.person5': 'Joud Alshammari',
        'stories.person5Role': 'Consultant - Burn',
        'stories.quote5': '"Daily follow-ups and reports made consistency effortless."',
        'stories.person6': 'Salman Alharbi',
        'stories.person6Role': 'CFO - Challenge',
        'stories.quote6': '"High discipline with a precise plan delivered fast wins."',
        'stories.person7': 'Reem Alzahrani',
        'stories.person7Role': 'Marketing - VIP',
        'stories.quote7': '"Sharp details and close follow-up boosted my performance quickly."',
        'final.title': 'Ready To Double Your Strength?',
        'final.desc': 'Book your program now and join the elite.',
        'final.cta': 'Book Your Call Now',
        'footer.tagline': 'Elite Coaching',
        'programs.requirements': 'Requirements'
    }
};

const programs = [
    {
        id: 1,
        nameAr: 'برنامج البداية',
        nameEn: 'Starter',
        price: '99',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'برنامج تأسيسي مناسب للمبتدئين أو اللي راجعين بعد انقطاع.',
        summaryEn: 'Foundation plan for beginners or those returning to training.',
        descriptionAr: 'يركز على بناء عادة التمرين، تحسين اللياقة، وتعلم الأساسيات بطريقة سهلة وآمنة بدون ضغط عالي.',
        descriptionEn: 'Build training consistency, improve fitness, and master fundamentals with a safe, pressure-free plan.',
        requirementsAr: [
            'مناسب للمبتدئ 100%',
            'الالتزام 3 أيام تدريب بالأسبوع على الأقل',
            'المشي اليومي 20-30 دقيقة (اختياري لكنه يسرّع النتائج)',
            'النوم 7 ساعات قدر الإمكان',
            'يمنع استخدام أوزان ثقيلة جدا في البداية',
            'النتائج تعتمد على الالتزام بالأكل والتمرين'
        ],
        requirementsEn: [
            'Beginner friendly',
            'Minimum 3 training days per week',
            'Daily 20-30 min walk (optional but accelerates results)',
            'Aim for 7 hours of sleep',
            'Avoid heavy weights at the start',
            'Results depend on nutrition and training commitment'
        ],
        tagAr: 'أساسيات',
        tagEn: 'Foundation'
    },
    {
        id: 2,
        nameAr: 'شد الجسم',
        nameEn: 'Toning',
        price: '149',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'برنامج شد ونحت للجسم يبرز العضلات بدون تضخيم كبير.',
        summaryEn: 'Tones and sculpts for a lean, athletic look.',
        descriptionAr: 'يركز على إبراز العضلات وتقليل الدهون لنتيجة مشدودة ومظهر رياضي متناسق.',
        descriptionEn: 'Highlights muscle definition while reducing fat for a refined athletic silhouette.',
        requirementsAr: [
            'الالتزام 4 أيام تدريب بالأسبوع',
            'التركيز على البروتين يوميا',
            'ممنوع إهمال تمارين الأرجل والبطن',
            'يفضل قياس الوزن والصور أسبوعيا',
            'لازم تكون التغذية بعجز بسيط'
        ],
        requirementsEn: [
            'Commit to 4 training days weekly',
            'Prioritize protein intake daily',
            'Do not skip legs or core training',
            'Weekly weight/photos tracking recommended',
            'Maintain a slight calorie deficit'
        ],
        tagAr: 'نحت',
        tagEn: 'Sculpt'
    },
    {
        id: 3,
        nameAr: 'حرق الدهون',
        nameEn: 'Burn',
        price: '149',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'برنامج حرق قوي وسريع لنتائج واضحة.',
        summaryEn: 'Aggressive fat loss with structured cardio + strength.',
        descriptionAr: 'يجمع بين تمارين المقاومة والكارديو مع نظام غذائي محسوب.',
        descriptionEn: 'Combines resistance training and cardio with a precise nutrition plan.',
        requirementsAr: [
            'الالتزام 5 أيام تدريب بالأسبوع',
            'الالتزام بالسعرات بدون عشوائية',
            'شرب 2.5-3 لتر ماء يوميا',
            'تجنب السكريات والمقليات قدر الإمكان',
            'خطوات يومية 8-12 ألف خطوة',
            'غير مناسب للإصابات القوية بدون استشارة'
        ],
        requirementsEn: [
            'Commit to 5 training days weekly',
            'Follow calorie targets precisely',
            'Drink 2.5-3L of water daily',
            'Limit sugars and fried foods',
            '8-12K steps daily',
            'Consult a doctor for injuries'
        ],
        tagAr: 'حرق قوي',
        tagEn: 'Burn'
    },
    {
        id: 4,
        nameAr: 'بعد الحمل',
        nameEn: 'After Pregnancy',
        price: '550',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'عودة آمنة بعد الحمل مع تركيز على الاستمرارية.',
        summaryEn: 'Safe return to training post-pregnancy.',
        descriptionAr: 'يساعد على تقوية الجسم وشد بسيط وتحسين اللياقة بدون ضغط على البطن أو الحوض.',
        descriptionEn: 'Strengthens the body and improves fitness without stressing the core or pelvis.',
        requirementsAr: [
            'موافقة الطبيب قبل البدء',
            '3 أيام تدريب خفيف بالأسبوع',
            'ممنوع القفز أو HIIT في البداية',
            'تركيز على الحوض والتنفس',
            'تغذية متوازنة دون عجز قوي للمرضعات',
            'أي ألم غير طبيعي = إيقاف فوري'
        ],
        requirementsEn: [
            'Doctor approval required',
            '3 light sessions per week',
            'No jumping or HIIT initially',
            'Focus on pelvic floor and breathing',
            'Balanced nutrition for nursing mothers',
            'Stop immediately with unusual pain'
        ],
        tagAr: 'آمن',
        tagEn: 'Safe'
    },
    {
        id: 5,
        nameAr: 'التحدي',
        nameEn: 'Challenge',
        price: '150',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'تحدي مكثف لمن يبحث عن نتائج سريعة.',
        summaryEn: 'High-intensity challenge for fast results.',
        descriptionAr: 'جدول مكثف وتمارين متنوعة مع نظام غذائي واضح.',
        descriptionEn: 'Intense schedule, diverse workouts, and a disciplined nutrition plan.',
        requirementsAr: [
            'الالتزام 6 أيام تدريب بالأسبوع',
            'التزام عالي بالأكل بدون غش كثير',
            'تصوير وقياسات بداية ونهاية',
            'يفضل مستوى متوسط فما فوق',
            'ممنوع الانقطاع أكثر من يومين',
            'استشارة طبية للحالات الصحية'
        ],
        requirementsEn: [
            'Train 6 days weekly',
            'Strict nutrition compliance',
            'Before/after measurements required',
            'Best for intermediate+ levels',
            'No more than 2 missed days',
            'Medical clearance for health issues'
        ],
        tagAr: 'تحدي',
        tagEn: 'Challenge'
    },
    {
        id: 6,
        nameAr: 'VIP برنامج خاص',
        nameEn: 'VIP Private',
        price: '600',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'خطة مخصصة بالكامل مع متابعة لصيقة.',
        summaryEn: 'Fully personalized plan with close follow-up.',
        descriptionAr: 'خطة تدريب وتغذية خاصة مع تعديل مستمر حسب النتائج.',
        descriptionEn: 'Customized training and nutrition with continuous adjustments.',
        requirementsAr: [
            'تسجيل الوزن والقياسات أسبوعيا',
            'إرسال تحديثات المتابعة حسب النظام',
            'الالتزام 4-6 أيام تدريب حسب الخطة',
            'التزام عالي بالتغذية',
            'تعديلات حسب السفر والظروف',
            'النتائج تعتمد على الجدية'
        ],
        requirementsEn: [
            'Weekly weight and measurements tracking',
            'Regular progress updates',
            '4-6 training days based on plan',
            'High nutrition compliance',
            'Plan adjusted for travel/life',
            'Results depend on consistency'
        ],
        tagAr: 'VIP',
        tagEn: 'VIP'
    }
];

let programsData = programs;

const programCovers = [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80'
];

function stripHtml(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function mapWooProduct(product) {
    if (!product || !product.name) return null;

    const image = product.images && product.images.length ? product.images[0].src : '';
    const price = product.price || product.regular_price || '';
    const currencyEn = product.currency || 'SAR';
    const currencyAr = product.currency_symbol || 'ر.س';

    const summary = stripHtml(product.short_description);
    const description = stripHtml(product.description);

    const attributes = Array.isArray(product.attributes) ? product.attributes : [];
    const requirements = attributes
        .flatMap((attr) => Array.isArray(attr.options) ? attr.options : [])
        .map((item) => stripHtml(item))
        .filter(Boolean);

    const tagName = (product.tags && product.tags[0] && product.tags[0].name) ||
        (product.categories && product.categories[0] && product.categories[0].name) ||
        '';

    return {
        id: product.id || String(Math.random()),
        nameAr: product.name,
        nameEn: product.name,
        price,
        currencyAr,
        currencyEn,
        summaryAr: summary,
        summaryEn: summary,
        descriptionAr: description,
        descriptionEn: description,
        requirementsAr: requirements.length ? requirements : [],
        requirementsEn: requirements.length ? requirements : [],
        tagAr: tagName,
        tagEn: tagName,
        image
    };
}

async function loadProgramsFromApi() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
        const response = await fetch(PROGRAMS_ENDPOINT, { signal: controller.signal });
        if (!response.ok) throw new Error(`Programs API error: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data) || !data.length) return;

        const mapped = data.map(mapWooProduct).filter(Boolean);
        if (!mapped.length) return;

        programsData = mapped;
        renderPrograms(programsData);
        initializeProgramsScroller();
    } catch (error) {
        console.warn('Programs API unavailable, using fallback data.', error);
    } finally {
        clearTimeout(timeoutId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        applyTheme(state.theme);
        applyLanguage(state.lang);
        renderPrograms(programsData);
        bindEvents();
        initializeAnimations();
        initializeCounters();
        loadProgramsFromApi();
    } catch (error) {
        console.error('Critical initialization error:', error);
        // Show error to user gracefully
        document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;"><div style="background:#fff;padding:2rem;border-radius:8px;max-width:500px;"><h3 style="color:#d32f2f;margin:0 0 1rem;">Error Loading Page</h3><p style="color:#333;margin:0;">An unexpected error occurred. Please refresh the page.</p></div></div>`;
    }
});

function bindEvents() {
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', () => {
            try {
                state.lang = state.lang === 'ar' ? 'en' : 'ar';
                try {
                    localStorage.setItem('lang', state.lang);
                } catch (e) {
                    console.warn('localStorage unavailable');
                }
                applyLanguage(state.lang);
                renderPrograms(programsData);
                // Re-initialize animations after DOM change
                setTimeout(() => {
                    if (window.gsap) {
                        gsap.killTweensOf('[data-reveal], [data-parallax], [data-mouse]');
                        initializeAnimations();
                    }
                }, 50);
            } catch (error) {
                console.error('Language toggle error:', error);
            }
        });
    }

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            try {
                state.theme = state.theme === 'dark' ? 'light' : 'dark';
                try {
                    localStorage.setItem('theme', state.theme);
                } catch (e) {
                    console.warn('localStorage unavailable for theme');
                }
                applyTheme(state.theme);
            } catch (error) {
                console.error('Theme toggle error:', error);
            }
        });
    }

    // Mobile menu close function
    const closeMenu = () => {
        if (elements.mobileMenu) {
            elements.mobileMenu.classList.add('hidden');
            elements.mobileToggle?.setAttribute('aria-expanded', 'false');
        }
    };

    // Mobile menu toggle with aria-expanded
    if (elements.mobileToggle && elements.mobileMenu) {
        elements.mobileToggle.addEventListener('click', () => {
            const isHidden = elements.mobileMenu.classList.toggle('hidden');
            elements.mobileToggle.setAttribute('aria-expanded', !isHidden);
        });
    }

    // Close menu on navigation
    document.querySelectorAll('#mobileMenu a, #mobileMenu button').forEach(el => {
        el.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('#mobileMenu')) {
            closeMenu();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            event.preventDefault();
            try {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    closeMenu();
                }
            } catch (error) {
                console.warn('Navigation error:', error);
            }
        });
    });

    [elements.heroPrimary, elements.heroSecondary, elements.navCTA].forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            try {
                const target = document.getElementById('final');
                if (!target) {
                    // Fallback to top of page if final section doesn't exist
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                closeMenu();
            } catch (error) {
                console.warn('Button click error:', error);
            }
        });
    });

    // Program card checkout buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-program]');
        if (!btn) return;

        try {
            const programId = btn.getAttribute('data-program');
            const program = programsData.find(p => p.id == programId);

            if (!program) {
                console.warn('Program not found:', programId);
                return;
            }

            // Prepare program data for checkout modal
            const checkoutData = {
                id: program.id,
                name: state.lang === 'ar' ? (program.nameAr || program.name) : (program.nameEn || program.name),
                price: program.price,
                currency: program.currency || 'SAR'
            };

            // Open checkout modal with program data
            if (typeof openCheckoutModal === 'function') {
                openCheckoutModal(checkoutData);
            } else {
                console.warn('Checkout modal not initialized');
            }
        } catch (error) {
            console.warn('Checkout modal error:', error);
        }
    });
}

// ================================================
// ERROR HANDLING & VALIDATION
// ================================================

/**
 * Safe DOM element getter with error handling
 */
function safeGetElement(id) {
    try {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Element with id "${id}" not found`);
        return el;
    } catch (error) {
        console.warn('Safe element access error:', error.message);
        return null;
    }
}



function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    if (elements.themeToggle) {
        elements.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

function applyLanguage(lang) {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    if (elements.langToggle) {
        elements.langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const text = translations[lang][key];
        if (text) {
            el.textContent = text;
        }
    });
}

function renderPrograms(list = programsData) {
    if (!elements.programsGrid) return;
    elements.programsGrid.innerHTML = '';

    const totalPrograms = list.length;
    list.forEach((program, index) => {
        const card = document.createElement('article');
        card.className = 'package-card card card--compact soft-lift snap-start shrink-0 w-[clamp(18rem,28vw,24rem)]';
        card.setAttribute('data-reveal', 'fade-up');
        card.setAttribute('data-mouse', '0.08');

        const title = state.lang === 'ar' ? program.nameAr : program.nameEn;
        const tag = state.lang === 'ar' ? program.tagAr : program.tagEn;
        const currency = state.lang === 'ar' ? program.currencyAr : program.currencyEn;
        const summary = state.lang === 'ar' ? program.summaryAr : program.summaryEn;
        const description = state.lang === 'ar' ? program.descriptionAr : program.descriptionEn;
        const requirements = state.lang === 'ar' ? program.requirementsAr : program.requirementsEn;
        const requirementsLabel = translations[state.lang]['programs.requirements'];
        const indexLabel = String(index + 1).padStart(2, '0');
        const totalLabel = String(totalPrograms).padStart(2, '0');
        const packageLabel = state.lang === 'ar'
            ? `باقة ${indexLabel} / ${totalLabel}`
            : `Package ${indexLabel} / ${totalLabel}`;
        const levelLabel = state.lang === 'ar' ? 'المستوى' : 'Level';
        const reqCountLabel = state.lang === 'ar' ? 'عدد الشروط' : 'Requirements';
        const isFeatured = program.tagEn?.toLowerCase() === 'vip' || program.nameEn?.toLowerCase().includes('vip');
        const ctaLabel = state.lang === 'ar' ? 'احجز هذه الباقة' : 'Reserve This Package';
        // Format price with Saudi Riyal SVG icon
        const priceLabel = currency === 'ر.س' || currency === 'SAR'
            ? `${SAR_ICON_SVG}${program.price}`
            : `${program.price} ${currency}`;
        const cover = program.image || program.cover || programCovers[index % programCovers.length];

        card.innerHTML = `
            <div class="relative z-10 flex flex-col gap-4 h-full">
                <div class="cover-frame">
                    <img class="h-44 w-full object-cover" src="${cover}" alt="${title}" loading="lazy" decoding="async">
                </div>
                <div class="flex-1 space-y-2">
                    <div class="flex items-center justify-between gap-3">
                        <h3 class="text-2xl font-black text-neutral-lightest">${title}</h3>
                        <span class="price-badge text-lg font-bold text-primary-green">${priceLabel}</span>
                    </div>
                    <p class="text-sm text-neutral-gray-light">${summary}</p>
                </div>
                <div class="neo-divider"></div>
                ${requirements && requirements.length ? `
                    <div class="space-y-3">
                        <p class="req-label text-xs uppercase tracking-[0.25em] text-primary-green">${requirementsLabel}</p>
                        <ul class="space-y-2 text-xs text-neutral-gray-light">
                            ${requirements.map(item => `
                                <li class="flex items-start gap-2">
                                    <i class="fas fa-check-circle mt-0.5 text-primary-green"></i>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                <button class="${isFeatured ? 'btn-primary' : 'btn-secondary'} w-full mt-auto" data-program="${program.id}">
                    ${ctaLabel}
                </button>
            </div>
        `;

        elements.programsGrid.appendChild(card);
    });
}

function initializeAnimations() {
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
    initializeProgramsScroller();
    initializeStoriesLoop();
}

// ================================================
// STATS STRIP COUNTERS
// ================================================

function initializeCounters() {
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

let programsScrollTween = null;
let storiesLoopTween = null;
let storiesLoopResizeBound = false;

let heroMarqueeTween = null;
let heroMarqueeResizeBound = false;

function initializeHeroMarquee() {
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

function initializeProgramsScroller() {
    const section = document.getElementById('programs');
    const track = document.getElementById('programsGrid');
    const pin = document.querySelector('.programs-pin');
    const header = document.querySelector('nav');
    if (!section || !track || !pin || !window.gsap) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setup = () => {
        if (programsScrollTween) {
            programsScrollTween.scrollTrigger?.kill();
            programsScrollTween.kill();
            programsScrollTween = null;
        }

        gsap.set(track, { x: 0 });

        if (prefersReduced) return;

        const scrollDistance = track.scrollWidth - pin.clientWidth;
        if (scrollDistance <= 0) return;

        const headerOffset = header ? header.offsetHeight : 0;
        const pinGap = 16;

        const dir = document.documentElement.getAttribute('dir') || 'ltr';
        const direction = dir.toLowerCase() === 'rtl' ? 1 : -1;

        const cardsCount = track.children.length || 1;

        programsScrollTween = gsap.to(track, {
            x: direction * scrollDistance,
            ease: 'none',
            scrollTrigger: {
                id: 'programs-scroll',
                trigger: pin,
                start: () => `top top+=${headerOffset + pinGap}`,
                end: () => `+=${scrollDistance}`,
                scrub: 1,
                snap: cardsCount > 1 ? 1 / (cardsCount - 1) : 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });
    };

    setup();

    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
        setup();
    });
}

function initializeStoriesLoop() {
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

// =========================================================
// LOADING ANIMATION
// =========================================================
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
});

// =========================================================
// CURSOR EFFECT (PREMIUM)
// =========================================================
try {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isTouchDevice) {
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

        const interactiveElements = document.querySelectorAll('a, button, .lux-card, .stat-pill, img');
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
    }
} catch (error) {
    console.warn('Cursor effect initialization failed:', error);
}

console.log('✅ SZAFIT Landing Page Ready');
