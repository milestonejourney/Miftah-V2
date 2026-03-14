// ============================================================
// I18N — Miftah
// All UI strings in three languages. t() for translation lookup.
// JS sets data-lang on <html> only. CSS handles font + direction.
//
// Depends on: store.js (loadLang, saveLang)
// ============================================================

const STRINGS = {
  // Auth
  email_label:          ['Email Address',          'ای میل',               'ई-मेल'],
  password_label:       ['Password',               'پاس ورڈ',              'पासवर्ड'],
  confirm_password:     ['Confirm Password',        'پاس ورڈ دوبارہ',       'पासवर्ड दोबारा'],
  sign_in_btn:          ['Sign In →',               'لاگ ان کریں →',        'लॉग इन करें →'],
  create_account_btn:   ['Create Account →',        'اکاؤنٹ بنائیں →',      'अकाउंट बनाएं →'],
  send_reset_btn:       ['Send Reset Link →',       'ری سیٹ لنک بھیجیں →', 'रीसेट लिंक भेजें →'],
  create_account_link:  ['Create an account',       'اکاؤنٹ بنائیں',        'अकाउंट बनाएं'],
  already_have:         ['Already have an account?','پہلے سے اکاؤنٹ ہے؟',  'पहले से अकाउंट है?'],
  sign_in_link:         ['Sign in',                 'لاگ ان کریں',          'लॉग इन करें'],
  forgot_password:      ['Forgot password?',        'پاس ورڈ بھول گئے؟',   'पासवर्ड भूल गए?'],
  back_to_signin:       ['← Back to Sign In',       '← واپس لاگ ان',        '← वापस लॉग इन'],
  please_wait:          ['Please wait…',            'تھوڑا انتظار کریں…',   'थोड़ा इंतज़ार करें…'],
  sign_out:             ['Sign out',                'لاگ آؤٹ',              'लॉग आउट'],
  check_email_title:    ['Check your email',        'ای میل چیک کریں',      'ई-मेल चेक करें'],
  check_email_text:     ['We sent a confirmation link to', 'ہم نے تصدیقی لنک بھیجا', 'हम ने तस्दीक़ी लिंक भेजा'],
  confirm_then_signin:  ['Click it to activate your account, then come back to sign in.', 'اسے کلک کریں اور پھر لاگ ان کریں۔', 'उसे क्लिक करें और फिर लॉग इन करें।'],
  reset_sent_title:     ['Reset link sent',         'ری سیٹ لنک بھیج دیا', 'रीसेट लिंक भेज दिया'],
  reset_sent_text:      ['We sent a password reset link to', 'ہم نے پاس ورڈ ری سیٹ لنک بھیجا', 'हम ने पासवर्ड रीसेट लिंक भेजा'],
  reset_check_inbox:    ['Check your inbox and follow the link to reset your password.', 'ان باکس دیکھیں اور لنک سے پاس ورڈ بدلیں۔', 'इनबॉक्स देखें और लिंक से पासवर्ड बदलें।'],

  // App brand + tagline
  tagline:              ['Your key to deeper Quranic study', 'قرآن کو گہرائی سے سمجھنے کی چابی', 'क़ुरआन को गहराई से समझने की चाबी'],

  // Heart filter
  heart_filter_before:  ['Before you begin',       'شروع کرنے سے پہلے',    'शुरू करने से पहले'],
  heart_filter_journal: ['This will be the opening entry in your Study Journal.', 'یہ آپ کے مطالعہ جرنل کی پہلی سطر ہوگی۔', 'यह आपके मुताला जर्नल की पहली सतर होगी।'],
  begin_session:        ['Begin Study Session',    'مطالعہ شروع کریں',     'मुताला शुरू करें'],

  // Journey completion
  journey_complete:     ['Journey Complete',       'سفر مکمل',             'सफ़र मुकम्मल'],
  journey_complete_body:['You have studied all 30 ayahs through all 5 lenses. This is no small thing. Your journal now holds a complete record of this journey.', 'آپ نے تمام ۳۰ آیات کو پانچوں عدسوں سے پڑھا۔ یہ معمولی بات نہیں۔ آپ کا جرنل اس پورے سفر کا ریکارڈ ہے۔', 'आपने सभी ३० आयात को पाँचों नज़रियों से पढ़ा। यह मामूली बात नहीं। आपका जर्नल इस पूरे सफ़र का रिकॉर्ड है।'],
  journey_final_cta:    ['Head to the Journal to write your Final Reflection — the closing entry of this journey.', 'جرنل میں جائیں اور آخری خیالات لکھیں — اس سفر کا آخری باب۔', 'जर्नल में जाएं और आखिरी ख़्यालात लिखें — इस सफ़र का आखिरी बाब।'],
  continue_studying:    ['Continue Studying',      'مطالعہ جاری رکھیں',    'मुताला जारी रखें'],
  open_journal:         ['Open Journal ✦',         'جرنل کھولیں ✦',        'जर्नल खोलें ✦'],

  // Onboarding
  ob_welcome:           ['Welcome to Miftah',      'مِفتَاح میں خوش آمدید', 'मिफ़्ताह में ख़ुश आमदीद'],
  ob_subtitle:          ['A different way to engage with the Quran', 'قرآن سے جڑنے کا ایک نیا انداز', 'क़ुरआन से जुड़ने का एक नया अंदाज़'],
  ob_desc:              ['Miftah is a study companion for intermediate Arabic students who want to go beyond translation — into grammar, tafsir, personal reflection, and memorisation. Built around the methodology of Ustadh Nouman Ali Khan\'s 5 Lenses framework from Bayyinah.', 'مِفتَاح ان لوگوں کے لیے ہے جو ترجمے سے آگے بڑھنا چاہتے ہیں — گرامر، تفسیر، ذاتی غور و فکر اور حفظ تک۔ بیّنہ کے استاد نعمان علی خان کے پانچ عدسوں کے طریقے پر بنایا گیا ہے۔', 'मिफ़्ताह उन लोगों के लिए है जो तर्जुमे से आगे बढ़ना चाहते हैं — ग्रामर, तफ़सीर, ज़ाती ग़ौर-ओ-फ़िक्र और हिफ़्ज़ तक। बय्यिनह के उस्ताद नोमान अली ख़ान के पाँच नज़रियों के तरीक़े पर बनाया गया है।'],
  ob_heart_quote:       ['"All study passes through a filter that makes it meaningful or renders it useless. That filter is the heart. Our tadabbur proceeds from faith and readiness to receive guidance."', '"ہر مطالعہ ایک فلٹر سے گزرتا ہے جو اسے بامعنی یا بے کار بناتا ہے۔ وہ فلٹر دل ہے۔ ہمارا تدبر ایمان اور ہدایت پانے کی تیاری سے شروع ہوتا ہے۔"', '"हर मुताला एक फ़िल्टर से गुज़रता है जो उसे बामअना या बेकार बनाता है। वह फ़िल्टर दिल है। हमारा तदब्बुर ईमान और हिदायत पाने की तैयारी से शुरू होता है।"'],
  ob_methodology:       ['The Methodology',        'طریقہ کار',             'तरीक़ा-ए-कार'],
  ob_5lenses:           ['5 Lenses to reflect upon the Quran', 'قرآن پر غور کرنے کے ۵ طریقے', 'क़ुरआन पर ग़ौर करने के ५ तरीक़े'],
  ob_5lenses_desc:      ['Each ayah can be explored through five distinct lenses. One tab, one focus at a time.', 'ہر آیت کو پانچ مختلف نظروں سے دیکھا جا سکتا ہے۔ ایک وقت میں ایک نظریہ۔', 'हर आयत को पाँच अलग नज़रों से देखा जा सकता है। एक वक़्त में एक नज़रिया।'],
  ob_back:              ['← Back',                 '← واپس',               '← वापस'],
  ob_next:              ['Let\'s begin →',          'آگے چلیں →',           'आगे चलें →'],
  ob_ready:             ['Ready',                  'تیار ہیں؟',             'तैयार हैं?'],
  ob_pace:              ['30 ayahs. 5 lenses each. Your notes saved as you go. Work at your pace. Return anytime. The Quran is patient.', '۳۰ آیات۔ ہر ایک کے ۵ عدسے۔ نوٹس محفوظ ہوتے جائیں گے۔ اپنی رفتار سے چلیں۔ کبھی بھی واپس آئیں۔ قرآن صبر والا ہے۔', '३० आयात। हर एक के ५ नज़रिए। नोट्स महफ़ूज़ होते जाएंगे। अपनी रफ़्तार से चलें। कभी भी वापस आएं। क़ुरआन सब्र वाला है।'],
  ob_open_surah:        ['Open the Surah ✦',       'سورۃ کھولیں ✦',        'सूरह खोलें ✦'],

  // Lens names
  lens1_name:           ['Wording',                'الفاظ',                 'अल्फ़ाज़'],
  lens2_name:           ['World',                  'قرآن کی دنیا',          'क़ुरआन की दुनिया'],
  lens3_name:           ['My Exp.',                'میرا تجربہ',            'मेरा तजरुबा'],
  lens4_name:           ['Connections',            'تعلقات',                'ताल्लुक़ात'],
  lens5_name:           ['Lessons',                'سبق',                   'सबक़'],
  lens1_desc:           ['Grammar, morphology, i\'rab, and why Allah chose this word here.', 'گرامر، صرف و نحو، اعراب — اللہ نے یہ لفظ یہاں کیوں چنا؟', 'ग्रामर, सर्फ़-ओ-नह्व, इराब — अल्लाह ने यह लफ़्ज़ यहाँ क्यों चुना?'],
  lens2_desc:           ['Context of revelation, history, and the world of creation.', 'نزول کا پس منظر، تاریخ اور کائنات کی دنیا۔', 'नुज़ूल का पस-मंज़र, तारीख़ और कायनात की दुनिया।'],
  lens3_desc:           ['Personal reflection — how the Quran holds a mirror to you.', 'ذاتی غور و فکر — قرآن آپ کو آئینہ کیسے دکھاتا ہے؟', 'ज़ाती ग़ौर-ओ-फ़िक्र — क़ुरआन आपको आईना कैसे दिखाता है?'],
  lens4_desc:           ['Related ayat, surah themes, hadith and seerah connections.', 'متعلقہ آیات، سورہ کے موضوعات، حدیث اور سیرت کے رابطے۔', 'मुताल्लिक़ आयात, सूरह के मौज़ूआत, हदीस और सीरत के रिश्ते।'],
  lens5_desc:           ['The universal principle — the fact of life Allah is teaching you here.', 'کائناتی اصول — وہ حقیقتِ زندگی جو اللہ یہاں سکھا رہا ہے۔', 'कायनाती उसूल — वह हक़ीक़त-ए-ज़िंदगी जो अल्लाह यहाँ सिखा रहा है।'],

  // Overview — non-surah-specific
  overview_complete:    ['Complete',               'مکمل',                  'मुकम्मल'],

  // Study page
  recite:               ['▶ Recite',               '▶ تلاوت',               '▶ तिलावत'],
  study_mode:           ['Study Mode',             'مطالعہ موڈ',            'मुताला मोड'],
  save_vocab:           ['Save to Vocab',          'الفاظ میں شامل کریں',   'अल्फ़ाज़ में शामिल करें'],
  detailed_commentary:  ['Detailed Commentary',    'تفصیلی تفسیر',          'तफ़सीली तफ़सीर'],
  ayah_of:              [' of ',                   ' میں سے ',              ' में से '],
  saved_indicator:      ['✓ Saved',                '✓ محفوظ',               '✓ महफ़ूज़'],
  tafsir_label:         ['Tafsir',                 'تفسیر',                 'तफ़सीर'],
  notes_label:          ['Notes',                  'نوٹس',                  'नोट्स'],

  // Notes placeholders
  lens1_placeholder:    ['My Grammatical Notes',               'میری گرامر کی نوٹس',          'मेरी ग्रामर की नोट्स'],
  lens2_placeholder:    ['My Notes — World of the Quran',      'میری نوٹس — قرآن کی دنیا',    'मेरी नोट्स — क़ुरआन की दुनिया'],
  lens3_placeholder:    ['My Reflection',                      'میرا غور و فکر',              'मेरा ग़ौर-ओ-फ़िक्र'],
  lens4_placeholder:    ['My Notes — Connections',             'میری نوٹس — تعلقات',          'मेरी नोट्स — ताल्लुक़ात'],
  lens5_placeholder:    ['The General Lesson — in my own words','سبق — اپنے الفاظ میں',        'सबक़ — अपने अल्फ़ाज़ में'],

  // Bottom nav
  nav_overview:         ['Overview',               'جائزہ',                 'जायज़ा'],
  nav_study:            ['Study',                  'مطالعہ',                'मुताला'],
  nav_vocab:            ['Vocab',                  'الفاظ',                 'अल्फ़ाज़'],
  nav_actions:          ['Actions',                'اعمال',                 'आमाल'],
  nav_journal:          ['Journal',                'جرنل',                  'जर्नल'],

  // Vocab page
  vocab_title:          ['Vocabulary Bank',        'ذخیرۂ الفاظ',           'ज़ख़ीरा-ए-अल्फ़ाज़'],
  vocab_empty:          ['No words saved yet. Tap any word while studying to save it here.', 'ابھی کوئی لفظ محفوظ نہیں۔ مطالعے کے دوران کسی لفظ کو تھپتھپائیں۔', 'अभी कोई लफ़्ज़ महफ़ूज़ नहीं। मुताले के दौरान किसी लफ़्ज़ को टैप करें।'],

  // Action page
  action_title:         ['Personal Action Plan',  'ذاتی عمل کا منصوبہ',    'ज़ाती अमल का मनसूबा'],
  action_hint:          ['Use this space to note any actions the Surah has called you to and changes you\'re inspired to make from today.', 'یہاں وہ اعمال لکھیں جن کی طرف یہ سورۃ آپ کو بلا رہی ہے اور آج سے جو تبدیلیاں لانا چاہتے ہیں۔', 'यहाँ वह आमाल लिखें जिनकी तरफ़ यह सूरह आपको बुला रही है और आज से जो तब्दीलियाँ लाना चाहते हैं।'],

  // Journal page
  journal_title:        ['Study Journal',          'مطالعہ جرنل',           'मुताला जर्नल'],
  journal_subtitle:     ['Your complete tadabbur journey — all lenses, all ayahs', 'آپ کا پورا تدبر کا سفر — تمام عدسے، تمام آیات', 'आपका पूरा तदब्बुर का सफ़र — सभी नज़रिए, सभी आयात'],
  final_reflection:     ['Final Reflection',       'آخری خیالات',           'आख़िरी ख़्यालात'],
  final_placeholder:    ['After completing all 30 ayahs, write your closing reflection here…', 'تمام ۳۰ آیات مکمل کرنے کے بعد اپنے آخری خیالات یہاں لکھیں…', 'सभी ३० आयात मुकम्मल करने के बाद अपने आख़िरी ख़्यालात यहाँ लिखें…'],
};

// Current language — loaded from store on init, changed by setLang()
let currentLang = 'en';

// ── Core functions ────────────────────────────────────────

// Translate a key into the current language.
// Falls back to key name if missing — never throws, never returns undefined.
function t(key) {
  const s = STRINGS[key];
  if (!s) return key;
  if (currentLang === 'ur')    return s[1];
  if (currentLang === 'hi') return s[2];
  return s[0];
}

// Returns the correct translation field from an ayah object.
function getAyahTranslation(ayah) {
  if (currentLang === 'ur')    return ayah.translation_ur || ayah.translation;
  if (currentLang === 'hi') return ayah.translation_hi || ayah.translation;
  return ayah.translation;
}

// Updates all [data-i18n] elements in the DOM.
// JS sets only the text content — CSS handles direction + font.
function updateI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// Populates all surah-specific DOM elements from the registry.
// Called on init and every time language changes.
// Safe to call before DataService is ready — exits silently.
function renderSurahStrings() {
  if (typeof DataService === 'undefined') return;
  const { strings } = DataService.getSurahMeta();
  const idx = currentLang === 'ur' ? 1 : currentLang === 'hi' ? 2 : 0;

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  };

  set('surah-name-display',      strings.name[idx]);
  set('surah-name-arabic',       strings.nameArabic);
  set('surah-subtitle-display',  strings.subtitle[idx]);
  set('surah-revelation-display',strings.revelation[idx]);
  set('surah-intro-display',     strings.intro[idx]);
  set('surah-journey-begins',    strings.journeyBegins[idx]);
  set('surah-vocab-subtitle',    strings.vocabSubtitle[idx]);
  set('surah-heart-filter-title',strings.heartFilterTitle[idx]);
  set('surah-heart-filter-body', strings.heartFilterBody[idx]);

  // Update page title
  document.title = 'Miftah · ' + strings.name[idx];

  // Ayah count never translates — always "N Ayahs"
  const countEl = document.getElementById('surah-ayah-count-display');
  if (countEl) countEl.textContent = DataService.getAyahCount() + ' Ayahs';
}

// Changes language, updates DOM, persists to store.
// Called by settings.js buttons and on app init.
function setLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  updateI18n();
  renderSurahStrings();
  saveLang(lang);

  // Update active state on settings lang buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
  });

  // Refresh dynamic study content if on study page
  if (typeof App !== 'undefined' && App.state.currentPage === 'study') {
    if (typeof renderStudyPage === 'function') {
      renderStudyPage(App.state.currentAyah);
    }
  }
}

// Called once by app.js on startup — reads persisted preference.
function initI18n() {
  let saved = loadLang();
  // Migrate old 'ur-hi' key to 'hi'
  if (saved === 'ur-hi') { saved = 'hi'; saveLang('hi'); }
  currentLang = saved;
  document.documentElement.setAttribute('data-lang', saved);
  updateI18n();
  renderSurahStrings();

  // Mark the correct button active in settings panel
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === saved);
  });
}
