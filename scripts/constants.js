// ========================= CONSTANTS & DATA =========================
// Programs API endpoint - Local PHP endpoint serving CSV data
// Falls back to WooCommerce if available, but uses local API by default to avoid CORS/auth issues
export const PROGRAMS_ENDPOINT = '/api/programs.php';

// Saudi Riyal SVG icon (inherits current text color via CSS)
export const SAR_ICON_SVG = '<span class="sar-currency-symbol" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39"><path class="cls-1" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path class="cls-1" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg></span>';

// Program covers (fallback images)
export const PROGRAM_COVERS = [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80'
];

/**
 * EMBEDDED TEST DATA (CSV Programs - for offline/local testing)
 * 
 * Exact structure from CSV export, ready for mapWooProduct()
 * Used when API endpoints are unavailable (local file:// access or network issues)
 * 
 * This is production data that can be used for immediate testing
 */
export const EMBEDDED_PROGRAMS_DATA = [
    {
        id: 1,
        name: "Zero to Fit من الصفر إلى اللياقة",
        description: "برنامج تأسيسي مناسب للمبتدئين أو اللي راجعين بعد انقطاع. يركز على بناء عادة التمرين، تحسين اللياقة، وتعلم الأساسيات بطريقة سهلة وآمنة بدون ضغط عالي.\n\n📌 الشروط\n* مناسب للمبتدئ 100%\n* الالتزام 3 أيام تدريب بالأسبوع على الأقل\n* المشي اليومي 20–30 دقيقة (اختياري لكن يسرّع النتائج)\n* النوم 7 ساعات قدر الإمكان\n* يمنع استخدام أوزان ثقيلة جدًا في البداية\n* النتائج تعتمد على الالتزام بالأكل والتمرين",
        short_description: "برنامج تأسيسي مناسب للمبتدئين أو اللي راجعين بعد انقطاع.",
        price: "99",
        regular_price: "99",
        images: [{src: "https://z.szafit.com/wp-content/uploads/2026/02/1-new.webp"}],
        tags: [{name: "Foundation"}]
    },
    {
        id: 2,
        name: "Tone your Body نحت الجسم",
        description: "برنامج شد ونحت للجسم يركز على إبراز العضلات وتقليل الدهون بدون تضخيم كبير. اللي يبغون جسم مشدود ومظهر رياضي متناسق.\n\n📌 الشروط\n* الالتزام 4 أيام تدريب بالأسبوع\n* التركيز على البروتين يوميًا\n* ممنوع إهمال تمارين الأرجل والبطن\n* يفضل قياس الوزن + الصور كل أسبوع\n* لازم تكون التغذية \"عجز بسيط\" عشان يظهر الشد",
        short_description: "برنامج شد ونحت للجسم يركز على إبراز العضلات وتقليل الدهون بدون تضخيم كبير.",
        price: "149",
        regular_price: "149",
        images: [{src: "https://z.szafit.com/wp-content/uploads/2026/02/3-new.webp"}],
        tags: [{name: "Sculpt"}]
    },
    {
        id: 3,
        name: "Burn X الحرق المكثف",
        description: "برنامج حرق قوي وسريع يساعدك تنزل دهون بشكل واضح ويزيد نشاطك ولياقتك. يجمع بين تمارين المقاومة والكارديو مع نظام غذائي محسوب.\n\n📌 الشروط\n* الالتزام 5 أيام تدريب بالأسبوع\n* الالتزام بالسعرات (بدون عشوائية)\n* شرب ماء 2.5–3 لتر يوميًا\n* ممنوع السكريات العالية والمقليات قدر الإمكان\n* لازم خطوات يومية 8–12 ألف خطوة\n* غير مناسب لمن يعاني من إصابات قوية بدون استشارة",
        short_description: "برنامج حرق قوي وسريع يساعدك تنزل دهون بشكل واضح ويزيد نشاطك ولياقتك.",
        price: "149",
        regular_price: "149",
        images: [{src: "https://z.szafit.com/wp-content/uploads/2026/02/2-new.webp"}],
        tags: [{name: "Burn"}]
    },
    {
        id: 4,
        name: "VIP Fit Club",
        description: "برنامج شخصي كامل مخصص حسب جسمك وهدفك ووقتك. يتم فيه بناء خطة تدريب وتغذية خاصة فيك مع تعديل مستمر حسب النتائج. هذا البرنامج مناسب للي يبغى تغيير جذري ومتابعة قوية.\n\n📌 الشروط\n* الالتزام بتسجيل الوزن/القياسات أسبوعيًا\n* الالتزام بإرسال التحديثات والمتابعة (حسب نظامك)\n* الالتزام بالتمارين 4–6 أيام حسب الخطة\n* الالتزام بالتغذية بنسبة عالية\n* أي تغييرات (سفر/ظروف) يتم تعديل الخطة بناءً عليها\n* النتائج تعتمد على الجدية والاستمرارية",
        short_description: "برنامج شخصي كامل مخصص حسب جسمك وهدفك ووقتك.",
        price: "600",
        regular_price: "600",
        images: [{src: "https://z.szafit.com/wp-content/uploads/2026/02/4-new.webp"}],
        tags: [{name: "VIP"}]
    },
    {
        id: 5,
        name: "After Pregnancy بعد الحمل",
        description: "برنامج استعادة اللياقة المصمم خصيصًا للأمهات الجدد. يركز على تقوية عضلات البطن والحوض بأمان، واستعادة الطاقة والليونة تدريجيًا.\n\n📌 الشروط\n* يبدأ بعد موافقة الطبيب (6–8 أسابيع بعد الولادة)\n* الالتزام 3 أيام تدريب خفيف بالأسبوع\n* تركيز على التنفس والتمارين الوظيفية\n* يمنع رفع الأوزان الثقيلة في البداية\n* النوم والتغذية أساسيان لاستعادة الطاقة\n* يفضل متابعة الطبيب أول 3 أشهر",
        short_description: "برنامج استعادة اللياقة المصمم خصيصًا للأمهات الجدد بأمان وتدرج.",
        price: "129",
        regular_price: "129",
        images: [{src: "https://z.szafit.com/wp-content/uploads/2026/02/5-new.webp"}],
        tags: [{name: "Postpartum"}]
    },
    {
        id: 6,
        name: "Challenge التحدي",
        description: "برنامج تحدي مكثف لمدة 30 يوم يختبر قدراتك ويدفعك لأقصى حدودك. يجمع بين تمارين القوة والتحمل مع نظام غذائي صارم لنتائج سريعة وملموسة.\n\n📌 الشروط\n* الالتزام 6 أيام تدريب بالأسبوع\n* الالتزام التام بالسعرات والماكروز\n* شرب ماء 3 لتر يوميًا\n* ممنوع الغش أيام الراحة\n* يوميًا 10–15 ألف خطوة\n* غير مناسب للمبتدئين أو المصابين",
        short_description: "برنامج تحدي 30 يوم مكثف يختبر قدراتك ويدفعك لأقصى حدودك.",
        price: "199",
        regular_price: "199",
        images: [{src: "https://z.szafit.com/wp-content/uploads/2026/02/6-new.webp"}],
        tags: [{name: "Challenge"}]
    }
];

/**
 * FALLBACK DEFAULT PROGRAMS
 * 
 * Used ONLY if WooCommerce API fails or returns empty data.
 * In production, this should always be replaced by live API data.
 * 
 * Kept minimal to emphasize that API data is primary.
 * These are generic placeholders.
 */
export const DEFAULT_PROGRAMS = [
    {
        id: 'fallback-0',
        nameAr: 'برنامج تدريبي',
        nameEn: 'Training Program',
        price: '0',
        currencyAr: 'ر.س',
        currencyEn: 'SAR',
        summaryAr: 'جاري تحميل البرامج الحية من الخادم...',
        summaryEn: 'Loading live programs from server...',
        descriptionAr: 'عذراً، لم نتمكن من تحميل البيانات من الخادم الآن. يرجى التحقق من الاتصال بالإنترنت وإعادة تحميل الصفحة.',
        descriptionEn: 'Sorry, we could not load data from the server right now. Please check your internet connection and refresh the page.',
        requirementsAr: [],
        requirementsEn: [],
        tagAr: 'معلومة',
        tagEn: 'Info',
        image: PROGRAM_COVERS[0]
    }
];
