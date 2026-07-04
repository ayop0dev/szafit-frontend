import type {
    WpAboutPage,
    WpContactPage,
    WpPrivacyPage,
    WpTermsPage,
    WpThankYouPage,
} from '../../types/wp';

export const fallbackAbout: WpAboutPage = {
    titleAr: 'من نحن',
    titleEn: 'About Us',
    bodyAr: '<p>SZAFIT منصة لياقة بدنية احترافية تقدم برامج تدريبية وغذائية مخصصة تحت إشراف كوتش سزا.</p><p>أكثر من 1,200 عميلة حققن نتائج حقيقية بمنهجية علمية وتدريب شخصي رفيع المستوى.</p>',
    bodyEn: '<p>SZAFIT is a professional fitness platform offering customized training and nutrition programs under the supervision of Coach SZA.</p><p>Over 1,200 women have achieved real results with our scientific methodology and high-level personal training.</p>',
    ctaLabelAr: 'تصفح البرامج',
    ctaLabelEn: 'Browse Programs',
};

export const fallbackContact: WpContactPage = {
    titleAr: 'اتصل بنا',
    titleEn: 'Contact Us',
    bodyAr: 'يسعدنا التواصل معك للإجابة على استفساراتك أو لمساعدتك في اختيار البرنامج المناسب لهدفك.',
    bodyEn: 'We are happy to answer your inquiries or help you choose the right program for your goals.',
    whatsappLabelAr: 'راسلنا على واتساب',
    whatsappLabelEn: 'Contact on WhatsApp',
};

export const fallbackPrivacy: WpPrivacyPage = {
    titleAr: 'سياسة الخصوصية',
    titleEn: 'Privacy Policy',
    bodyAr: `
      <h2>جمع البيانات</h2>
      <p>نحن في SZAFIT نلتزم بحماية خصوصيتك وبياناتك الشخصية. يتم جمع المعلومات الأساسية اللازمة فقط لتقديم أفضل خدمة ممكنة.</p>
      <h2>بيانات الدفع والطلبات</h2>
      <p>يتم التعامل مع بيانات الدفع بأعلى معايير الأمان، ولا نقوم بتخزين تفاصيل بطاقاتك الائتمانية في خوادمنا بأي شكل من الأشكال.</p>
      <h2>الوصول للتطبيق</h2>
      <p>يستخدم التطبيق بياناتك لتقديم تجربة مخصصة لك فقط، ولا يتم مشاركة بياناتك مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة.</p>
      <h2>ملفات تعريف الارتباط</h2>
      <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع وجمع بيانات إحصائية غير محددة للهوية.</p>
      <h2>تواصل معنا</h2>
      <p>لأي استفسارات بخصوص الخصوصية وكيفية استخدام بياناتك، تواصل معنا عبر صفحة الاتصال.</p>
    `,
    bodyEn: `
      <h2>Data Collection</h2>
      <p>At SZAFIT, we are committed to protecting your privacy and personal data. We only collect essential information required to provide the best possible service.</p>
      <h2>Payment and Order Data</h2>
      <p>Payment data is handled with the highest security standards, and we do not store your credit card details on our servers in any form.</p>
      <h2>App Access</h2>
      <p>The app uses your data to provide a personalized experience and does not share it with third parties for marketing purposes without your explicit consent.</p>
      <h2>Cookies and Analytics</h2>
      <p>We use cookies to improve your experience on our website and to collect aggregated statistical data.</p>
      <h2>Contact Us</h2>
      <p>For any privacy-related inquiries and how your data is used, please contact us via the contact page.</p>
    `,
};

export const fallbackTerms: WpTermsPage = {
    titleAr: 'الشروط والأحكام',
    titleEn: 'Terms and Conditions',
    bodyAr: `
      <h2>شراء البرامج</h2>
      <p>باستخدامك للموقع وشراء البرامج فإنك توافق على الشروط والأحكام المذكورة. يحق للمنصة تعديل هذه الشروط في أي وقت.</p>
      <h2>الوصول للتطبيق</h2>
      <p>يتم تفعيل الوصول للتطبيق بعد تأكيد الدفع بنجاح. اشتراكك مخصص للاستخدام الشخصي فقط ولا يُسمح بمشاركته مع الآخرين.</p>
      <h2>بوابة الدفع</h2>
      <p>تتم المعاملات المالية عبر بوابة دفع مؤمنة. قد يطلب مزود الدفع بعض التحققات الإضافية حسب متطلباته.</p>
      <h2>مسؤولية المستخدم</h2>
      <p>أنت مسؤول بالكامل عن صحة البيانات المدخلة وتلتزم باتباع تعليمات البرنامج على مسؤوليتك الطبية الشخصية.</p>
      <h2>الاسترجاع والإلغاء</h2>
      <p>نظراً لطبيعة المنتجات الرقمية، فإن البرامج المباعة غير قابلة للاسترداد نهائياً بعد بدء الوصول إليها.</p>
      <h2>تواصل معنا</h2>
      <p>لأي استفسارات بخصوص الشروط والأحكام، نرجو منك التواصل معنا عبر صفحة الاتصال.</p>
    `,
    bodyEn: `
      <h2>Program Purchase</h2>
      <p>By using the site and purchasing programs, you agree to the stated terms and conditions. The platform reserves the right to modify these terms at any time.</p>
      <h2>App Access</h2>
      <p>App access is activated after successful payment confirmation. Your subscription is for personal use only and may not be shared.</p>
      <h2>Payment Gateway</h2>
      <p>Payments are processed through the configured payment gateway. Some orders may require additional verification depending on the provider and risk checks.</p>
      <h2>User Responsibility</h2>
      <p>You are fully responsible for the accuracy of entered data and commit to following program instructions at your own medical risk.</p>
      <h2>Refunds and Cancellations</h2>
      <p>Due to the nature of digital products, sold programs are strictly non-refundable once access has begun.</p>
      <h2>Contact Us</h2>
      <p>For any inquiries regarding the terms and conditions, please reach out via the contact page.</p>
    `,
};

export const fallbackThankYou: WpThankYouPage = {
    headingAr: 'شكراً!',
    subheadingAr: 'تم استقبال طلبك بنجاح',
    bodyAr: 'سيتم التواصل معك قريبًا لتأكيد البرنامج والبدء في رحلتك.',
    nextStepsAr: [
        'تأكيد البريد الإلكتروني إن كان مُدخلًا',
      'إتمام الدفع عبر بوابة الدفع الآمنة',
        'الوصول إلى التطبيق والبدء في رحلتك',
    ],
    whatsappLabelAr: 'تواصل عبر واتساب',
    appDownloadLabelAr: 'حمل التطبيق الآن',
    headingEn: 'Thank You!',
    subheadingEn: 'Your order was received successfully',
    bodyEn: 'We will contact you shortly to confirm your program and start your journey.',
    nextStepsEn: [
      'Confirm your email if provided',
      'Complete payment through the secure gateway',
      'Access the app and begin your journey',
    ],
    whatsappLabelEn: 'Contact on WhatsApp',
    appDownloadLabelEn: 'Download App Now',
};
