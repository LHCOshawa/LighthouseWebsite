/* ============================================================
   LIGHTHOUSE CHURCH — MAIN.JS  (v3 — consolidated)
   One JS file for all pages.
   ============================================================ */

/* ── CONFIG ──────────────────────────────────────────────────── */
const CALENDAR_ID = '9104549d30365e435d95dcef73e34981c01eb3638d988038d40ca0fd4284cb57@group.calendar.google.com';
// Add your Google Calendar API key here for direct client-side fetching
// Get one at https://console.cloud.google.com → APIs & Services → Credentials
const GCAL_API_KEY = ''; // e.g. 'AIzaSy...'
const GCAL_LINK = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FToronto`;

/* ── DYNAMIC FOOTER YEAR ─────────────────────────────────────── */
document.querySelectorAll('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ══════════════════════════════════════════════════════════════
   LANGUAGE (EN / FR) — English is the default. Covers the shared
   chrome (nav, dropdown, mobile menu, search, both modals, footer)
   on every page, plus the homepage hero. Persists via localStorage.
   ══════════════════════════════════════════════════════════════ */
const LANG_KEY = 'lc-lang';
const FR = {
  nav: {
    'index.html': 'Accueil', 'about.html': 'À propos', 'giving.html': 'Faire un don',
    'womens-ministry.html': 'Ministère des Femmes', 'mens-ministry.html': 'Ministère des Hommes',
    'childrens-ministry.html': 'Ministère des Enfants', 'fellowship.html': 'Églises Sœurs'
  },
  ministries: 'Ministères',
  search: { label: 'Recherche', placeholder: 'Tapez pour rechercher…' },
  prayerBtn: 'Soumettre une demande de prière',
  connectBtn: 'Se connecter avec nous',
  prayerModal: {
    eyebrow: 'Prière', title: 'Nous prions avec vous',
    desc: 'Votre demande de prière sera traitée avec soin et confidentialité.',
    name: 'Nom', namePh: 'Votre nom complet',
    email: 'Courriel', emailPh: 'votre@courriel.com',
    req: 'Demande de prière', reqPh: 'Partagez votre demande de prière…',
    submit: 'Envoyer la demande',
    thankYou: 'Merci', thankYouBody: 'Nous prions avec vous.'
  },
  connectModal: {
    eyebrow: 'Contact', title: 'Nous aimerions vous entendre',
    intro: "Que vous ayez une question, que vous vouliez vous impliquer, ou simplement dire bonjour — nous sommes là.",
    name: 'Nom', email: 'Courriel', phone: 'Téléphone', optional: '(optionnel)',
    msg: 'Comment pouvons-nous vous aider?', msgPh: 'Parlez-nous de vous, posez une question…',
    heard: 'Comment avez-vous entendu parler de nous?', selectOne: 'Choisissez…',
    submit: 'Envoyer le message',
    thankYou: 'Merci!', thankYouBody: 'Nous vous contacterons bientôt.'
  },
  footer: { prayerNote: 'Prière à 10 h · 18 h · 18 h 30', rights: 'Église Lighthouse. Tous droits réservés.' }
};
const EN_CACHE = {}; // populated on first load so we can always revert to true original English

const FR_CONTENT = {
  'idx-0': 'Bienvenue',
  'idx-1': 'Former des disciples centrés sur Jésus',
  'idx-2': 'Culte du dimanche à 11 h 00',
  'idx-3': 'Événements',
  'idx-4': 'Vous n\'êtes pas seul(e)',
  'idx-5': 'Peu importe l\'ampleur de votre besoin, rien n\'est impossible pour notre Dieu! Laissez-nous prier avec vous.',
  'idx-6': '« C\'est pourquoi je vous dis : tout ce que vous demanderez en priant, croyez que vous l\'avez reçu, et vous le verrez s\'accomplir. » — Marc 11.24',
  'idx-7': '« Car là où est ton trésor, là aussi sera ton cœur. »',
  'idx-8': 'Matthieu 6.21',
  'idx-9': 'Donnez et faites une différence',
  'idx-10': 'Votre générosité fait avancer l\'Évangile et soutient notre mission d\'évangélisation, de formation de disciples et d\'implantation d\'églises ici à Oshawa et au-delà.',
  'idx-11': 'Horaires des cultes',
  'idx-12': 'Lighthouse Church · Oshawa, ON',
  'idx-13': 'Horaires des cultes ↓',
  'idx-14': '▶ Regarder en direct',
  'idx-15': 'Suivre le culte du dimanche 11 h en direct',
  'idx-16': 'À venir',
  'idx-17': 'Prière',
  'idx-18': 'Soumettre une demande de prière',
  'idx-19': 'Générosité',
  'idx-20': 'Faire un don',
  'idx-21': 'Notre mission →',
  'idx-22': 'Rejoignez-nous',
  'abt-0': 'Mission et vision',
  'abt-1': '« Allez, faites de toutes les nations des disciples. »',
  'abt-2': 'Matthieu 28.19',
  'abt-3': 'Lighthouse Church — aussi connue sous le nom de Lighthouse Christian Fellowship — est une communauté vivante et remplie de l\'Esprit à Oshawa, en Ontario. Notre mission est d\'apporter la lumière du Christ dans notre ville et au-delà, en bâtissant une église qui reflète l\'amour, la puissance et la mission de Jésus. Que vous découvriez la foi pour la première fois ou que vous cherchiez une communauté où grandir, vous êtes le bienvenu ici.',
  'abt-4': 'Évangélisation',
  'abt-5': 'L\'Évangile est fait pour être partagé au-delà des murs de l\'église. Comme Jésus l\'a demandé en Marc 16.15 : « Allez par tout le monde, et prêchez la bonne nouvelle à toute la création. » Nous avons à cœur d\'apporter l\'espérance du Christ à notre communauté et au-delà, par l\'évangélisation personnelle, l\'évangélisation à l\'échelle de la ville et les missions mondiales.',
  'abt-6': 'Formation de disciples',
  'abt-7': 'Suivre Jésus n\'est pas un simple instant, mais un cheminement de toute une vie. Nous nous engageons à équiper et à former les croyants pour qu\'ils grandissent dans leur foi, vivent dans l\'obéissance à Dieu et guident les autres dans leur marche avec Christ. Comme Jésus l\'a dit en Matthieu 28.20 : « Enseignez-leur à observer tout ce que je vous ai prescrit. »',
  'abt-8': 'Implantation d\'églises',
  'abt-9': 'Une église florissante est une église qui se multiplie. Le cœur de notre mission est de former des leaders et de les envoyer établir de nouvelles églises qui reflètent le Royaume de Dieu. Matthieu 9.37-38 nous rappelle : « La moisson est grande, mais il y a peu d\'ouvriers. » Notre vision est de voir naître des églises qui allumeront un réveil, apporteront une transformation et atteindront les nations.',
  'abt-10': 'Conversion',
  'abt-11': 'L\'Évangile n\'est pas qu\'une information, c\'est une transformation. Nous prêchons pour amener à une décision, croyant en la puissance du Saint-Esprit pour changer des vies. 1 Pierre 1.23 déclare : « Vous avez été régénérés… par la parole vivante et permanente de Dieu. » Notre église est remplie de personnes dont la vie a été radicalement transformée par Jésus, et nous continuons d\'inviter d\'autres personnes à vivre cette même rencontre transformatrice.',
  'abt-12': 'L\'Église locale',
  'abt-13': 'Dieu a placé tout ce qui est nécessaire pour accomplir Sa volonté au sein de l\'église locale. Éphésiens 1.22-23 appelle l\'église « son corps, la plénitude de celui qui remplit tout en tous. » Nous croyons en la puissance de se rassembler, de servir et de bâtir ensemble, sachant que Dieu agit quand son peuple est uni dans la foi et dans un même but.',
  'abt-14': 'Joignez-vous à cette mission',
  'abt-15': 'Nous croyons en la puissance de la communauté. Que vous soyez nouveau dans la foi ou que vous marchiez avec Dieu depuis des années, il y a une place pour vous ici, à Lighthouse Church.',
  'abt-16': 'Notre histoire',
  'abt-17': 'Qui nous sommes',
  'abt-18': 'S\'impliquer',
  'abt-19': 'Se connecter avec nous',
  'give-0': 'Donner',
  'give-1': '« Car là où est ton trésor, là aussi sera ton cœur. » — Matthieu 6.21',
  'give-2': '« Dieu est généreux, et il nous appelle à l\'être aussi. »',
  'give-3': 'La façon dont nous utilisons ce qu\'Il nous a donné reflète l\'état de notre cœur et sert de témoignage qui aide à partager l\'Évangile avec le monde. Nous voulons glorifier Dieu dans tous les domaines de notre vie, y compris dans la gestion de nos finances. Vos dons soutiennent notre mission d\'évangélisation, de formation de disciples, d\'implantation d\'églises et de service auprès de notre communauté ici à Oshawa et au-delà.',
  'give-4': 'Méthodes de don',
  'give-5': 'Virement Interac',
  'give-6': 'Donnez rapidement et en toute sécurité depuis n\'importe quel compte bancaire canadien.',
  'give-7': 'Envoyer un chèque par la poste',
  'give-8': 'Tous les chèques doivent être libellés à l\'ordre de Lighthouse Christian Fellowship.',
  'give-9': '« Que chacun donne comme il l\'a résolu en son cœur, sans tristesse ni contrainte, car Dieu aime celui qui donne avec joie. »',
  'give-10': '2 Corinthiens 9.7',
  'give-11': 'Nous sommes là pour vous',
  'give-12': 'Des questions sur les dons ou envie d\'échanger avec notre équipe? Nous serions ravis de vous entendre.',
  'give-13': 'Générosité',
  'give-14': 'Pourquoi nous donnons',
  'give-15': 'Comment donner',
  'give-16': 'Copier l\'adresse courriel',
  'give-17': 'Copier l\'adresse',
  'give-18': 'Des questions?',
  'give-19': 'Écrivez-nous',
  'fel-0': 'Lighthouse Church · Oshawa, ON',
  'fel-1': 'Églises Sœurs',
  'fel-2': 'La vie est plus belle ensemble.',
  'fel-3': 'Rejoignez-nous',
  'fel-4': 'Se connecter',
  'kid-0': 'Ministère des Enfants',
  'kid-1': 'La foi commence ici',
  'kid-2': 'Le Ministère des Enfants de Lighthouse Church est un environnement sûr, amusant et rempli de l\'Esprit où les enfants découvrent qui est Dieu, font l\'expérience de Son amour et grandissent dans la foi. Nous croyons que chaque enfant est un don de Dieu et mérite de rencontrer Jésus d\'une manière authentique et adaptée à son âge.',
  'kid-3': 'Programmes, horaires et coordonnées des responsables à venir. Contactez-nous pour plus de détails.',
  'kid-4': 'Grandir ensemble',
  'kid-5': 'Fondement de la foi',
  'kid-6': 'Un enseignement biblique adapté à l\'âge qui pose un solide fondement de foi, aidant les enfants à comprendre qui est Dieu et à quel point Il les aime.',
  'kid-7': 'Plaisir et découverte',
  'kid-8': 'Des temps de louange captivants, des jeux et des activités créatives qui font de l\'église un endroit où les enfants ont vraiment envie d\'être chaque semaine.',
  'kid-9': 'Partenariat avec les familles',
  'kid-10': 'Nous croyons que les parents sont les premiers guides spirituels dans la vie d\'un enfant. Nous travaillons avec les familles pour renforcer la foi à la maison.',
  'kid-11': '« Instruis l\'enfant selon la voie qu\'il doit suivre; et quand il sera vieux, il ne s\'en détournera pas. »',
  'kid-12': 'Proverbes 22.6',
  'kid-13': 'Amenez vos enfants ce dimanche',
  'kid-14': 'Le Ministère des Enfants a lieu pendant les cultes du dimanche. Venez tel que vous êtes — toute votre famille est la bienvenue.',
  'kid-15': 'Ministère',
  'kid-16': 'Qui nous sommes',
  'kid-17': 'Se connecter avec nous',
  'kid-18': 'Suivez @lhcoshawa',
  'kid-19': 'Ce que nous offrons',
  'kid-20': 'Votre famille a sa place ici',
  'kid-21': 'Obtenir l\'itinéraire',
  'men-0': 'Ministère des Hommes',
  'men-1': 'Le fer aiguise le fer',
  'men-2': 'Le Ministère des Hommes de Lighthouse Church est une communauté où les hommes sont mis au défi de grandir dans la foi, l\'intégrité et le caractère selon Dieu. Nous croyons que lorsque les hommes sont enracinés dans la Parole de Dieu et unis par une fraternité authentique, les familles sont renforcées, les communautés changent et le Royaume avance.',
  'men-3': 'Programmes, horaires et coordonnées des responsables à venir. Restez connectés avec nous sur Instagram pour les dernières annonces et activités.',
  'men-4': 'Conçu pour la fraternité',
  'men-5': 'Fraternité',
  'men-6': 'Une communauté authentique avec des hommes qui vous mettront au défi, vous encourageront et marcheront à vos côtés à travers toutes les saisons de la vie.',
  'men-7': 'Étude biblique',
  'men-8': 'Une étude pratique et audacieuse de la Parole de Dieu qui équipe les hommes à diriger avec sagesse, force et un cœur de serviteur.',
  'men-9': 'Événements',
  'men-10': 'Déjeuners entre hommes, soirées d\'évangélisation et rassemblements spéciaux tout au long de l\'année pour se connecter et grandir.',
  'men-11': '« Comme le fer aiguise le fer, ainsi un homme s\'anime au contact d\'un autre homme. »',
  'men-12': 'Proverbes 27.17',
  'men-13': 'La fraternité en action',
  'men-14': 'Événements pour hommes',
  'men-15': 'Nous vous invitons à nous rejoindre',
  'men-16': 'Peu importe où vous en êtes dans votre cheminement de foi, il y a une place pour vous ici. Venez tel que vous êtes — chaque homme est le bienvenu.',
  'men-17': 'Ministère',
  'men-18': 'Qui nous sommes',
  'men-19': 'Ce que nous offrons',
  'men-20': 'Galerie',
  'men-21': 'À venir',
  'men-22': 'Vous avez votre place ici',
  'men-23': 'Horaires des cultes →',
  'men-24': 'Soumettre une demande de prière',
  'wom-0': 'Ministère des Femmes',
  'wom-1': 'Conçu pour chaque femme',
  'wom-2': 'Le Ministère des Femmes de Lighthouse Church est un lieu où les femmes de tout âge et de tout parcours peuvent rencontrer Dieu, trouver une communauté authentique et grandir dans leur foi. Que vous soyez nouvelle dans la foi ou que vous marchiez avec Jésus depuis des années, vous avez votre place ici.',
  'wom-3': 'Restez connectées avec nous sur Instagram pour les dernières annonces, activités et nouvelles de la communauté.',
  'wom-4': 'Devenir Elle',
  'wom-5': 'Communauté',
  'wom-6': 'Un espace sûr et accueillant où se forment de vraies amitiés et où chaque femme est connue et valorisée.',
  'wom-7': 'Étude biblique',
  'wom-8': 'Une étude captivante de la Parole de Dieu, conduite par l\'Esprit, qui équipe les femmes à vivre leur foi au quotidien.',
  'wom-9': 'Événements',
  'wom-10': 'Des rassemblements saisonniers, des conférences et des cultes spéciaux — de Beauty & Grace aux soirées de louange.',
  'wom-11': '« Elle est parée de force et de dignité, et elle rit de l\'avenir. »',
  'wom-12': 'Proverbes 31.25',
  'wom-13': 'Sœurs en Christ',
  'wom-14': 'Nous vous invitons à nous rejoindre',
  'wom-15': 'Peu importe où vous en êtes dans votre cheminement de foi, il y a une place pour vous dans notre communauté. Venez telle que vous êtes — vous êtes la bienvenue ici.',
  'wom-16': 'Événements pour femmes',
  'wom-17': 'Ministère',
  'wom-18': 'Qui nous sommes',
  'wom-19': 'Ce que nous offrons',
  'wom-20': 'Galerie',
  'wom-21': 'Vous avez votre place ici',
  'wom-22': 'Événements pour femmes →',
  'wom-23': 'Restez connectées',
  'wom-24': 'Soumettre une demande de prière',
  'wom-25': 'À venir',
  'kid-22': 'Se connecter avec nous',
};


function grabOriginal(el, key) { if (el && !(key in EN_CACHE)) EN_CACHE[key] = el.textContent; }
function grabOriginalAttr(el, attr, key) { if (el && !(key in EN_CACHE)) EN_CACHE[key] = el.getAttribute(attr); }

function applyLang(lang) {
  const fr = lang === 'fr';
  document.documentElement.lang = fr ? 'fr' : 'en';

  // Full page-body content — every heading/paragraph/list item/button
  // label tagged with data-i18n, on every page.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    grabOriginal(el, 'body:' + key);
    if (fr && FR_CONTENT[key]) el.textContent = FR_CONTENT[key];
    else el.textContent = EN_CACHE['body:' + key];
  });

  // Nav links (top nav + mobile menu) — matched by href, so markup stays untouched
  document.querySelectorAll('.nav-links > a, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!FR.nav[href]) return;
    const k = 'nav:' + href + ':' + (a.closest('.mobile-nav-links') ? 'm' : 'd');
    grabOriginal(a, k);
    a.textContent = fr ? FR.nav[href] : EN_CACHE[k];
  });
  const ministriesBtn = document.getElementById('ministries-btn');
  if (ministriesBtn) { grabOriginal(ministriesBtn, 'ministries'); ministriesBtn.textContent = fr ? FR.ministries : EN_CACHE['ministries']; }
  document.querySelectorAll('#ministries-dropdown a, .mobile-ministries-list a').forEach(a => {
    const href = a.getAttribute('href');
    if (!FR.nav[href]) return;
    const textNode = Array.from(a.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
    if (!textNode) return;
    const k = 'dd:' + href;
    if (!(k in EN_CACHE)) EN_CACHE[k] = textNode.textContent;
    textNode.textContent = fr ? ' ' + FR.nav[href] : EN_CACHE[k];
  });

  // Search
  const sl = document.querySelector('.search-label');
  if (sl) { grabOriginal(sl, 'searchLabel'); sl.textContent = fr ? FR.search.label : EN_CACHE['searchLabel']; }
  const si = document.getElementById('search-input');
  if (si) { grabOriginalAttr(si, 'placeholder', 'searchPh'); si.placeholder = fr ? FR.search.placeholder : EN_CACHE['searchPh']; }

  // Footer prayer/connect buttons only — everywhere else these buttons
  // live inside <main> and are already covered by the data-i18n loop above.
  document.querySelectorAll('.footer-btns [data-prayer] span').forEach((s, i) => {
    const k = 'fpb:' + i;
    grabOriginal(s, k);
    s.textContent = fr ? FR.prayerBtn : EN_CACHE[k];
  });
  document.querySelectorAll('.footer-btns [data-connect] span').forEach((s, i) => {
    const k = 'fcb:' + i;
    grabOriginal(s, k);
    s.textContent = fr ? FR.connectBtn : EN_CACHE[k];
  });

  // Prayer modal
  const pm = document.getElementById('prayer-modal');
  if (pm) {
    const map = [
      ['.modal-eyebrow', 'title', FR.prayerModal.eyebrow, 'pm-eyebrow'],
      ['.modal-title', 'title', FR.prayerModal.title, 'pm-title'],
      ['.modal-confidential', 'title', FR.prayerModal.desc, 'pm-desc'],
      ['label[for="prayer-name"]', 'title', FR.prayerModal.name, 'pm-name'],
      ['label[for="prayer-email"]', 'title', FR.prayerModal.email, 'pm-email'],
      ['label[for="prayer-req"]', 'title', FR.prayerModal.req, 'pm-req'],
      ['#prayer-form button span', 'title', FR.prayerModal.submit, 'pm-submit'],
      ['#prayer-success h3', 'title', FR.prayerModal.thankYou, 'pm-ty'],
      ['#prayer-success p', 'title', FR.prayerModal.thankYouBody, 'pm-tyb'],
    ];
    map.forEach(([sel, _, frVal, k]) => { const el = pm.querySelector(sel); if (!el) return; grabOriginal(el, k); el.textContent = fr ? frVal : EN_CACHE[k]; });
    const nameI = pm.querySelector('#prayer-name'), emailI = pm.querySelector('#prayer-email'), reqI = pm.querySelector('#prayer-req');
    if (nameI) { grabOriginalAttr(nameI, 'placeholder', 'pm-name-ph'); nameI.placeholder = fr ? FR.prayerModal.namePh : EN_CACHE['pm-name-ph']; }
    if (emailI) { grabOriginalAttr(emailI, 'placeholder', 'pm-email-ph'); emailI.placeholder = fr ? FR.prayerModal.emailPh : EN_CACHE['pm-email-ph']; }
    if (reqI) { grabOriginalAttr(reqI, 'placeholder', 'pm-req-ph'); reqI.placeholder = fr ? FR.prayerModal.reqPh : EN_CACHE['pm-req-ph']; }
  }

  // Connect modal
  const cm = document.getElementById('connect-modal');
  if (cm) {
    const map = [
      ['.modal-eyebrow', FR.connectModal.eyebrow, 'cm-eyebrow'],
      ['.modal-title', FR.connectModal.title, 'cm-title'],
      ['label[for="cn-name"]', FR.connectModal.name, 'cm-name'],
      ['label[for="cn-email"]', FR.connectModal.email, 'cm-email'],
      ['#connect-form button span', FR.connectModal.submit, 'cm-submit'],
      ['#connect-success h3', FR.connectModal.thankYou, 'cm-ty'],
      ['#connect-success p', FR.connectModal.thankYouBody, 'cm-tyb'],
    ];
    map.forEach(([sel, frVal, k]) => { const el = cm.querySelector(sel); if (!el) return; grabOriginal(el, k); el.textContent = fr ? frVal : EN_CACHE[k]; });
    const msgI = cm.querySelector('#cn-msg');
    if (msgI) { grabOriginalAttr(msgI, 'placeholder', 'cm-msg-ph'); msgI.placeholder = fr ? FR.connectModal.msgPh : EN_CACHE['cm-msg-ph']; }
  }

  // Footer note + rights line (year span preserved)
  document.querySelectorAll('.footer-note').forEach((el, i) => {
    const k = 'fn:' + i; grabOriginal(el, k);
    el.textContent = fr ? FR.footer.prayerNote : EN_CACHE[k];
  });
  document.querySelectorAll('.footer-bottom p').forEach(el => {
    const yearSpan = el.querySelector('.footer-year');
    if (!yearSpan) return;
    const year = yearSpan.textContent;
    el.innerHTML = fr
      ? `© <span class="footer-year">${year}</span> ${FR.footer.rights}`
      : `© <span class="footer-year">${year}</span> Lighthouse Church. All rights reserved.`;
  });

  document.querySelectorAll('.lang-toggle button').forEach(b => {
    const active = b.dataset.lang === lang;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active);
  });
  try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
}

document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});
let savedLang = 'en';
try { savedLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (_) {}
if (savedLang === 'fr') applyLang('fr');

/* ── PAGE LOADER ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('done');
  }, 1200);
});

/* ── SCROLL PROGRESS BAR ────────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

/* ── CUSTOM CURSOR (desktop only) ──────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
if (dot && ring && !('ontouchstart' in window)) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function rafCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(rafCursor);
  }
  rafCursor();
  document.querySelectorAll('a, button, [data-prayer], .nav-icon-btn, .service-card, .feature-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── THEME TOGGLE ────────────────────────────────────────────── */
const savedTheme = localStorage.getItem('lc-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-moon').forEach(el => el.style.display = isDark ? 'block' : 'none');
  document.querySelectorAll('.theme-sun').forEach(el  => el.style.display = isDark ? 'none'  : 'block');
}
updateThemeIcons();
document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('lc-theme', next);
    updateThemeIcons();
  });
});

/* ── NAVIGATION SCROLL ──────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 40); updateLogo(); }, { passive: true });
}

/* ── LOGO SWITCHING ─────────────────────────────────────────── */
const DARK_LOGO  = 'https://lh3.googleusercontent.com/d/1FlwmXedUBVWrIdYQppeLKOXL21_4LFs0';
const LIGHT_LOGO = 'https://lh3.googleusercontent.com/d/1vhiwXZNViO4mbnkXF1VzT7mFLdoLwfUL';

function updateLogo() {
  const nav = document.getElementById('nav');
  const overDarkHero = nav && !nav.classList.contains('scrolled'); // transparent nav floats over the dark hero image in both themes
  const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  const useLight = isLightTheme && !overDarkHero; // only use the dark-ink logo once the nav has a solid light background
  document.querySelectorAll('.nav-logo-img').forEach(img => {
    img.src = useLight ? LIGHT_LOGO : DARK_LOGO;
  });
}
updateLogo();
new MutationObserver(updateLogo).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
document.querySelectorAll('.nav-logo-img').forEach(img => img.addEventListener('error', function() { this.classList.add('hidden'); }));

/* ── MINISTRIES DROPDOWN ────────────────────────────────────── */
const ddBtn  = document.getElementById('ministries-btn');
const ddMenu = document.getElementById('ministries-dropdown');
if (ddBtn && ddMenu) {
  ddBtn.addEventListener('click', e => { e.stopPropagation(); ddMenu.classList.toggle('open'); });
  document.addEventListener('click', () => ddMenu.classList.remove('open'));
  ddMenu.addEventListener('click', e => e.stopPropagation());
}

/* ── MOBILE MENU ────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

/* ── SEARCH ─────────────────────────────────────────────────── */
const searchOverlay = document.getElementById('search-overlay');
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchIndex = [
  { title: 'Home',                     url: 'index.html',              excerpt: 'Welcome to Lighthouse Church in Oshawa, Ontario.' },
  { title: 'About — Mission & Vision', url: 'about.html',              excerpt: 'Evangelism, Discipleship, Church Planting.' },
  { title: "Women's Ministry",          url: 'womens-ministry.html',    excerpt: 'Community, Bible study, and events for women.' },
  { title: "Men's Ministry",            url: 'mens-ministry.html',      excerpt: 'Brotherhood, Bible study, and events for men.' },
  { title: "Children's Ministry",       url: 'childrens-ministry.html', excerpt: 'Faith Foundation, Fun & Discovery, Family Partnership.' },
  { title: 'Give',                     url: 'giving.html',             excerpt: 'Interac e-Transfer to giving@lhcoshawa.ca' },
  { title: 'Fellowship',               url: 'fellowship.html',         excerpt: 'Life is better together.' },
  { title: 'Service Times',            url: 'index.html#times',        excerpt: 'Sunday 11 AM & 7 PM — Wednesday 7:30 PM.' },
  { title: 'Prayer Request',           url: 'index.html#prayer',       excerpt: 'Submit a prayer request — we are believing with you.' },
];

function openSearch()  { if (searchOverlay) { searchOverlay.classList.add('open'); searchInput?.focus(); } }
function closeSearch() { if (searchOverlay) { searchOverlay.classList.remove('open'); if (searchInput) searchInput.value = ''; if (searchResults) searchResults.innerHTML = ''; } }
document.querySelectorAll('.search-open-btn').forEach(b => b.addEventListener('click', openSearch));
document.querySelectorAll('.search-close').forEach(b => b.addEventListener('click', closeSearch));

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!searchResults || !q) { if (searchResults) searchResults.innerHTML = ''; return; }
    const hits = searchIndex.filter(i => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q));
    searchResults.innerHTML = hits.length
      ? hits.map((h,i) => `<a href="${h.url}" class="search-result-item"><span class="sr-num">0${i+1}</span><div><div class="sr-title">${h.title}</div><div class="sr-excerpt">${h.excerpt}</div></div></a>`).join('')
      : `<p style="color:var(--text-2);font-size:0.85rem;padding:1rem 0;">No results for "<em>${q}</em>"</p>`;
  });
}

/* ── MODALS ─────────────────────────────────────────────────── */
const prayerModal  = document.getElementById('prayer-modal');
const prayerForm   = document.getElementById('prayer-form');
const prayerSucc   = document.getElementById('prayer-success');
const connectModal = document.getElementById('connect-modal');
const connectForm  = document.getElementById('connect-form');
const connectSucc  = document.getElementById('connect-success');

function openPrayer()   { prayerModal?.classList.add('open'); }
function closePrayer()  { prayerModal?.classList.remove('open'); setTimeout(() => { prayerForm?.classList.remove('hidden'); prayerSucc?.classList.remove('show'); prayerForm?.reset(); }, 400); }
function openConnect()  { connectModal?.classList.add('open'); }
function closeConnect() { connectModal?.classList.remove('open'); setTimeout(() => { connectForm?.classList.remove('hidden'); connectSucc?.classList.remove('show'); connectForm?.reset(); }, 400); }

document.querySelectorAll('[data-prayer]').forEach(b => b.addEventListener('click', openPrayer));
document.querySelectorAll('[data-connect]').forEach(b => b.addEventListener('click', openConnect));
prayerModal?.addEventListener('click', e => { if (e.target === prayerModal) closePrayer(); });
connectModal?.addEventListener('click', e => { if (e.target === connectModal) closeConnect(); });
document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => { closePrayer(); closeConnect(); }));
document.querySelectorAll('.connect-close').forEach(b => b.addEventListener('click', closeConnect));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closePrayer(); closeConnect(); } });

if (prayerForm) {
  prayerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = prayerForm.querySelector('[name="name"]')?.value.trim();
    const email = prayerForm.querySelector('[name="email"]')?.value.trim();
    const req   = prayerForm.querySelector('[name="prayer"]')?.value.trim();
    if (!name || !email || !req) return;
    try { await fetch('https://formsubmit.co/ajax/followup@lhcoshawa.ca', { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({ name, email, 'prayer-request': req, _subject:`Prayer Request — ${name}`, _captcha:false }) }); } catch(_) {}
    prayerForm.classList.add('hidden');
    prayerSucc?.classList.add('show');
  });
}
if (connectForm) {
  connectForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = connectForm.querySelector('[name="name"]')?.value.trim();
    const email = connectForm.querySelector('[name="email"]')?.value.trim();
    const msg   = connectForm.querySelector('[name="message"]')?.value.trim();
    if (!name || !email || !msg) return;
    try { await fetch('https://formsubmit.co/ajax/followup@lhcoshawa.ca', { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({ name, email, phone: connectForm.querySelector('[name="phone"]')?.value.trim()||'', message:msg, source:connectForm.querySelector('[name="source"]')?.value||'', _subject:`Connect With Us — ${name}`, _captcha:false }) }); } catch(_) {}
    connectForm.classList.add('hidden');
    connectSucc?.classList.add('show');
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .clip-line, .eyebrow, .stagger-children').forEach(el => revealObs.observe(el));

/* ── EST TIME ────────────────────────────────────────────────── */
function getEST() {
  const now = new Date(), utc = now.getTime() + now.getTimezoneOffset()*60000;
  const jan = new Date(now.getFullYear(),0,1), jul = new Date(now.getFullYear(),6,1);
  const dst = now.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return new Date(utc + (dst ? -4 : -5)*3600000);
}

const SERVICES = [
  { day:0, h:11, m:0,  label:'Sunday 11:00 AM Service' },
  { day:0, h:19, m:0,  label:'Sunday 7:00 PM Service'  },
  { day:3, h:19, m:30, label:'Wednesday 7:30 PM Service'},
];

function isLive() {
  const now=getEST(), dN=now.getDay(), hN=now.getHours(), mN=now.getMinutes();
  return SERVICES.some(s => { if(s.day!==dN) return false; const sm=s.h*60+s.m, cm=hN*60+mN; return cm>=sm-15&&cm<=sm+75; });
}
function getNextService() {
  const now=getEST(), dN=now.getDay(), hN=now.getHours(), mN=now.getMinutes();
  const cm=dN*1440+hN*60+mN;
  const ws=SERVICES.map(s=>({...s,wMin:s.day*1440+s.h*60+s.m})).sort((a,b)=>a.wMin-b.wMin);
  const next=ws.find(s=>s.wMin>cm)||ws[0];
  let diff=next.wMin-cm; if(diff<=0) diff+=7*1440;
  return { service:next, msToNext:diff*60000 };
}

/* ── COUNTDOWN ───────────────────────────────────────────────── */
window.initCountdown = function() {
  const cdDays=document.getElementById('cd-days'), cdHrs=document.getElementById('cd-hrs'),
        cdMins=document.getElementById('cd-mins'), cdSecs=document.getElementById('cd-secs'),
        cdNext=document.getElementById('cd-next'), cdLive=document.getElementById('cd-live-btn-wrap'),
        cdLabel=document.getElementById('cd-live-label');
  if (!cdDays) return;
  function pad(n) { return String(Math.max(0,n)).padStart(2,'0'); }
  function flip(el,val) { if(!el) return; const v=pad(val); if(el.textContent!==v){el.classList.remove('flipping');void el.offsetWidth;el.textContent=v;el.classList.add('flipping');} }
  function tick() {
    const {service,msToNext}=getNextService(), live=isLive();
    if(cdNext) cdNext.textContent=live?'🔴 '+service.label+' — On Now':service.label;
    if(cdLive) {
      cdLive.style.display=live?'block':'none';
      if(live&&cdLabel) cdLabel.textContent='Watch '+service.label;
      const btn=document.getElementById('cd-live-btn');
      if(btn) btn.href='https://www.youtube.com/@lhcoshawa/live';
    }
    let rem=Math.floor(msToNext/1000);
    const d=Math.floor(rem/86400); rem%=86400;
    const h=Math.floor(rem/3600); rem%=3600;
    const mi=Math.floor(rem/60), s=rem%60;
    flip(cdDays,d); flip(cdHrs,h); flip(cdMins,mi); flip(cdSecs,s);
  }
  tick(); setInterval(tick,1000);
};

/* ── LIVE STREAM ─────────────────────────────────────────────── */
function initStream() {
  const lsec=document.getElementById('stream-live'), nlsec=document.getElementById('stream-not-live');
  const lsticky=document.getElementById('live-sticky'), nextEl=document.getElementById('next-service-text');
  if(!lsec&&!nlsec) return;
  const live=isLive();
  if(lsec) lsec.style.display=live?'block':'none';
  if(nlsec) nlsec.style.display=live?'none':'block';
  if(!live&&nextEl) nextEl.textContent=getNextService().service.label.replace(' Service','');
  if(lsticky&&live) window.addEventListener('scroll',()=>{const hero=document.querySelector('.page-hero');if(hero)lsticky.classList.toggle('show',window.scrollY>hero.offsetHeight);},{passive:true});
}

/* ── CLIPBOARD ───────────────────────────────────────────────── */
document.querySelectorAll('[data-copy]').forEach(btn => {
  const orig=btn.textContent, text=btn.getAttribute('data-copy');
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);});
    btn.textContent='✓ Copied'; setTimeout(()=>btn.textContent=orig, 2200);
  });
});

/* ── ACTIVE NAV ──────────────────────────────────────────────── */
const curPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href')===curPage || (curPage===''&&a.getAttribute('href')==='index.html')) a.classList.add('active');
});

/* ══════════════════════════════════════════════════════════════
   EVENTS SYSTEM — Google Calendar API → server → ICS → link
   ══════════════════════════════════════════════════════════════ */
const MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAYS_FULL    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAYS_SHORT   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

const EVENT_IMAGES = {
  logo:  'https://lh3.googleusercontent.com/d/1vhiwXZNViO4mbnkXF1VzT7mFLdoLwfUL',
  men:   'https://lh3.googleusercontent.com/d/1sVvOnArlTJCR0BaW6XKBF_PcJV-X1nlJ',
  women: 'https://lh3.googleusercontent.com/d/10XjWVZGre_im94tHaI7ERDMnADVy2MtD',
};

function getEventImage(title) {
  const t = title.toLowerCase();
  if (t.includes('men')&&!t.includes('women')) return EVENT_IMAGES.men;
  if (t.includes('women')||t.includes('woman')||t.includes('beauty')||t.includes('grace')) return EVENT_IMAGES.women;
  return EVENT_IMAGES.logo;
}
function isRecurringService(ev) { const t=ev.title.toLowerCase(); return t.includes('sunday')||t.includes('wednesday'); }

function formatEventCard(ev, idx) {
  const dow=DAYS_FULL[ev.start.getDay()], dowS=DAYS_SHORT[ev.start.getDay()];
  const dayN=ev.start.getDate(), monS=MONTHS_SHORT[ev.start.getMonth()], yr=ev.start.getFullYear();
  const img=ev.image||getEventImage(ev.title);
  const locHTML=ev.location?`<span class="evt-loc"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>${ev.location}</span>`:'';
  return `<article class="evt-card" role="article" aria-label="${ev.title} — ${dow} ${monS} ${dayN}">
    <div class="evt-card-img" style="background-image:url('${img}');" aria-hidden="true">
      <div class="evt-date-badge"><span class="evt-badge-day">${dayN}</span><span class="evt-badge-mon">${monS}</span></div>
    </div>
    <div class="evt-card-body">
      <div class="evt-card-meta"><span class="evt-dow">${dowS} · ${yr}</span><span class="evt-time-pill">${ev.time}</span></div>
      <h3 class="evt-title">${ev.title}</h3>
      ${locHTML}
      ${ev.description?`<p class="evt-desc">${ev.description}</p>`:''}
    </div>
  </article>`;
}

function appendCalendarLink(section) {
  if (!section||section.querySelector('.gcal-link-wrap')) return;
  const wrap=document.createElement('div');
  wrap.className='gcal-link-wrap';
  wrap.innerHTML=`<a href="${GCAL_LINK}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost gcal-view-btn">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    <span>View Full Calendar</span>
  </a>`;
  section.appendChild(wrap);
}

function showNoEvents(containerId) {
  const c=document.getElementById(containerId); if(!c) return;
  const section=c.closest('section')||c.parentElement;
  const hideFollow = section && section.hasAttribute('data-hide-follow');
  const followBtn = hideFollow ? '' : `<a href="https://www.instagram.com/lhcoshawa/" target="_blank" rel="noopener noreferrer" class="btn btn-ghost"><span>Follow @lhcoshawa</span></a>`;
  c.innerHTML=`<div class="events-empty"><div class="empty-glyph">✦</div><h3>No upcoming events</h3><p>Stay connected on Instagram for the latest announcements.</p>${followBtn}</div>`;
  appendCalendarLink(section);
}

function renderEvents(events, containerId, filterFn, limit) {
  const container=document.getElementById(containerId); if(!container) return;
  let filtered=events.filter(ev=>!isRecurringService(ev));
  if(filterFn) filtered=filtered.filter(filterFn);
  const visible=filtered.slice(0,limit||5);
  if(!visible.length) { showNoEvents(containerId); return; }
  container.innerHTML=visible.map((ev,i)=>formatEventCard(ev,i)).join('');
  if(containerId==='events-container') initEvtCarousel(container);
  appendCalendarLink(container.closest('section')||container.parentElement);
  container.querySelectorAll('.evt-card').forEach((c,i)=>{
    c.style.opacity='0'; c.style.transform='translateY(20px)';
    setTimeout(()=>{ c.style.transition='opacity 0.6s var(--ease),transform 0.6s var(--ease)'; c.style.opacity='1'; c.style.transform=''; }, 80*i);
  });
}

/* ── CAROUSEL ────────────────────────────────────────────────── */
function initEvtCarousel(track) {
  const wrap=track.parentElement;
  const prev=document.getElementById('evt-prev'), next=document.getElementById('evt-next');
  const dots=document.getElementById('evt-dots');
  const cards=Array.from(track.querySelectorAll('.evt-card'));
  let cur=0;
  if(dots){dots.innerHTML='';cards.forEach((_,i)=>{const d=document.createElement('button');d.className='evt-dot'+(i===0?' active':'');d.setAttribute('aria-label',`Go to event ${i+1}`);d.addEventListener('click',()=>goTo(i));dots.appendChild(d);});}
  function getW(){const c=cards[0];return c?c.offsetWidth+parseInt(getComputedStyle(track).gap||'24'):0;}
  function goTo(idx){
    cur=Math.max(0,Math.min(idx,cards.length-1));
    track.style.transform=`translateX(-${getW()*cur}px)`;
    if(dots) dots.querySelectorAll('.evt-dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
  }
  if(prev) prev.addEventListener('click',()=>goTo(cur-1));
  if(next) next.addEventListener('click',()=>goTo(cur+1));
  wrap.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')goTo(cur-1);if(e.key==='ArrowRight')goTo(cur+1);});
  let sx=0,drag=false,dDelta=0;
  wrap.addEventListener('pointerdown',e=>{sx=e.clientX;drag=true;wrap.setPointerCapture(e.pointerId);});
  wrap.addEventListener('pointermove',e=>{if(!drag)return;dDelta=e.clientX-sx;track.style.transition='none';track.style.transform=`translateX(-${getW()*cur-dDelta}px)`;});
  wrap.addEventListener('pointerup',()=>{if(!drag)return;drag=false;track.style.transition='';if(dDelta<-60)goTo(cur+1);else if(dDelta>60)goTo(cur-1);else goTo(cur);dDelta=0;});
  let t=setInterval(()=>goTo((cur+1)%cards.length),6000);
  wrap.addEventListener('pointerdown',()=>clearInterval(t));
  goTo(0);
}

/* ── ICS FALLBACK ────────────────────────────────────────────── */
const ICS_URL = `https://calendar.google.com/calendar/ical/${CALENDAR_ID}/public/basic.ics`;

function parseICS(text) {
  const events=[], cutoff=new Date(Date.now()-2*60*60*1000);
  const unfolded=text.replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,'');
  unfolded.split(/BEGIN:VEVENT/).slice(1).forEach(block=>{
    const get=k=>{const m=block.match(new RegExp('(?:^|\\n)'+k+'(?:;[^:]*)?:([^\\r\\n]+)','im'));return m?m[1].trim():'';};
    function parsedt(raw){if(!raw)return null;const v=raw.replace(/^[^:]+:/,'').trim();const y=+v.slice(0,4),mo=+v.slice(4,6)-1,d=+v.slice(6,8),h=v.length>8?+v.slice(9,11):0,mi=v.length>8?+v.slice(11,13):0;return new Date(y,mo,d,h,mi);}
    const dL=block.match(/(?:^|\n)DTSTART(?:;[^:\r\n]*)?:([^\r\n]+)/im);
    const start=dL?parsedt(dL[1].trim()):null; if(!start) return;
    const title=get('SUMMARY').replace(/\\n/g,' ').replace(/\\,/g,',').trim()||'Untitled Event';
    const desc=get('DESCRIPTION').replace(/\\n/g,' ').replace(/\\,/g,',').trim().slice(0,180);
    const loc=get('LOCATION').replace(/\\n/g,' ').replace(/\\,/g,',').trim();
    const rrule=get('RRULE');
    let es=new Date(start);
    if(rrule){
      const freq=(rrule.match(/FREQ=(\w+)/i)||[])[1]||'';
      const intv=+((rrule.match(/INTERVAL=(\d+)/i)||[])[1]||1);
      let c=new Date(es),i=0;
      while(c<cutoff&&i++<500){if(freq==='WEEKLY')c.setDate(c.getDate()+7*intv);else if(freq==='DAILY')c.setDate(c.getDate()+intv);else if(freq==='MONTHLY')c.setMonth(c.getMonth()+intv);else if(freq==='YEARLY')c.setFullYear(c.getFullYear()+intv);else break;}
      if(c<cutoff) return; es=c;
    } else { if(es<cutoff) return; }
    const hh=es.getHours(),mm=es.getMinutes(),ampm=hh>=12?'PM':'AM',h12=hh%12||12;
    events.push({title,start:es,time:`${h12}:${String(mm).padStart(2,'0')} ${ampm}`,location:loc,description:desc});
  });
  return events.sort((a,b)=>a.start-b.start);
}

function apiEventToLocal(ev) {
  const start=new Date(ev.startISO||`${ev.year}-${String(ev.month+1).padStart(2,'0')}-${String(ev.day).padStart(2,'0')}`);
  return {title:ev.title,start,time:ev.time,location:ev.location,description:ev.description,image:ev.image||null};
}

/* ── FAST LOADING: timeout + localStorage cache (stale-while-revalidate) ── */
const EVENTS_CACHE_KEY = 'lc-events-cache-v3';
const EVENTS_CACHE_TTL = 5 * 60 * 1000;

function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms || 4000);
  return fetch(url, Object.assign({}, opts, { signal: ctrl.signal })).finally(() => clearTimeout(timer));
}
function saveEventsCache(events) {
  try {
    const serializable = events.map(e => Object.assign({}, e, { start: e.start.toISOString() }));
    localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify({ ts: Date.now(), events: serializable }));
  } catch (_) {}
}
function loadEventsCache() {
  try {
    const raw = localStorage.getItem(EVENTS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.events || !parsed.events.length) return null;
    return { ts: parsed.ts, events: parsed.events.map(e => Object.assign({}, e, { start: new Date(e.start) })) };
  } catch (_) { return null; }
}

/* ── MAIN FETCH ENTRY ────────────────────────────────────────── */
window.fetchAndRenderEvents = function(containerId, filterFn, limit) {
  const max = limit || 5;

  // Instant paint from cache — the section never sits on a skeleton
  // longer than it takes to read localStorage.
  const cached = loadEventsCache();
  if (cached) renderEvents(cached.events, containerId, filterFn, max);
  if (cached && (Date.now() - cached.ts) < EVENTS_CACHE_TTL) return; // fresh enough — skip the network entirely

  // Step 1: Google Calendar API (if API key set)
  if (GCAL_API_KEY) {
    const url=`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${GCAL_API_KEY}&timeMin=${encodeURIComponent(new Date().toISOString())}&maxResults=${max}&singleEvents=true&orderBy=startTime`;
    fetchWithTimeout(url, {}, 4000).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
      if(!data.items?.length) throw new Error('empty');
      const events=data.items.map(item=>{
        const sr=item.start?.dateTime||item.start?.date||'', allDay=!item.start?.dateTime, d=new Date(sr);
        const hh=d.getHours(),mm=d.getMinutes(),ampm=hh>=12?'PM':'AM';
        return {title:item.summary||'Untitled Event',start:d,time:allDay?'All Day':`${hh%12||12}:${String(mm).padStart(2,'0')} ${ampm}`,location:item.location||'',description:(item.description||'').replace(/<[^>]+>/g,' ').slice(0,180),image:null};
      });
      saveEventsCache(events);
      renderEvents(events,containerId,filterFn,max);
    }).catch(()=>tryServer(containerId,filterFn,max,!!cached));
    return;
  }
  tryServer(containerId,filterFn,max,!!cached);
};

function tryServer(containerId,filterFn,max,hadCache) {
  fetchWithTimeout('/api/events?max='+max, {}, 4500).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
    if(!data.success||!data.events?.length) throw new Error('empty');
    const events=data.events.map(apiEventToLocal);
    saveEventsCache(events);
    renderEvents(events,containerId,filterFn,max);
  }).catch(()=>tryICS(containerId,filterFn,max,hadCache));
}

function tryICS(containerId,filterFn,limit,hadCache) {
  const proxies=[
    'https://corsproxy.io/?url='+encodeURIComponent(ICS_URL),
    'https://api.allorigins.win/raw?url='+encodeURIComponent(ICS_URL),
  ];
  function tryP(i){
    if(i>=proxies.length){ if(!hadCache) showNoEvents(containerId); return; }
    fetchWithTimeout(proxies[i], {}, 4000).then(r=>r.ok?r.text():Promise.reject()).then(text=>{
      if(!text.includes('BEGIN:VCALENDAR')) throw new Error('bad ics');
      const evs=parseICS(text);
      if(!evs.length){ if(!hadCache) showNoEvents(containerId); return; }
      saveEventsCache(evs);
      renderEvents(evs,containerId,filterFn,limit);
    }).catch(()=>tryP(i+1));
  }
  tryP(0);
}

/* ══════════════════════════════════════════════════════════════
   VISUAL ENHANCEMENTS
   ══════════════════════════════════════════════════════════════ */

function initHeroParticles() {
  const canvas=document.getElementById('hero-canvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d'); let W,H,particles=[],raf;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  function Particle(){this.reset=function(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.2+0.3;this.vx=(Math.random()-.5)*.18;this.vy=-Math.random()*.22-.06;this.alpha=0;this.maxAlpha=Math.random()*.45+.15;this.life=0;this.maxLife=Math.random()*300+200;};this.reset();this.life=Math.random()*this.maxLife;}
  Particle.prototype.update=function(){this.life++;if(this.life>this.maxLife){this.reset();return;}const p=this.life/this.maxLife;this.alpha=p<.2?(p/.2)*this.maxAlpha:p>.8?((1-p)/.2)*this.maxAlpha:this.maxAlpha;this.x+=this.vx;this.y+=this.vy;};
  Particle.prototype.draw=function(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(201,169,110,${this.alpha})`;ctx.fill();};
  function init(){resize();particles=Array.from({length:Math.min(80,Math.floor(W*H/14000))},()=>new Particle());}
  function loop(){ctx.clearRect(0,0,W,H);particles.forEach(p=>{p.update();p.draw();});raf=requestAnimationFrame(loop);}
  init();loop();
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);init();loop();});
}

document.querySelectorAll('.hero-bg').forEach(el=>{
  const bgUrl=el.style.backgroundImage.replace(/url\(['"']?|['"']?\)/g,'');
  if(!bgUrl){el.classList.add('loaded');return;}
  const img=new Image(); img.onload=()=>el.classList.add('loaded'); img.src=bgUrl;
});

/* ── HERO VIDEO — plays the story video once, muted, then fades
   back to the poster image. Desktop/tablet only; mobile keeps the
   static poster to save data, and it's skipped for reduced-motion. */
function initHeroVideo() {
  const wrap = document.querySelector('.hero-yt-wrap');
  const iframe = document.getElementById('hero-yt-iframe');
  const heroSection = wrap && wrap.closest('.page-hero');
  if (!wrap || !iframe || !heroSection) return;
  if (window.matchMedia('(max-width: 767px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Reveal as soon as the embed itself has loaded — this does NOT
  // depend on the separate YouTube IFrame API script, so the video
  // still shows and autoplays even if that script gets blocked.
  iframe.addEventListener('load', () => heroSection.classList.add('video-active'), { once: true });
  // Safety net: if the load event never fires for some reason, still reveal it.
  setTimeout(() => heroSection.classList.add('video-active'), 2500);

  // Enhancement only: once the video finishes, fade back to the poster photo.
  function bindEnded() {
    try {
      new YT.Player(iframe, {
        events: {
          onStateChange: e => { if (e.data === YT.PlayerState.ENDED) heroSection.classList.remove('video-active'); }
        }
      });
    } catch (_) {}
  }
  if (window.YT && window.YT.Player) {
    bindEnded();
  } else {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prevReady) prevReady(); bindEnded(); };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
}

/* Ministry videos are direct Drive embeds (see HTML) — Drive's own
   player provides the play button, which is the most reliable single
   interaction Drive's embed supports. */

function initMagneticButtons() {
  if(window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{const rect=btn.getBoundingClientRect();const dx=(e.clientX-rect.left-rect.width/2)*.18,dy=(e.clientY-rect.top-rect.height/2)*.18;btn.style.transform=`translate(${dx}px,${dy}px)`;const sp=btn.querySelector('span');if(sp)sp.style.transform=`translate(${dx*.5}px,${dy*.5}px)`;});
    btn.addEventListener('mouseleave',()=>{btn.style.transform='';const sp=btn.querySelector('span');if(sp)sp.style.transform='';});
  });
}

function initRippleButtons() {
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click',e=>{const rect=btn.getBoundingClientRect();const size=Math.max(rect.width,rect.height);const c=document.createElement('span');c.className='ripple-circle';c.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;btn.appendChild(c);c.addEventListener('animationend',()=>c.remove());});
  });
}

function initParallax() {
  const heroBg=document.querySelector('.hero-bg');
  if(!heroBg||window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let t=false;
  window.addEventListener('scroll',()=>{if(!t){requestAnimationFrame(()=>{const h=heroBg.parentElement;if(h&&window.scrollY<h.offsetHeight)heroBg.style.transform=`translateY(${(window.scrollY/h.offsetHeight)*30}px)`;t=false;});t=true;}},{passive:true});
}

function initTiltCards() {
  if(window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.feature-card,.service-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*8,y=((e.clientY-r.top)/r.height-.5)*8;card.style.transform=`perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;});
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

function initCounterAnimations() {
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=parseInt(el.getAttribute('data-count')||'0',10),t0=performance.now();function step(now){const p=Math.min((now-t0)/1800,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target)+(el.getAttribute('data-suffix')||'');if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);obs.unobserve(el);});},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));
}

function initMobileMenuStagger() {
  document.querySelectorAll('.mobile-nav-links a').forEach((a,i)=>a.style.transitionDelay=`${.05+i*.05}s`);
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initStream();
  initHeroParticles();
  initHeroVideo();
  initMagneticButtons();
  initRippleButtons();
  initParallax();
  initTiltCards();
  initCounterAnimations();
  initMobileMenuStagger();
});
