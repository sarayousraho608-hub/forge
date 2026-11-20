// ✏️ هنا تعدّلين معلوماتك الثابتة (غيّريها بحرية)
export const PROFILE = {
  fullName: 'SARA YOUSRA HOUDAN',
  email: 'sarayousraho608@gmail.com',
  github: 'https://github.com/sarayousraho608-hub',
  // ✏️ ضعي رابط ملفك الحقيقي: في تطبيق LinkedIn ← ملفك ← "مشاركة" ← نسخ الرابط
  linkedin: 'https://www.linkedin.com/in/YOUR-PROFILE',
  // اجعليها false عندما تكونين مشغولة. لاحقاً سنجلبها من الخادم.
  available: true,
  // الصور: ضعي الملفات داخل مجلد client/public بهذه الأسماء
  avatar: '/me.jpg',        // صورتك الرئيسية (دائرة في أعلى الصفحة)
  aboutPhoto: '/about.jpg', // صورة قسم "من أنا"
};

// السر الثالث: كلمة مخبّأة في نبذة "من أنا" (في translations.js: aboutP1).
// من يجدها ويكتبها للمساعد يكشف السر. (مؤقت: غداً ننقل التحقق إلى الخادم حتى لا تظهر في الكود.)
// مشروع 1 فقط (بلا خادم): الكلمة السرية. مع الخادم تبقى فارغة لأن الخادم هو من يتحقق.
export const SECRET_WORDS = import.meta.env.VITE_USE_API === 'true' ? [] : ['فن', 'الفن', 'art'];
