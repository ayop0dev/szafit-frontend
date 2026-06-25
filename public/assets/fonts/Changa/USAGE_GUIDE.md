# دليل استخدام خط Changa في SZAFIT

## نظرة عامة
تم استبدال Google Fonts (Cairo, Tajawal, Poppins) بخط **Changa** المحلي لتحسين الأداء وسرعة التحميل.

## الملفات المتاحة

### Variable Font (موصى به)
- `Changa-VariableFont_wght.ttf`
- يدعم جميع الأوزان من 200 إلى 800 بشكل ديناميكي
- حجم ملف واحد بدلاً من 7 ملفات
- مدعوم في معظم المتصفحات الحديثة

### Static Fonts (احتياطي)
للمتصفحات القديمة - كل وزن في ملف منفصل:
- ExtraLight (200)
- Light (300)
- Regular (400)
- Medium (500)
- SemiBold (600)
- Bold (700)
- ExtraBold (800)

## خريطة استخدام الأوزان

### ExtraLight (200)
- **الاستخدام**: نصوص خفيفة جداً، decorative text
- **مثال**: لا يستخدم حالياً في التصميم

### Light (300)
- **الاستخدام**: نصوص ثانوية، descriptions
- **CSS Variable**: `--font-weight-light: 300`
- **أمثلة**:
  - `.hero-description`
  - `.section-subtitle`
  - Secondary paragraphs

### Regular (400)
- **الاستخدام**: النصوص الأساسية
- **CSS Variable**: `--font-weight-regular: 400`
- **أمثلة**:
  - `<p>` tags
  - Body text
  - List items

### Medium (500)
- **الاستخدام**: تأكيد خفيف، روابط
- **CSS Variable**: `--font-weight-medium: 500`
- **أمثلة**:
  - Links (`<a>`)
  - Feature descriptions
  - Subtle emphasis

### SemiBold (600)
- **الاستخدام**: عناوين فرعية، أزرار
- **CSS Variable**: `--font-weight-semibold: 600`
- **أمثلة**:
  - `<h3>` headings
  - `<h4>` headings
  - `.btn` buttons
  - `.hero-badge`

### Bold (700)
- **الاستخدام**: عناوين رئيسية
- **CSS Variable**: `--font-weight-bold: 700`
- **أمثلة**:
  - `<h2>` headings
  - `<h1>, <h2>, <h3>` default
  - `.navbar-logo h1`
  - Section titles

### ExtraBold (800)
- **الاستخدام**: عناوين كبيرة جداً (Hero)
- **CSS Variable**: `--font-weight-extrabold: 800`
- **أمثلة**:
  - `<h1>` main hero title
  - `.hero-title`
  - Large display text

## التكامل مع التصميم

### في CSS
```css
/* تم تعريف الخط في جميع المتغيرات */
--font-display: 'Changa', -apple-system, ...;
--font-heading: 'Changa', -apple-system, ...;
--font-primary: 'Changa', -apple-system, ...;
--font-secondary: 'Changa', -apple-system, ...;
```

### ترتيب التحميل في HTML
```html
<!-- 1. تحميل الخطوط أولاً -->
<link rel="stylesheet" href="css/fonts.css">

<!-- 2. ثم باقي ملفات CSS -->
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/dark-theme.css">
<link rel="stylesheet" href="css/animations.css">
```

## مميزات الأداء

### قبل التحديث
- ✗ تحميل من Google Fonts (external request)
- ✗ 3 عائلات خطوط مختلفة (Cairo, Tajawal, Poppins)
- ✗ Network latency
- ✗ FOUT (Flash of Unstyled Text)

### بعد التحديث
- ✓ تحميل محلي (faster)
- ✓ عائلة خط واحدة (Changa)
- ✓ Variable font (حجم أصغر)
- ✓ font-display: swap (تجربة أفضل)
- ✓ تحكم كامل في الخطوط

## الاختبار

تأكد من اختبار:
1. ✓ تحميل الخط في جميع المتصفحات
2. ✓ ظهور الأوزان المختلفة بشكل صحيح
3. ✓ Dark mode و Light mode
4. ✓ Responsive design على جميع الأحجام
5. ✓ Performance (سرعة التحميل)

## المتصفحات المدعومة

### Variable Font
- Chrome 62+
- Firefox 62+
- Safari 11+
- Edge 79+

### Static Fonts (Fallback)
- جميع المتصفحات (حتى القديمة)
- IE 11
- Opera Mini

## ملاحظات

- يتم تحميل Variable Font أولاً للمتصفحات الحديثة
- Static Fonts تعمل كـ fallback تلقائياً
- `font-display: swap` يمنع FOIT ويعرض النص فوراً
- الخط يدعم العربية بشكل كامل مع جميع الحركات
