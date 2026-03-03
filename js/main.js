/* ============================================
   LEE GROUP — Main JavaScript
   ============================================ */

// ---- i18n System ----
const translations = { en: null, ar: null };
let currentLang = localStorage.getItem('lee-lang') || 'en';

async function loadTranslations(lang) {
  if (translations[lang]) return translations[lang];
  try {
    const basePath = getBasePath();
    const res = await fetch(`${basePath}js/i18n/${lang}.json`);
    translations[lang] = await res.json();
    return translations[lang];
  } catch (e) {
    console.error(`Failed to load ${lang} translations:`, e);
    return {};
  }
}

function t(key) {
  const keys = key.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    if (!val) return key;
    val = val[k];
  }
  return val || key;
}

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/pages/')) return '../';
  return '';
}

async function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lee-lang', lang);
  await loadTranslations(lang);
  
  document.documentElement.lang = lang;
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'ar') {
    document.body.style.fontFamily = "'Cairo', sans-serif";
  } else {
    document.body.style.fontFamily = "'Inter', sans-serif";
  }
  
  // Update toggle buttons
  document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated && translated !== key) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translated;
      } else {
        el.innerHTML = translated;
      }
    }
  });
  
  // translate data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translated = t(key);
    if (translated && translated !== key) el.title = translated;
  });
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
  });
  
  // Close on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      }
    });
  });
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });
}

// ---- Back to Top ----
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- Active Nav Link ----
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.endsWith(href.replace('./', '').replace('../', ''))) {
      link.classList.add('active');
    }
  });
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show success message
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = currentLang === 'ar' ? 'تم الإرسال بنجاح!' : 'Message Sent!';
    btn.style.background = '#2e7d32';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ---- Shared Components ----
function getHeaderHTML() {
  const basePath = getBasePath();
  return `
  <div class="top-bar">
    <div class="container">
      <div class="top-bar__left">
        <a href="mailto:info@leeoilservices.com">📧 info@leeoilservices.com</a>
        <a href="tel:+201019841175">📞 +20 1019841175</a>
      </div>
      <div class="top-bar__right">
        <a href="#" data-i18n="nav.egypt_libya_uae">Egypt · Libya · UAE</a>
      </div>
    </div>
  </div>
  <header class="header" id="header">
    <div class="container">
      <a href="${basePath}index.html" class="header__logo">
        <svg viewBox="0 0 48 48" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flame-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#B5501F"/>
              <stop offset="50%" style="stop-color:#C0622B"/>
              <stop offset="100%" style="stop-color:#F5A623"/>
            </linearGradient>
          </defs>
          <path d="M24 4C24 4 10 18 10 30C10 38 16.3 44 24 44C31.7 44 38 38 38 30C38 18 24 4 24 4Z" fill="url(#flame-grad)"/>
          <path d="M24 20C24 20 18 28 18 33C18 36.3 20.7 39 24 39C27.3 39 30 36.3 30 33C30 28 24 20 24 20Z" fill="#fff" opacity="0.4"/>
        </svg>
        <div class="header__logo-text">
          <span data-i18n="header.brand_name">Lee Group</span>
          <span data-i18n="header.brand_sub">For Petroleum Services</span>
        </div>
      </a>
      
      <nav class="nav" id="main-nav">
        <a href="${basePath}index.html" class="nav__link" data-i18n="nav.home">Home</a>
        <a href="${basePath}pages/about.html" class="nav__link" data-i18n="nav.about">About</a>
        <div class="nav__dropdown">
          <a href="${basePath}pages/services.html" class="nav__link" data-i18n="nav.services">Services ▾</a>
          <div class="nav__dropdown-menu">
            <a href="${basePath}pages/service-downhole.html" data-i18n="nav.downhole">Downhole Services</a>
            <a href="${basePath}pages/service-wireline.html" data-i18n="nav.wireline">Wireline Services</a>
            <a href="${basePath}pages/service-inspection.html" data-i18n="nav.inspection">Inspection Services</a>
            <a href="${basePath}pages/service-bop.html" data-i18n="nav.bop">Blowout Preventers</a>
            <a href="${basePath}pages/service-machine-shop.html" data-i18n="nav.machine_shop">Machine Shop</a>
            <a href="${basePath}pages/service-chemical.html" data-i18n="nav.chemical">Chemical Supply</a>
          </div>
        </div>
        <a href="${basePath}pages/agencies.html" class="nav__link" data-i18n="nav.agencies">Agencies</a>
        <a href="${basePath}pages/partners.html" class="nav__link" data-i18n="nav.partners">Partners</a>
        <a href="${basePath}pages/contact.html" class="nav__link" data-i18n="nav.contact">Contact</a>
        
        <div class="lang-toggle">
          <button class="lang-toggle__btn active" data-lang="en" onclick="setLanguage('en')">EN</button>
          <button class="lang-toggle__btn" data-lang="ar" onclick="setLanguage('ar')">عر</button>
        </div>
      </nav>
      
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

function getFooterHTML() {
  const basePath = getBasePath();
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="${basePath}index.html" class="header__logo" style="margin-bottom: var(--space-md);">
            <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="flame-grad-f" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#B5501F"/><stop offset="50%" style="stop-color:#C0622B"/><stop offset="100%" style="stop-color:#F5A623"/></linearGradient></defs>
              <path d="M24 4C24 4 10 18 10 30C10 38 16.3 44 24 44C31.7 44 38 38 38 30C38 18 24 4 24 4Z" fill="url(#flame-grad-f)"/>
              <path d="M24 20C24 20 18 28 18 33C18 36.3 20.7 39 24 39C27.3 39 30 36.3 30 33C30 28 24 20 24 20Z" fill="#fff" opacity="0.4"/>
            </svg>
            <div class="header__logo-text">
              Lee Group
              <span>For Petroleum Services</span>
            </div>
          </a>
          <p data-i18n="footer.description">A leading provider of innovative petroleum services, committed to delivering exceptional solutions across Egypt, Libya & UAE.</p>
          <div class="footer__certifications">
            <span class="footer__cert-badge">API Q1</span>
            <span class="footer__cert-badge">ISO 9001:2015</span>
            <span class="footer__cert-badge">API 5CT</span>
            <span class="footer__cert-badge">API 6A</span>
            <span class="footer__cert-badge">API 7-1</span>
            <span class="footer__cert-badge">Zero Waste</span>
          </div>
        </div>
        
        <div>
          <h4 class="footer__title" data-i18n="footer.quick_links">Quick Links</h4>
          <ul class="footer__links">
            <li><a href="${basePath}index.html" data-i18n="nav.home">→ Home</a></li>
            <li><a href="${basePath}pages/about.html" data-i18n="nav.about">→ About</a></li>
            <li><a href="${basePath}pages/services.html" data-i18n="nav.services">→ Services</a></li>
            <li><a href="${basePath}pages/agencies.html" data-i18n="nav.agencies">→ Agencies</a></li>
            <li><a href="${basePath}pages/partners.html" data-i18n="nav.partners">→ Partners</a></li>
            <li><a href="${basePath}pages/contact.html" data-i18n="nav.contact">→ Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="footer__title" data-i18n="footer.services">Services</h4>
          <ul class="footer__links">
            <li><a href="${basePath}pages/service-downhole.html" data-i18n="nav.downhole">→ Downhole</a></li>
            <li><a href="${basePath}pages/service-wireline.html" data-i18n="nav.wireline">→ Wireline</a></li>
            <li><a href="${basePath}pages/service-inspection.html" data-i18n="nav.inspection">→ Inspection</a></li>
            <li><a href="${basePath}pages/service-bop.html" data-i18n="nav.bop">→ BOP</a></li>
            <li><a href="${basePath}pages/service-machine-shop.html" data-i18n="nav.machine_shop">→ Machine Shop</a></li>
            <li><a href="${basePath}pages/service-chemical.html" data-i18n="nav.chemical">→ Chemicals</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="footer__title" data-i18n="footer.contact_us">Contact Us</h4>
          <div class="footer__contact-item">
            <span class="footer__contact-icon">📍</span>
            <span data-i18n="footer.address">Villa 14, District 9, 1st Settlement, New Cairo, Egypt</span>
          </div>
          <div class="footer__contact-item">
            <span class="footer__contact-icon">📞</span>
            <span><a href="tel:+201019841175">+20 1019841175</a><br><a href="tel:+201007125147">+20 1007125147</a></span>
          </div>
          <div class="footer__contact-item">
            <span class="footer__contact-icon">📧</span>
            <span><a href="mailto:info@leeoilservices.com">info@leeoilservices.com</a></span>
          </div>
          <div class="footer__contact-item">
            <span class="footer__contact-icon">🌐</span>
            <span><a href="https://www.leeoilservices.com" target="_blank">www.leeoilservices.com</a></span>
          </div>
        </div>
      </div>
      
      <div class="footer__bottom">
        <span>&copy; 2022–${new Date().getFullYear()} Lee Group For Petroleum Services. <span data-i18n="footer.rights">All Rights Reserved.</span></span>
        <span data-i18n="footer.made_with">Designed with ❤️ in Egypt</span>
      </div>
    </div>
  </footer>
  
  <button class="back-to-top" id="back-to-top" aria-label="Back to top">↑</button>`;
}

// ---- Initialize Page ----
async function initPage() {
  // Insert header & footer
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');
  if (headerContainer) headerContainer.innerHTML = getHeaderHTML();
  if (footerContainer) footerContainer.innerHTML = getFooterHTML();
  
  // Load translations & set language
  await loadTranslations(currentLang);
  await setLanguage(currentLang);
  
  // Init components
  initMobileMenu();
  initScrollAnimations();
  initBackToTop();
  setActiveNav();
  initContactForm();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initPage);
