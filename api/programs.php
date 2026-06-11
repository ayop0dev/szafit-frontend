<?php
/**
 * API Endpoint: /api/programs.php
 * 
 * Serves training program data from CSV or hardcoded source
 * Returns JSON array of WooCommerce-formatted products
 * 
 * CORS: Enabled for all origins
 * Auth: Public (no authentication required)
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Training programs data (matching CSV structure)
$programs = [
    [
        "id" => 1,
        "name" => "Zero to Fit من الصفر إلى اللياقة",
        "description" => "برنامج تأسيسي مناسب للمبتدئين أو اللي راجعين بعد انقطاع. يركز على بناء عادة التمرين، تحسين اللياقة، وتعلم الأساسيات بطريقة سهلة وآمنة بدون ضغط عالي.\n\n📌 الشروط\n* مناسب للمبتدئ 100%\n* الالتزام 3 أيام تدريب بالأسبوع على الأقل\n* المشي اليومي 20–30 دقيقة (اختياري لكن يسرّع النتائج)\n* النوم 7 ساعات قدر الإمكان\n* يمنع استخدام أوزان ثقيلة جدًا في البداية\n* النتائج تعتمد على الالتزام بالأكل والتمرين",
        "short_description" => "برنامج تأسيسي مناسب للمبتدئين أو اللي راجعين بعد انقطاع.",
        "price" => "99",
        "regular_price" => "99",
        "images" => [
            ["src" => "https://z.szafit.com/wp-content/uploads/2026/02/1-new.webp"]
        ],
        "tags" => [
            ["name" => "Foundation"]
        ]
    ],
    [
        "id" => 2,
        "name" => "Tone your Body نحت الجسم",
        "description" => "برنامج شد ونحت للجسم يركز على إبراز العضلات وتقليل الدهون بدون تضخيم كبير. اللي يبغون جسم مشدود ومظهر رياضي متناسق.\n\n📌 الشروط\n* الالتزام 4 أيام تدريب بالأسبوع\n* التركيز على البروتين يوميًا\n* ممنوع إهمال تمارين الأرجل والبطن\n* يفضل قياس الوزن + الصور كل أسبوع\n* لازم تكون التغذية \"عجز بسيط\" عشان يظهر الشد",
        "short_description" => "برنامج شد ونحت للجسم يركز على إبراز العضلات وتقليل الدهون بدون تضخيم كبير.",
        "price" => "149",
        "regular_price" => "149",
        "images" => [
            ["src" => "https://z.szafit.com/wp-content/uploads/2026/02/3-new.webp"]
        ],
        "tags" => [
            ["name" => "Sculpt"]
        ]
    ],
    [
        "id" => 3,
        "name" => "Burn X الحرق المكثف",
        "description" => "برنامج حرق قوي وسريع يساعدك تنزل دهون بشكل واضح ويزيد نشاطك ولياقتك. يجمع بين تمارين المقاومة والكارديو مع نظام غذائي محسوب.\n\n📌 الشروط\n* الالتزام 5 أيام تدريب بالأسبوع\n* الالتزام بالسعرات (بدون عشوائية)\n* شرب ماء 2.5–3 لتر يوميًا\n* ممنوع السكريات العالية والمقليات قدر الإمكان\n* لازم خطوات يومية 8–12 ألف خطوة\n* غير مناسب لمن يعاني من إصابات قوية بدون استشارة",
        "short_description" => "برنامج حرق قوي وسريع يساعدك تنزل دهون بشكل واضح ويزيد نشاطك ولياقتك.",
        "price" => "149",
        "regular_price" => "149",
        "images" => [
            ["src" => "https://z.szafit.com/wp-content/uploads/2026/02/2-new.webp"]
        ],
        "tags" => [
            ["name" => "Burn"]
        ]
    ],
    [
        "id" => 4,
        "name" => "VIP Fit Club",
        "description" => "برنامج شخصي كامل مخصص حسب جسمك وهدفك ووقتك. يتم فيه بناء خطة تدريب وتغذية خاصة فيك مع تعديل مستمر حسب النتائج. هذا البرنامج مناسب للي يبغى تغيير جذري ومتابعة قوية.\n\n📌 الشروط\n* الالتزام بتسجيل الوزن/القياسات أسبوعيًا\n* الالتزام بإرسال التحديثات والمتابعة (حسب نظامك)\n* الالتزام بالتمارين 4–6 أيام حسب الخطة\n* الالتزام بالتغذية بنسبة عالية\n* أي تغييرات (سفر/ظروف) يتم تعديل الخطة بناءً عليها\n* النتائج تعتمد على الجدية والاستمرارية",
        "short_description" => "برنامج شخصي كامل مخصص حسب جسمك وهدفك ووقتك.",
        "price" => "600",
        "regular_price" => "600",
        "images" => [
            ["src" => "https://z.szafit.com/wp-content/uploads/2026/02/4-new.webp"]
        ],
        "tags" => [
            ["name" => "VIP"]
        ]
    ],
    [
        "id" => 5,
        "name" => "After Pregnancy بعد الحمل",
        "description" => "برنامج استعادة اللياقة المصمم خصيصًا للأمهات الجدد. يركز على تقوية عضلات البطن والحوض بأمان، واستعادة الطاقة والليونة تدريجيًا.\n\n📌 الشروط\n* يبدأ بعد موافقة الطبيب (6–8 أسابيع بعد الولادة)\n* الالتزام 3 أيام تدريب خفيف بالأسبوع\n* تركيز على التنفس والتمارين الوظيفية\n* يمنع رفع الأوزان الثقيلة في البداية\n* النوم والتغذية أساسيان لاستعادة الطاقة\n* يفضل متابعة الطبيب أول 3 أشهر",
        "short_description" => "برنامج استعادة اللياقة المصمم خصيصًا للأمهات الجدد بأمان وتدرج.",
        "price" => "129",
        "regular_price" => "129",
        "images" => [
            ["src" => "https://z.szafit.com/wp-content/uploads/2026/02/5-new.webp"]
        ],
        "tags" => [
            ["name" => "Postpartum"]
        ]
    ],
    [
        "id" => 6,
        "name" => "Challenge التحدي",
        "description" => "برنامج تحدي مكثف لمدة 30 يوم يختبر قدراتك ويدفعك لأقصى حدودك. يجمع بين تمارين القوة والتحمل مع نظام غذائي صارم لنتائج سريعة وملموسة.\n\n📌 الشروط\n* الالتزام 6 أيام تدريب بالأسبوع\n* الالتزام التام بالسعرات والماكروز\n* شرب ماء 3 لتر يوميًا\n* ممنوع الغش أيام الراحة\n* يوميًا 10–15 ألف خطوة\n* غير مناسب للمبتدئين أو المصابين",
        "short_description" => "برنامج تحدي 30 يوم مكثف يختبر قدراتك ويدفعك لأقصى حدودك.",
        "price" => "199",
        "regular_price" => "199",
        "images" => [
            ["src" => "https://z.szafit.com/wp-content/uploads/2026/02/6-new.webp"]
        ],
        "tags" => [
            ["name" => "Challenge"]
        ]
    ]
];

// Return as JSON
http_response_code(200);
echo json_encode($programs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit;
?>