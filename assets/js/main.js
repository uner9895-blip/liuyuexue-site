/**
 * 步青尘个人网页 - 静态站基础交互与特效系统
 */

function initAll() {
  initLivingInkScene();
  initWorldState();
  initMobileMenu();
  initContactForm();
  initCopyActions();
  initActiveNavLink();
  initScrollReveal();
  initSkillExplanations();
  initBackToTop();
  initThemeToggle();
  initMusicWidget();
  initMusicPlaybarDock();
  initMusicPlaybarReveal();
  initDomPlumTrail();
  initInkRipples();
  initSnowLettersPage();
  initHomeLatestSnowLetters();
  initGalleryPage();
  initLearningPage();
  initHomeStage();
  initHomeRouteMap();
  initHomeSunResponse();
  initCompanionCat();
  initLightParallax();
}

/**
 * 数据层入口：所有内容来自 assets/data/site-data.js（window.siteData）。
 * 若数据脚本缺失则优雅降级为空集合，绝不让页面骨架崩溃。
 */
const siteData = window.siteData || {};
const musicTracks = siteData.musicTracks || window.musicTracks || [];

window.musicTracks = musicTracks;

let sharedSiteAudio = null;

function getSiteAudio() {
  if (!sharedSiteAudio) {
    sharedSiteAudio = new Audio();
    sharedSiteAudio.preload = 'metadata';
    sharedSiteAudio.playsInline = true;
  }

  return sharedSiteAudio;
}

window.getSiteAudio = getSiteAudio;

const snowLetterPosts = siteData.articles || window.snowLetterPosts || [];

window.snowLetterPosts = snowLetterPosts;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

function initLivingInkScene() {
  if (document.querySelector('.living-ink-scene')) return;

  const scene = document.createElement('div');
  scene.className = 'living-ink-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = `
    <svg class="living-ink-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="paperMist" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="16"/>
        </filter>
        <filter id="inkEdge" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.042" numOctaves="3" seed="17"/>
          <feDisplacementMap in="SourceGraphic" scale="11"/>
          <feGaussianBlur stdDeviation="0.45"/>
        </filter>
        <filter id="dryBrush" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.22" numOctaves="2" seed="24"/>
          <feDisplacementMap in="SourceGraphic" scale="5"/>
        </filter>
        <radialGradient id="livingSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d8bd7a" stop-opacity="0.36"/>
          <stop offset="55%" stop-color="#c7aa68" stop-opacity="0.16"/>
          <stop offset="100%" stop-color="#c6a86a" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="mountainInkA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#202923" stop-opacity="0.44"/>
          <stop offset="58%" stop-color="#5f695f" stop-opacity="0.23"/>
          <stop offset="100%" stop-color="#efe8d9" stop-opacity="0.02"/>
        </linearGradient>
        <linearGradient id="mountainInkB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#313a34" stop-opacity="0.26"/>
          <stop offset="65%" stop-color="#8a9085" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#faf7ef" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="riverInk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#faf7ef" stop-opacity="0"/>
          <stop offset="42%" stop-color="#7f877d" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#303a34" stop-opacity="0.08"/>
        </linearGradient>
        <linearGradient id="bambooStem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8da27c" stop-opacity="0.54"/>
          <stop offset="54%" stop-color="#566952" stop-opacity="0.42"/>
          <stop offset="100%" stop-color="#202923" stop-opacity="0.28"/>
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="#faf7ef" opacity="0.18"/>

      <g class="living-ink-sun">
        <circle cx="615" cy="142" r="62" fill="url(#livingSun)"/>
        <circle cx="615" cy="142" r="34" fill="#d6bd7d" opacity="0.08"/>
      </g>

      <g class="living-ink-birds" fill="none" stroke="#252a27" stroke-width="2" stroke-linecap="round" opacity="0.38">
        <path d="M682 184 q12 -10 24 0 q12 -10 24 0"/>
        <path d="M748 148 q9 -8 18 0 q9 -8 18 0" opacity="0.72"/>
        <path d="M618 132 q8 -7 16 0 q8 -7 16 0" opacity="0.58"/>
        <path d="M816 202 q7 -6 14 0 q7 -6 14 0" opacity="0.46"/>
      </g>

      <g class="living-ink-mountains" filter="url(#inkEdge)">
        <path d="M-90 592 C20 468 86 522 158 354 C202 252 282 178 330 308 C368 414 420 402 502 326 C580 252 662 310 744 252 C696 386 618 498 494 584 C350 684 138 696 -90 662 Z" fill="url(#mountainInkA)" opacity="0.48"/>
        <path d="M-80 638 C28 548 124 568 210 468 C274 394 322 454 390 398 C468 334 544 422 650 358 C598 500 456 642 246 690 C112 722 10 704 -80 678 Z" fill="#303a34" opacity="0.18"/>
        <path d="M-64 535 C46 454 122 460 194 378 C238 326 276 352 326 300 C368 256 408 296 446 260 C420 352 358 446 270 514 C162 598 54 600 -64 584 Z" fill="#1f2823" opacity="0.16"/>
        <path d="M46 690 C142 616 230 650 330 574 C426 500 484 548 584 500 C528 616 404 704 244 730 C158 744 86 730 46 704 Z" fill="url(#mountainInkB)" opacity="0.4"/>
        <path d="M84 486 C182 432 282 456 370 410 C456 365 534 404 610 354" fill="none" stroke="#747970" stroke-width="8" stroke-linecap="round" opacity="0.1" filter="url(#dryBrush)"/>
        <path d="M338 302 C328 360 315 424 282 506" fill="none" stroke="#faf7ef" stroke-width="6" stroke-linecap="round" opacity="0.58"/>
        <path d="M356 332 C350 386 342 428 318 470" fill="none" stroke="#faf7ef" stroke-width="2.5" stroke-linecap="round" opacity="0.42"/>
        <g fill="#202923" opacity="0.18">
          <path d="M122 520 c6 -5 13 -3 14 4 c-4 6 -13 6 -16 0 c-1 -2 0 -3 2 -4"/>
          <path d="M170 496 c4 -4 9 -2 10 3 c-3 4 -9 4 -11 0 c-1 -1 0 -2 1 -3"/>
          <path d="M216 552 c5 -5 12 -3 13 3 c-4 6 -11 6 -14 0 c-1 -1 0 -2 1 -3"/>
          <path d="M438 454 c4 -4 10 -2 12 3 c-3 6 -11 6 -13 1 c-1 -2 0 -3 1 -4"/>
          <path d="M510 482 c5 -5 12 -3 14 3 c-4 6 -12 6 -15 1 c-1 -2 0 -3 1 -4"/>
        </g>
      </g>

      <g class="living-ink-river" fill="none" stroke-linecap="round" filter="url(#dryBrush)">
        <path d="M540 328 C642 412 780 420 846 506 C900 576 854 626 734 664 C610 704 492 758 546 900" stroke="url(#riverInk)" stroke-width="34" opacity="0.24"/>
        <path d="M560 360 C656 430 790 448 826 526 C856 590 742 630 638 678" stroke="#6f7770" stroke-width="3" opacity="0.22" stroke-dasharray="160 36 90 52"/>
        <path d="M518 748 C606 704 696 706 784 660" stroke="#9a9589" stroke-width="1.8" opacity="0.28" stroke-dasharray="82 34 48 22"/>
        <path d="M618 548 C706 580 766 560 838 514" stroke="#6f7770" stroke-width="1.5" opacity="0.22" stroke-dasharray="70 26"/>
        <path d="M706 812 C760 780 814 764 894 752" stroke="#c6a86a" stroke-width="1.1" opacity="0.18" stroke-dasharray="52 32"/>
      </g>

      <g class="living-ink-mist" filter="url(#paperMist)" fill="none" stroke="#faf7ef" stroke-linecap="round" opacity="0.68">
        <path d="M64 526 C210 488 342 526 500 496 C654 466 762 504 922 468" stroke-width="36"/>
        <path d="M394 294 C568 260 726 288 896 250" stroke-width="24" opacity="0.66"/>
        <path d="M476 620 C650 590 790 630 966 596" stroke-width="28" opacity="0.44"/>
      </g>

      <g class="living-ink-bamboo" fill="none" stroke-linecap="round">
        <path d="M1148 -28 C1125 176 1162 420 1130 928" stroke="url(#bambooStem)" stroke-width="13"/>
        <path d="M1226 -18 C1198 220 1230 488 1204 930" stroke="#3f4c42" stroke-width="15" opacity="0.42"/>
        <path d="M1304 -40 C1264 252 1302 528 1268 934" stroke="#252a27" stroke-width="11" opacity="0.32"/>
        <g stroke="#202923" opacity="0.28" stroke-width="2">
          <path d="M1138 102 C1148 108 1158 108 1168 101"/>
          <path d="M1136 218 C1148 225 1161 224 1174 216"/>
          <path d="M1128 342 C1142 350 1158 348 1172 338"/>
          <path d="M1218 110 C1230 116 1242 116 1256 106"/>
          <path d="M1210 246 C1224 254 1238 252 1252 242"/>
          <path d="M1294 128 C1306 134 1318 132 1330 123"/>
          <path d="M1284 276 C1298 284 1312 282 1326 272"/>
        </g>
        <g stroke="#6f8766" stroke-width="2.2" opacity="0.46">
          <path d="M1114 88 C1074 74 1024 44 988 8"/>
          <path d="M1128 154 C1072 142 1014 114 964 66"/>
          <path d="M1168 246 C1104 232 1040 206 990 164"/>
          <path d="M1232 336 C1172 338 1112 318 1064 276"/>
          <path d="M1212 132 C1272 116 1328 122 1400 154"/>
          <path d="M1238 62 C1290 38 1334 38 1394 70"/>
        </g>
        <g class="living-ink-bamboo-leaves" opacity="0.58">
          <path d="M1048 48 C1092 28 1122 46 1166 84 C1116 88 1078 76 1048 48 Z" fill="#6f8766"/>
          <path d="M990 14 C1034 5 1068 28 1100 66 C1052 62 1016 48 990 14 Z" fill="#8ca37d" opacity="0.82"/>
          <path d="M984 128 C1038 108 1082 122 1120 166 C1062 170 1020 154 984 128 Z" fill="#5e7658"/>
          <path d="M1094 178 C1144 154 1192 162 1240 202 C1182 214 1138 204 1094 178 Z" fill="#6f8766"/>
          <path d="M1166 276 C1220 248 1276 254 1338 300 C1268 318 1218 306 1166 276 Z" fill="#5d7255"/>
          <path d="M1250 132 C1304 108 1354 114 1408 152 C1346 168 1300 158 1250 132 Z" fill="#819a72"/>
          <path d="M1220 58 C1266 32 1310 36 1360 68 C1304 90 1264 82 1220 58 Z" fill="#6b8362"/>
        </g>
      </g>

      <g class="living-ink-plum" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-24 858 C70 806 116 730 178 704 C238 678 290 710 344 650" stroke="#252a27" stroke-width="8.5" opacity="0.76" filter="url(#dryBrush)"/>
        <path d="M116 752 C146 724 166 700 180 660" stroke="#3d443f" stroke-width="4.4" opacity="0.7"/>
        <path d="M206 694 C236 660 268 642 312 632" stroke="#3d443f" stroke-width="3.8" opacity="0.66"/>
        <path d="M70 804 C52 764 46 732 56 696" stroke="#3d443f" stroke-width="4" opacity="0.62"/>
        <g class="living-ink-plum-blossoms" fill="#c94b52" opacity="0.86">
          <path d="M128 722 c6 -12 16 -9 14 2 c11 -2 15 8 4 14 c7 9 -1 17 -11 11 c-6 10 -16 5 -13 -7 c-12 0 -14 -11 -3 -15 c2 -1 5 -3 9 -5 Z"/>
          <path d="M174 660 c5 -10 14 -8 13 2 c10 -2 14 7 4 12 c6 8 -1 15 -10 10 c-5 9 -14 4 -12 -6 c-10 -1 -12 -10 -3 -13 c2 -1 5 -2 8 -5 Z" opacity="0.78"/>
          <path d="M218 682 c6 -11 16 -8 14 3 c10 -3 15 7 4 13 c7 8 -1 16 -10 10 c-6 10 -16 5 -13 -6 c-11 0 -14 -10 -4 -14 c3 -1 6 -3 9 -6 Z" opacity="0.76"/>
          <path d="M286 636 c4 -8 12 -6 11 1 c8 -2 12 5 4 10 c5 6 -1 12 -8 8 c-5 7 -12 3 -10 -5 c-8 0 -10 -8 -2 -11 c1 -1 3 -1 5 -3 Z" opacity="0.76"/>
          <path d="M58 700 c5 -9 13 -7 12 2 c9 -2 13 6 4 11 c5 7 -1 14 -9 9 c-5 8 -13 4 -11 -5 c-9 0 -11 -9 -3 -12 c2 -1 4 -2 7 -5 Z" opacity="0.72"/>
          <path d="M92 784 c3 -6 9 -5 9 1 c7 -1 9 5 3 8 c4 5 -1 10 -7 7 c-3 6 -9 3 -8 -4 c-7 0 -8 -6 -2 -8 c1 -1 3 -2 5 -4 Z" opacity="0.74"/>
          <circle cx="152" cy="758" r="3" fill="#b83e46" opacity="0.66"/>
          <circle cx="196" cy="676" r="2.6" fill="#b83e46" opacity="0.64"/>
          <circle cx="250" cy="654" r="3.2" fill="#b83e46" opacity="0.66"/>
        </g>
      </g>
    </svg>`;

  document.body.insertBefore(scene, document.body.firstChild);
}

/**
 * 移动端导航交互
 */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.getElementById('site-menu') || document.querySelector('.nav-menu');

  if (!burgerBtn || !navMenu) return;
  if (burgerBtn.dataset.mobileMenuReady === 'true') return;
  burgerBtn.dataset.mobileMenuReady = 'true';

  let backdrop = document.querySelector('.mobile-menu-backdrop');
  let lockedScrollY = 0;
  let isMenuOpen = false;
  let isScrollLocked = false;
  let previousScrollBehavior = '';

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  if (!navMenu.querySelector('.nav-drawer-header')) {
    const drawerHeader = document.createElement('li');
    drawerHeader.className = 'nav-drawer-header';
    const drawerBrand = document.body.classList.contains('page-home')
      ? '<span class="nav-drawer-brand"><span>步青尘</span></span>'
      : '<span class="nav-drawer-brand"><span class="seal">青尘<br>印</span><span>步青尘</span></span>';
    drawerHeader.innerHTML = `
      ${drawerBrand}
      <button class="nav-drawer-close" type="button" aria-label="关闭导航菜单">×</button>
    `;
    navMenu.insertBefore(drawerHeader, navMenu.firstElementChild);
  }

  const closeBtn = navMenu.querySelector('.nav-drawer-close');
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const originalMenuParent = navMenu.parentNode;
  const originalMenuNextSibling = navMenu.nextSibling;

  const moveMenuToBody = () => {
    if (navMenu.parentNode !== document.body) {
      document.body.appendChild(navMenu);
    }
  };

  const restoreMenuPosition = () => {
    if (!originalMenuParent || navMenu.parentNode === originalMenuParent) return;
    originalMenuParent.insertBefore(navMenu, originalMenuNextSibling);
  };

  const getInertTargets = () => {
    const targets = document.querySelectorAll('main, footer, .music-widget, .music-playbar-container, .music-pendant, .back-to-top');
    return Array.from(targets).filter((element, index, list) => {
      return list.indexOf(element) === index && !element.contains(navMenu) && !navMenu.contains(element);
    });
  };

  const lockPageScroll = () => {
    if (isScrollLocked) return;
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + lockedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.classList.add('menu-open');
    isScrollLocked = true;
  };

  const unlockPageScroll = () => {
    if (!isScrollLocked) return;
    document.body.classList.remove('menu-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    isScrollLocked = false;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockedScrollY);
    window.requestAnimationFrame(() => {
      window.scrollTo(0, lockedScrollY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    });
  };

  const setBackgroundInert = (inert) => {
    getInertTargets().forEach((element) => {
      if (inert) {
        element.dataset.menuWasInert = element.inert ? 'true' : 'false';
        element.inert = true;
      } else {
        element.inert = element.dataset.menuWasInert === 'true';
        delete element.dataset.menuWasInert;
      }
    });
  };

  const focusDrawer = () => {
    const firstFocusable = closeBtn || navMenu.querySelector(focusableSelector);
    if (firstFocusable) {
      firstFocusable.focus({ preventScroll: true });
    }
  };

  const setMobileMenu = (open, options = {}) => {
    const shouldReturnFocus = options.returnFocus !== false;
    if (open === isMenuOpen) return;

    if (open) {
      moveMenuToBody();
    }

    isMenuOpen = open;
    navMenu.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
    burgerBtn.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    backdrop.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);

    if (open) {
      lockPageScroll();
      setBackgroundInert(true);
      window.requestAnimationFrame(focusDrawer);
      return;
    }

    setBackgroundInert(false);
    unlockPageScroll();
    restoreMenuPosition();
    if (shouldReturnFocus) {
      burgerBtn.focus({ preventScroll: true });
    }
  };

  const trapFocus = (event) => {
    if (!isMenuOpen || event.key !== 'Tab') return;
    const focusableItems = Array.from(navMenu.querySelectorAll(focusableSelector))
      .filter((element) => element.offsetParent !== null || element === document.activeElement);
    if (!focusableItems.length) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus({ preventScroll: true });
    }
  };

  burgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    setMobileMenu(!isMenuOpen);
  });

  closeBtn?.addEventListener('click', () => setMobileMenu(false));

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileMenu(false));
  });

  backdrop.addEventListener('click', () => setMobileMenu(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen) {
      setMobileMenu(false);
      return;
    }
    trapFocus(event);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
      setMobileMenu(false, { returnFocus: false });
    }
  });
}

/**
 * 静态联系人表单模拟提交
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('form-name')?.value.trim() || '';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const message = document.getElementById('form-message')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('请填写完整后再提交');
      return;
    }

    showToast('已模拟提交，当前静态站暂不支持真实发送。');
    contactForm.reset();
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/**
 * HTML 转义，供数据驱动的模板渲染使用（影像廊 / 学习路等）。
 */
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char];
  });
}

/**
 * 导航菜单高亮
 */
function initActiveNavLink() {
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '/' || currentPage === '') {
    currentPage = 'index.html';
  }

  document.querySelectorAll('.nav-item').forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const isActive = href === currentPage;

    item.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 滚动渐现观察器
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

function initSkillExplanations() {
  const skillsSection = document.querySelector('.skills-section');
  if (!skillsSection || skillsSection.dataset.skillsReady === 'true') return;

  const skillButtons = Array.from(skillsSection.querySelectorAll('.skill-tag[aria-controls]'));
  const skillPanels = Array.from(skillsSection.querySelectorAll('.skill-detail'));
  if (!skillButtons.length || !skillPanels.length) return;

  skillsSection.dataset.skillsReady = 'true';

  const closeAllSkillPanels = () => {
    skillButtons.forEach(button => {
      button.classList.remove('is-active');
      button.setAttribute('aria-expanded', 'false');
    });
    skillPanels.forEach(panel => {
      panel.hidden = true;
      panel.classList.remove('is-open');
    });
  };

  skillsSection.addEventListener('click', event => {
    const button = event.target.closest('.skill-tag[aria-controls]');
    if (!button || !skillsSection.contains(button)) return;

    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
    closeAllSkillPanels();

    if (!shouldOpen) return;

    button.classList.add('is-active');
    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    window.requestAnimationFrame(() => {
      panel.classList.add('is-open');
    });
  });
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
  const btn = document.createElement('div');
  btn.className = 'back-to-top';
  btn.id = 'back-to-top';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', '返回顶部');
  btn.setAttribute('tabindex', '0');
  btn.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  const scrollBack = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  btn.addEventListener('click', scrollBack);
}

/**
 * 1. 白天/夜晚模式切换状态控制
 */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  if (toggleBtns.length === 0) return;

  const getTheme = () => {
    return document.documentElement.getAttribute('data-theme') || document.documentElement.dataset.theme || 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.dataset.theme = theme;
    // 世界状态：data-theme(light/dark) 与 data-world(day/night) 保持镜像，
    // 现有暗色样式继续生效，[data-world="night"] 留给 Codex 挂接夜行场景。
    document.documentElement.setAttribute('data-world', theme === 'dark' ? 'night' : 'day');
    localStorage.setItem('theme', theme);
    if (document.body.classList.contains('page-home')) {
      localStorage.setItem('home-world', theme === 'dark' ? 'night' : 'day');
    }
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });
}

/**
 * 2. 听雪小筑音乐挂件播放逻辑
 */
function initMusicWidget() {
  if (document.body.classList.contains('page-music')) return;

  const pendant = document.querySelector('.music-pendant');
  const card = document.querySelector('.music-card');
  const playBtn = document.querySelector('.music-play-btn');
  const volume = document.querySelector('.volume-slider');
  const title = document.querySelector('.music-title');
  const subtitle = document.querySelector('.music-subtitle');

  if (!pendant || !card || !playBtn) return;
  if (pendant.dataset.musicWidgetReady === 'true') return;

  const track = musicTracks[0];
  if (!track) return;
  pendant.dataset.musicWidgetReady = 'true';

  document.addEventListener('click', (e) => {
    if (!card.contains(e.target) && !pendant.contains(e.target)) {
      card.classList.remove('show');
      pendant.setAttribute('aria-expanded', 'false');
    }
  });

  const audio = getSiteAudio();
  audio.loop = true;

  if (title) title.textContent = track.title;
  if (subtitle) subtitle.textContent = track.artist + ' · ' + track.duration;

  audio.addEventListener('error', () => {
    console.error('Audio load failed:', {
      src: audio.currentSrc || audio.src,
      errorCode: audio.error?.code
    });
    showToast('音频文件未找到，请检查 ' + track.src);
    updateMusicUI(false);
  });

  const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

  function updateMusicUI(playing) {
    playBtn.innerHTML = playing ? pauseIcon : playIcon;
    pendant.classList.toggle('playing', playing);
    playBtn.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
    pendant.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
  }

  function toggleMusic() {
    const targetSrc = new URL(track.src, window.location.href).href;
    if (audio.src !== targetSrc) {
      audio.src = track.src;
      audio.load();
    }

    if (audio.paused) {
      audio.play().then(() => {
        updateMusicUI(true);
      }).catch(err => {
        console.log('音频播放失败，请检查浏览器权限或文件路径 ' + track.src, err);
        showToast('音频播放失败，请检查浏览器权限或文件路径 ' + track.src);
        updateMusicUI(false);
      });
    } else {
      audio.pause();
      updateMusicUI(false);
    }
  }

  pendant.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.add('show');
    pendant.setAttribute('aria-expanded', 'true');
    toggleMusic();
  });

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  if (volume) {
    audio.volume = volume.value;
    volume.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createPlumPetal(x, y, options) {
  options = options || {};
  var petal = document.createElement('span');
  petal.className = options.className ? 'plum-petal ' + options.className : 'plum-petal';

  var flowers = ['❀', '✿', '❁'];
  var colors = [
    'rgba(204, 67, 67, 0.92)',
    'rgba(216, 70, 84, 0.86)',
    'rgba(251, 202, 208, 0.78)'
  ];
  petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];

  var size = options.size || randomBetween(18, 32);
  var life = options.life || randomBetween(2800, 4200);
  var driftX = typeof options.driftX === 'number' ? options.driftX : ((Math.random() - 0.5) * 86);
  var driftY = typeof options.driftY === 'number' ? options.driftY : (58 + Math.random() * 84);
  var rotate = typeof options.rotate === 'number' ? options.rotate : ((Math.random() - 0.5) * 120);
  var rotateMid = typeof options.rotateMid === 'number' ? options.rotateMid : rotate + 88;
  var rotateEnd = typeof options.rotateEnd === 'number' ? options.rotateEnd : rotate + 180;
  var color = options.color || colors[Math.floor(Math.random() * colors.length)];
  var opacity = typeof options.opacity === 'number' ? options.opacity : randomBetween(0.85, 1);
  var midOpacity = typeof options.midOpacity === 'number' ? options.midOpacity : Math.max(0.5, opacity - 0.14);

  petal.style.left = x + 'px';
  petal.style.top = y + 'px';
  petal.style.fontSize = size + 'px';
  petal.style.display = 'block';
  petal.style.visibility = 'visible';
  petal.style.opacity = '1';
  petal.style.setProperty('--petal-life', life + 'ms');
  petal.style.setProperty('--petal-drift-x', driftX + 'px');
  petal.style.setProperty('--petal-drift-y', driftY + 'px');
  petal.style.setProperty('--petal-mid-x', (driftX * 0.62) + 'px');
  petal.style.setProperty('--petal-mid-y', (driftY * 0.55) + 'px');
  petal.style.setProperty('--petal-rotate', rotate + 'deg');
  petal.style.setProperty('--petal-rotate-mid', rotateMid + 'deg');
  petal.style.setProperty('--petal-rotate-end', rotateEnd + 'deg');
  petal.style.setProperty('--petal-color', color);
  petal.style.setProperty('--petal-peak-opacity', opacity);
  petal.style.setProperty('--petal-mid-opacity', midOpacity);

  var existingPetals = document.querySelectorAll('.plum-petal');
  if (existingPetals.length >= 16) {
    existingPetals[0].remove();
  }

  document.body.appendChild(petal);

  if (window.__plumTrailState) {
    window.__plumTrailState.petalsCreated += 1;
  }

  var removePetal = function () {
    if (petal.parentNode) {
      petal.remove();
    }
  };

  petal.addEventListener('animationend', removePetal, { once: true });
  window.setTimeout(removePetal, life + 250);
}

function initDomPlumTrail() {
  if (window.__plumTrailController && window.__plumTrailController.initialized) {
    window.__plumTrailController.duplicateInitSkips += 1;
    if (window.__plumTrailState) window.__plumTrailState.duplicateInitSkips = window.__plumTrailController.duplicateInitSkips;
    return;
  }

  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointerQuery = window.matchMedia('(pointer: fine)');
  var coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  var hoverQuery = window.matchMedia('(hover: hover)');
  var hoverNoneQuery = window.matchMedia('(hover: none)');
  var mobileViewportQuery = window.matchMedia('(max-width: 820px)');
  var trailConfig = {
    throttleMin: 105,
    throttleMax: 145,
    durationMin: 1400,
    durationMax: 2050,
    sizeMin: 14,
    sizeMax: 22,
    opacityMin: 0.68,
    opacityMax: 0.9,
    jitter: 12,
    driftX: 46,
    driftYMin: 34,
    driftYMax: 70,
    rotateBase: 72,
    rotateStepMin: 38,
    rotateStepMax: 92
  };
  var controller = window.__plumTrailController = {
    initialized: true,
    registered: false,
    listenerCount: 0,
    duplicateInitSkips: 0,
    cleaned: false
  };
  var lastSpawnTime = 0;
  var spawnInterval = Math.round(randomBetween(trailConfig.throttleMin, trailConfig.throttleMax));

  window.__plumTrailState = {
    enabled: false,
    prefersReducedMotion: reducedMotionQuery.matches,
    hasFinePointer: finePointerQuery.matches,
    hasCoarsePointer: coarsePointerQuery.matches,
    hasHover: hoverQuery.matches,
    hoverNone: hoverNoneQuery.matches,
    isMobileViewport: mobileViewportQuery.matches,
    viewportWidth: window.innerWidth,
    throttle: spawnInterval,
    listenerCount: 0,
    duplicateInitSkips: 0,
    lastEventType: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    petalsCreated: 0,
    disabledReason: null
  };

  function getEligibility() {
    var pureTouch = coarsePointerQuery.matches && !finePointerQuery.matches;
    var enabled = !reducedMotionQuery.matches && finePointerQuery.matches && hoverQuery.matches && !coarsePointerQuery.matches && !pureTouch && !mobileViewportQuery.matches;
    var reason = null;
    if (reducedMotionQuery.matches) reason = 'prefers-reduced-motion';
    else if (coarsePointerQuery.matches || pureTouch) reason = 'coarse-or-touch-pointer';
    else if (mobileViewportQuery.matches) reason = 'mobile-viewport';
    else if (!hoverQuery.matches) reason = 'hover-unavailable';
    else if (!finePointerQuery.matches) reason = 'fine-pointer-unavailable';
    return { enabled: enabled, pureTouch: pureTouch, reason: reason };
  }

  function syncState() {
    var eligibility = getEligibility();
    var state = window.__plumTrailState;
    state.enabled = eligibility.enabled;
    state.prefersReducedMotion = reducedMotionQuery.matches;
    state.hasFinePointer = finePointerQuery.matches;
    state.hasCoarsePointer = coarsePointerQuery.matches;
    state.hasHover = hoverQuery.matches;
    state.hoverNone = hoverNoneQuery.matches;
    state.isPureTouch = eligibility.pureTouch;
    state.isMobileViewport = mobileViewportQuery.matches;
    state.viewportWidth = window.innerWidth;
    state.disabledReason = eligibility.reason;
    return eligibility.enabled;
  }

  function buildPetalOptions() {
    var rotate = (Math.random() - 0.5) * trailConfig.rotateBase;
    var rotateStep = randomBetween(trailConfig.rotateStepMin, trailConfig.rotateStepMax);
    var depth = Math.random();
    var depthClass = depth > 0.74 ? 'plum-petal--near' : (depth < 0.3 ? 'plum-petal--far' : '');
    var petalColors = [
      'rgba(151, 42, 53, 0.86)',
      'rgba(188, 58, 72, 0.8)',
      'rgba(238, 224, 211, 0.82)',
      'rgba(210, 169, 82, 0.68)'
    ];

    return {
      className: depthClass,
      size: randomBetween(trailConfig.sizeMin, trailConfig.sizeMax) * (depthClass === 'plum-petal--near' ? 1.06 : 0.92),
      life: randomBetween(trailConfig.durationMin, trailConfig.durationMax),
      driftX: (Math.random() - 0.5) * trailConfig.driftX * (depthClass === 'plum-petal--far' ? 0.72 : 1),
      driftY: randomBetween(trailConfig.driftYMin, trailConfig.driftYMax) * (depthClass === 'plum-petal--far' ? 0.8 : 1),
      rotate: rotate,
      rotateMid: rotate + rotateStep * 0.5,
      rotateEnd: rotate + rotateStep,
      opacity: randomBetween(trailConfig.opacityMin, trailConfig.opacityMax) * (depthClass === 'plum-petal--far' ? 0.78 : 1),
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    };
  }

  function handlePlumMove(event) {
    if (!window.__plumTrailState.enabled || (event.pointerType && event.pointerType !== 'mouse')) return;
    if (event.target instanceof Element && event.target.closest('header, nav, a, button, input, textarea, select, [role="dialog"], .music-note, .music-player, .music-index-drawer, .hero-copy, .page-title, .page-subtitle')) return;

    var now = Date.now();
    var state = window.__plumTrailState;
    state.lastEventType = event.type;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastTime = now;
    if (now - lastSpawnTime < spawnInterval) return;
    lastSpawnTime = now;
    createPlumPetal(
      event.clientX + (Math.random() - 0.5) * trailConfig.jitter,
      event.clientY + (Math.random() - 0.5) * trailConfig.jitter,
      buildPetalOptions()
    );
  }

  function registerMoveListener() {
    if (controller.registered) return;
    if (window.PointerEvent) document.addEventListener('pointermove', handlePlumMove, { passive: true, capture: true });
    else document.addEventListener('mousemove', handlePlumMove, { passive: true, capture: true });
    controller.registered = true;
    controller.listenerCount = 1;
    window.__plumTrailState.listenerCount = 1;
  }

  function unregisterMoveListener(removePetals) {
    if (controller.registered) {
      if (window.PointerEvent) document.removeEventListener('pointermove', handlePlumMove, { capture: true });
      else document.removeEventListener('mousemove', handlePlumMove, { capture: true });
    }
    controller.registered = false;
    controller.listenerCount = 0;
    window.__plumTrailState.listenerCount = 0;
    if (removePetals) document.querySelectorAll('.plum-petal').forEach(function (petal) { petal.remove(); });
  }

  function updateEligibility() {
    if (syncState()) registerMoveListener();
    else unregisterMoveListener(true);
  }

  function cleanup() {
    unregisterMoveListener(true);
    [reducedMotionQuery, finePointerQuery, coarsePointerQuery, hoverQuery, hoverNoneQuery, mobileViewportQuery].forEach(function (query) {
      if (typeof query.removeEventListener === 'function') query.removeEventListener('change', updateEligibility);
    });
    window.removeEventListener('resize', updateEligibility);
    window.removeEventListener('pagehide', cleanup);
    controller.cleaned = true;
  }

  [reducedMotionQuery, finePointerQuery, coarsePointerQuery, hoverQuery, hoverNoneQuery, mobileViewportQuery].forEach(function (query) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', updateEligibility);
  });
  window.addEventListener('resize', updateEligibility, { passive: true });
  window.addEventListener('pagehide', cleanup, { once: true });
  updateEligibility();
}

/**
 * 4. 按钮点击朱砂涟漪特效
 */
function initInkRipples() {
  const handleClickRipple = (e) => {
    const target = e.target.closest('a, button, .btn, .btn-ink, .nav-item a, .card, .snow-letter-card, .snow-filter-btn, .blog-entry-card, .image-note-card, .gallery-card, .song-card, .skill-tag, .social-icon, .contact-value, .music-card, .music-pendant, .music-play-btn, .playbar-btn, .theme-toggle, .theme-toggle-btn');
    if (!target) return;

    const ripple = document.createElement('span');
    ripple.className = 'ink-ripple';
    
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    document.body.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    }, { once: true });
  };

  document.addEventListener('click', handleClickRipple, true);
}

function initLightParallax() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !hasFinePointer) return;

  var root = document.documentElement;
  var allowAmbientScene = !document.body.classList.contains('page-home');
  var ticking = false;
  var lastX = 0;
  var lastY = 0;

  function updateScene() {
    var x = (lastX / window.innerWidth - 0.5) * 2;
    var y = (lastY / window.innerHeight - 0.5) * 2;
    root.style.setProperty('--scene-x', x.toFixed(3));
    root.style.setProperty('--scene-y', y.toFixed(3));
    ticking = false;
  }

  document.addEventListener('pointermove', function (event) {
    if (!allowAmbientScene) return;
    if (event.pointerType && event.pointerType === 'touch') return;
    lastX = event.clientX;
    lastY = event.clientY;

    if (!ticking) {
      window.requestAnimationFrame(updateScene);
      ticking = true;
    }
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('pointermove', function (event) {
      if (event.pointerType && event.pointerType === 'touch') return;
      var rect = card.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', (x * 5).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (y * -5).toFixed(2) + 'deg');
    }, { passive: true });

    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

function createSnowLetterCard(post, options) {
  var compact = options && options.compact;
  var article = document.createElement('article');
  article.className = compact ? 'snow-letter-card snow-letter-card--compact tilt-card' : 'snow-letter-card tilt-card';
  article.setAttribute('data-category', post.category);
  article.setAttribute('data-post-id', post.id);

  article.innerHTML = [
    '<div class="snow-letter-card-meta">',
    '<span class="snow-letter-category">' + post.category + '</span>',
    '<span>' + post.date + '</span>',
    '<span>' + post.readTime + '</span>',
    '</div>',
    '<h3 class="snow-letter-card-title">' + post.title + '</h3>',
    '<p class="snow-letter-card-excerpt">' + post.excerpt + '</p>',
    '<button class="snow-letter-read-btn" type="button" data-read-id="' + post.id + '">阅读全文</button>'
  ].join('');

  return article;
}

function renderSnowLetterDetail(post) {
  var detail = document.getElementById('snow-letter-detail');
  if (!detail || !post) return;

  detail.innerHTML = [
    '<div class="snow-letter-detail-meta">',
    '<span class="snow-letter-category">' + post.category + '</span>',
    '<span>' + post.date + '</span>',
    '<span>' + post.readTime + '</span>',
    '</div>',
    '<h2>' + post.title + '</h2>',
    '<p class="snow-letter-detail-excerpt">' + post.excerpt + '</p>',
    '<div class="snow-letter-detail-body"><p>' + post.content + '</p></div>'
  ].join('');
}

function initSnowLettersPage() {
  var list = document.getElementById('snow-letter-list');
  var filters = document.querySelectorAll('[data-snow-filter]');
  var detail = document.getElementById('snow-letter-detail');
  if (!list || !detail) return;

  var currentCategory = '全部';

  function renderList() {
    var posts = currentCategory === '全部'
      ? snowLetterPosts
      : snowLetterPosts.filter(function (post) { return post.category === currentCategory; });

    list.innerHTML = '';
    posts.forEach(function (post) {
      list.appendChild(createSnowLetterCard(post));
    });

    var activePost = posts[0] || snowLetterPosts[0];
    var hashId = decodeURIComponent(window.location.hash.replace('#', ''));
    var hashPost = posts.find(function (post) { return post.id === hashId; });
    renderSnowLetterDetail(hashPost || activePost);
    setActiveCard(hashPost || activePost);
  }

  function setActiveCard(post) {
    list.querySelectorAll('.snow-letter-card').forEach(function (card) {
      card.classList.toggle('active', post && card.getAttribute('data-post-id') === post.id);
    });
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      currentCategory = button.getAttribute('data-snow-filter') || '全部';
      filters.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      renderList();
    });
  });

  list.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-read-id], .snow-letter-card');
    if (!trigger) return;

    var id = trigger.getAttribute('data-read-id') || trigger.getAttribute('data-post-id');
    var post = snowLetterPosts.find(function (item) { return item.id === id; });
    if (!post) return;

    renderSnowLetterDetail(post);
    setActiveCard(post);
    history.replaceState(null, '', '#' + post.id);
    detail.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  window.addEventListener('hashchange', function () {
    var id = decodeURIComponent(window.location.hash.replace('#', ''));
    var post = snowLetterPosts.find(function (item) { return item.id === id; });
    if (post) {
      renderSnowLetterDetail(post);
      setActiveCard(post);
    }
  });

  renderList();
}

function initHomeLatestSnowLetters() {
  var container = document.getElementById('latest-snow-list');
  if (!container) return;

  container.innerHTML = '';
  snowLetterPosts.slice(0, 3).forEach(function (post) {
    var card = createSnowLetterCard(post, { compact: true });
    var button = card.querySelector('[data-read-id]');
    if (button) {
      button.textContent = '去雪笺阅读';
      button.addEventListener('click', function () {
        window.location.href = 'articles.html#' + post.id;
      });
    }
    card.addEventListener('click', function (event) {
      if (event.target.closest('button')) return;
      window.location.href = 'articles.html#' + post.id;
    });
    container.appendChild(card);
  });
}

/**
 * 世界状态初始化（早期 inline 脚本已设置好属性，这里只做兜底与同步）。
 * data-theme(light/dark) 与 data-world(day/night) 互为镜像。
 */
function initWorldState() {
  var root = document.documentElement;
  var theme = root.getAttribute('data-theme');
  if (!theme) {
    theme = document.body.classList.contains('page-home')
      ? (localStorage.getItem('home-world') === 'night' ? 'dark' : 'light')
      : (localStorage.getItem('theme') || 'light');
  }
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-world', theme === 'dark' ? 'night' : 'day');
}

/**
 * 首页“世界入口状态”：进入页面为 entrance，滑过庭院入口后切到 content。
 * 仅作为 Codex 的视觉挂载钩子（body[data-home-stage]），不锁滚动、不改内容。
 */
function initHomeStage() {
  if (!document.body.classList.contains('page-home')) return;
  var entrance = document.querySelector('.courtyard');
  if (!entrance) return;

  document.body.setAttribute('data-home-stage', 'entrance');

  if (!('IntersectionObserver' in window)) {
    document.body.setAttribute('data-home-stage', 'content');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      document.body.setAttribute('data-home-stage', entry.isIntersecting ? 'entrance' : 'content');
    });
  }, { threshold: 0.18 });

  observer.observe(entrance);
}

/**
 * 首页起行路线图：有 JS 时由“起行”展开；无 JS 时保留静态链接。
 */
function initHomeRouteMap() {
  if (!document.body.classList.contains('page-home')) return;

  var routeMap = document.getElementById('home-route-map');
  if (!routeMap) return;

  var triggers = Array.prototype.slice.call(document.querySelectorAll('[aria-controls="home-route-map"], [data-route-map-trigger]'));
  if (!triggers.length) return;

  var primaryTrigger = triggers[0];
  var closeBtn = routeMap.querySelector('.route-guide-close');
  var routeScroll = routeMap.querySelector('.mount-map__scroll');
  var routeStatus = routeMap.querySelector('.mount-map__status');
  var landmarks = Array.prototype.slice.call(routeMap.querySelectorAll('.mount-map__landmark'));
  var visitedStorageKey = 'buqingchen-route-visited';
  var focusableSelector = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  var originalRouteParent = routeMap.parentNode;
  var originalRouteNext = routeMap.nextSibling;
  var isOpen = false;
  var isClosing = false;
  var activeTrigger = primaryTrigger;
  var restoreTimer = null;
  var backgroundState = [];
  var scrollLockState = null;
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.body.classList.add('route-map-ready');
  routeMap.setAttribute('role', 'dialog');
  routeMap.setAttribute('aria-modal', 'true');
  routeMap.setAttribute('aria-hidden', 'true');
  routeMap.setAttribute('tabindex', '-1');
  triggers.forEach(function (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  });

  var moveRouteMapToBody = function () {
    if (routeMap.parentNode !== document.body) {
      document.body.appendChild(routeMap);
    }
  };

  var restoreRouteMapPosition = function () {
    if (!originalRouteParent || routeMap.parentNode === originalRouteParent) return;
    originalRouteParent.insertBefore(routeMap, originalRouteNext);
  };

  var isReducedMotion = function () {
    return reduceMotionQuery.matches;
  };

  var setRouteStatus = function (text, alert) {
    if (!routeStatus) return;
    routeStatus.textContent = text || routeStatus.dataset.defaultText || '';
    routeStatus.classList.toggle('is-alert', Boolean(alert));
  };

  var getVisitedLandmarks = function () {
    try {
      var stored = JSON.parse(window.localStorage.getItem(visitedStorageKey) || '[]');
      return Array.isArray(stored) ? stored.filter(function (item) { return typeof item === 'string'; }) : [];
    } catch (error) {
      return [];
    }
  };

  var renderVisitedLandmarks = function () {
    var visited = getVisitedLandmarks();
    landmarks.forEach(function (landmark) {
      landmark.classList.toggle('is-visited', visited.indexOf(landmark.dataset.landmark) !== -1);
    });
  };

  var markLandmarkVisited = function (landmark) {
    var key = landmark && landmark.dataset.landmark;
    if (!key) return;
    var visited = getVisitedLandmarks();
    if (visited.indexOf(key) === -1) visited.push(key);
    try {
      window.localStorage.setItem(visitedStorageKey, JSON.stringify(visited));
    } catch (error) {}
    renderVisitedLandmarks();
  };

  var positionRouteJourney = function () {
    if (!routeScroll) return;
    var inlineScrollBehavior = routeScroll.style.scrollBehavior;
    routeScroll.style.scrollBehavior = 'auto';
    if (window.matchMedia('(max-width: 820px)').matches) {
      routeScroll.scrollTop = Math.max(0, routeScroll.scrollHeight - routeScroll.clientHeight);
    } else {
      routeScroll.scrollTop = 0;
    }
    window.requestAnimationFrame(function () {
      routeScroll.style.scrollBehavior = inlineScrollBehavior;
    });
  };

  var getFocusableItems = function () {
    return Array.prototype.slice.call(routeMap.querySelectorAll(focusableSelector)).filter(function (item) {
      return !item.hasAttribute('disabled') && item.getAttribute('aria-hidden') !== 'true' && item.offsetParent !== null;
    });
  };

  var setBackgroundDisabled = function (disabled) {
    if (disabled) {
      if (backgroundState.length) return;
      backgroundState = Array.prototype.slice.call(document.body.children).filter(function (element) {
        return element !== routeMap;
      }).map(function (element) {
        return {
          element: element,
          ariaHidden: element.getAttribute('aria-hidden'),
          inert: element.hasAttribute('inert')
        };
      });
      backgroundState.forEach(function (entry) {
        entry.element.setAttribute('aria-hidden', 'true');
        entry.element.setAttribute('inert', '');
        if ('inert' in entry.element) entry.element.inert = true;
      });
      return;
    }

    backgroundState.forEach(function (entry) {
      if (entry.ariaHidden === null) {
        entry.element.removeAttribute('aria-hidden');
      } else {
        entry.element.setAttribute('aria-hidden', entry.ariaHidden);
      }

      if (!entry.inert) {
        entry.element.removeAttribute('inert');
        if ('inert' in entry.element) entry.element.inert = false;
      } else if ('inert' in entry.element) {
        entry.element.inert = true;
      }
    });
    backgroundState = [];
  };

  var lockScroll = function () {
    if (scrollLockState) return;
    scrollLockState = {
      x: window.scrollX || window.pageXOffset || 0,
      y: window.scrollY || window.pageYOffset || 0,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyLeft: document.body.style.left,
      bodyRight: document.body.style.right,
      bodyWidth: document.body.style.width,
      bodyOverflow: document.body.style.overflow,
      rootOverflow: document.documentElement.style.overflow,
      rootScrollBehavior: document.documentElement.style.scrollBehavior
    };

    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollLockState.y + 'px';
    document.body.style.left = '-' + scrollLockState.x + 'px';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  };

  var unlockScroll = function () {
    if (!scrollLockState) return;
    var x = scrollLockState.x;
    var y = scrollLockState.y;
    var rootScrollBehavior = scrollLockState.rootScrollBehavior;
    var restoreScrollPosition = function () {
      var scrollingElement = document.scrollingElement || document.documentElement;
      if (scrollingElement) {
        scrollingElement.scrollLeft = x;
        scrollingElement.scrollTop = y;
      }
      document.documentElement.scrollTop = y;
      document.body.scrollTop = y;
      window.scrollTo(x, y);
    };
    var restoreScrollBehavior = function () {
      document.documentElement.style.scrollBehavior = rootScrollBehavior;
    };

    document.body.style.position = scrollLockState.bodyPosition;
    document.body.style.top = scrollLockState.bodyTop;
    document.body.style.left = scrollLockState.bodyLeft;
    document.body.style.right = scrollLockState.bodyRight;
    document.body.style.width = scrollLockState.bodyWidth;
    document.body.style.overflow = scrollLockState.bodyOverflow;
    document.documentElement.style.overflow = scrollLockState.rootOverflow;
    scrollLockState = null;
    restoreScrollPosition();
    window.requestAnimationFrame(restoreScrollPosition);
    window.setTimeout(function () {
      restoreScrollPosition();
      restoreScrollBehavior();
    }, 80);
  };

  var setTriggerState = function (open) {
    triggers.forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', String(open));
    });
  };

  var finishClose = function (returnFocus) {
    routeMap.classList.remove('is-closing');
    document.body.classList.remove('route-map-open');
    routeMap.setAttribute('aria-hidden', 'true');
    restoreRouteMapPosition();
    setBackgroundDisabled(false);
    setRouteStatus();

    if (returnFocus !== false && activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus({ preventScroll: true });
    }

    unlockScroll();
  };

  var openRouteMap = function (trigger) {
    window.clearTimeout(restoreTimer);
    activeTrigger = trigger || activeTrigger || primaryTrigger;
    moveRouteMapToBody();
    lockScroll();
    setBackgroundDisabled(true);
    isOpen = true;
    isClosing = false;
    document.body.classList.add('route-map-open');
    routeMap.classList.remove('is-closing');
    routeMap.classList.add('is-open');
    routeMap.setAttribute('aria-hidden', 'false');
    setTriggerState(true);

    window.requestAnimationFrame(function () {
      positionRouteJourney();
      var first = getFocusableItems()[0];
      (first || routeMap).focus({ preventScroll: true });
    });
  };

  var closeRouteMap = function (options) {
    options = options || {};
    if (!isOpen || isClosing) return;
    window.clearTimeout(restoreTimer);
    isOpen = false;
    isClosing = true;
    routeMap.classList.remove('is-open');
    routeMap.classList.add('is-closing');
    setTriggerState(false);

    var delay = isReducedMotion() ? 0 : 560;
    restoreTimer = window.setTimeout(function () {
      isClosing = false;
      finishClose(options.returnFocus);
    }, delay);
  };

  var setRouteMap = function (open, options) {
    options = options || {};

    if (open) {
      if (isOpen && !isClosing) return;
      openRouteMap(options.trigger);
      return;
    }

    closeRouteMap(options);
  };

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      setRouteMap(true, { trigger: trigger });
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setRouteMap(false);
    });
  }

  landmarks.forEach(function (landmark) {
    var name = landmark.querySelector('.mount-map__label strong');
    var note = landmark.querySelector('.mount-map__label small');
    var statusText = (name ? name.textContent : '路线节点') + (note ? ' · ' + note.textContent : '');

    landmark.addEventListener('focus', function () {
      setRouteStatus(statusText, landmark.dataset.state === 'locked');
    });

    landmark.addEventListener('mouseenter', function () {
      setRouteStatus(statusText, landmark.dataset.state === 'locked');
    });

    landmark.addEventListener('mouseleave', function () {
      if (document.activeElement !== landmark) setRouteStatus();
    });

    landmark.addEventListener('blur', function () {
      setRouteStatus();
    });

    landmark.addEventListener('click', function (event) {
      if (landmark.dataset.state === 'locked' || landmark.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        setRouteStatus('小猫 · 未启程，页面尚未开放。', true);
        return;
      }

      markLandmarkVisited(landmark);
      var href = landmark.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;

      event.preventDefault();
      var target = document.querySelector(href);
      setRouteMap(false);
      window.setTimeout(function () {
        if (!target) return;
        if (window.history && window.history.pushState) window.history.pushState(null, '', href);
        target.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }, isReducedMotion() ? 100 : 680);
    });

    landmark.addEventListener('keydown', function (event) {
      if (event.key !== ' ' || landmark.tagName !== 'A') return;
      event.preventDefault();
      landmark.click();
    });
  });

  renderVisitedLandmarks();

  document.addEventListener('keydown', function (event) {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setRouteMap(false);
      return;
    }

    if (event.key !== 'Tab') return;

    var focusableItems = getFocusableItems();
    if (!focusableItems.length) {
      event.preventDefault();
      routeMap.focus({ preventScroll: true });
      return;
    }

    var first = focusableItems[0];
    var last = focusableItems[focusableItems.length - 1];
    var active = document.activeElement;

    if (event.shiftKey && (active === first || active === routeMap || !routeMap.contains(active))) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
}

/**
 * 首页暮光日线：只在桌面精细指针下轻微响应鼠标，不移动背景本体。
 */
function initHomeSunResponse() {
  if (!document.body.classList.contains('page-home')) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduceMotion || !canHover) return;

  var themeRoot = document.documentElement;
  var motionRoot = document.body;
  var stage = document.querySelector('.courtyard');
  if (!stage) return;

  var current = { dx: 0, dy: 0, opacity: getBaseOpacity(), cloud: 0 };
  var target = { dx: 0, dy: 0, opacity: getBaseOpacity(), cloud: 0 };
  var frame = null;
  var settleTimer = null;
  var pauseSelector = '.courtyard-content, .home-orbit-controls, .route-guide, a, button';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getBaseOpacity() {
    return themeRoot.getAttribute('data-world') === 'night' ? 0.22 : 0.38;
  }

  function setNeutral() {
    target.dx = 0;
    target.dy = 0;
    target.opacity = getBaseOpacity();
    target.cloud = 0;
    requestTick();
  }

  function requestTick() {
    if (frame) return;
    frame = window.requestAnimationFrame(tick);
  }

  function tick() {
    frame = null;

    current.dx += (target.dx - current.dx) * 0.1;
    current.dy += (target.dy - current.dy) * 0.1;
    current.opacity += (target.opacity - current.opacity) * 0.08;
    current.cloud += (target.cloud - current.cloud) * 0.08;

    motionRoot.style.setProperty('--home-sun-dx', current.dx.toFixed(2) + 'px');
    motionRoot.style.setProperty('--home-sun-dy', current.dy.toFixed(2) + 'px');
    motionRoot.style.setProperty('--home-sun-opacity', current.opacity.toFixed(3));
    motionRoot.style.setProperty('--home-cloud-lift', current.cloud.toFixed(3));

    if (
      Math.abs(target.dx - current.dx) > 0.05 ||
      Math.abs(target.dy - current.dy) > 0.05 ||
      Math.abs(target.opacity - current.opacity) > 0.002 ||
      Math.abs(target.cloud - current.cloud) > 0.001
    ) {
      requestTick();
    }
  }

  function handlePointerMove(event) {
    if ((event.pointerType && event.pointerType !== 'mouse') || themeRoot.getAttribute('data-world') !== 'day') {
      setNeutral();
      return;
    }

    if (document.body.classList.contains('route-map-open') || event.target.closest(pauseSelector)) {
      setNeutral();
      return;
    }

    var x = event.clientX / window.innerWidth - 0.5;
    var y = event.clientY / window.innerHeight - 0.5;
    var baseOpacity = getBaseOpacity();

    target.dx = clamp(x * 28, -14, 14);
    target.dy = clamp(y * 20, -10, 10);
    target.opacity = baseOpacity + clamp(x * 0.028 - y * 0.018, -0.035, 0.04);
    target.cloud = clamp(x * 0.018 - y * 0.012, -0.012, 0.024);

    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(setNeutral, 850);
    requestTick();
  }

  stage.addEventListener('pointermove', handlePointerMove, { passive: true });
  stage.addEventListener('pointerleave', setNeutral, { passive: true });

  if ('MutationObserver' in window) {
    var worldObserver = new MutationObserver(setNeutral);
    worldObserver.observe(themeRoot, { attributes: true, attributeFilter: ['data-world'] });
  }
}

/**
 * 复制类操作（留笺底座）：任意 [data-copy-email] / [data-copy-text] 元素，
 * 点击后复制邮箱并给出“已复制”反馈。带 execCommand 回退，无障碍可用。
 */
function initCopyActions() {
  var triggers = document.querySelectorAll('[data-copy-email], [data-copy-text]');
  if (!triggers.length) return;

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'absolute';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(helper);
        ok ? resolve() : reject(new Error('execCommand 复制失败'));
      } catch (err) {
        reject(err);
      }
    });
  }

  triggers.forEach(function (trigger) {
    if (trigger.dataset.copyReady === 'true') return;
    trigger.dataset.copyReady = 'true';

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      var text = trigger.getAttribute('data-copy-email') || trigger.getAttribute('data-copy-text') || '';
      if (!text) return;

      copyText(text).then(function () {
        showToast('邮箱已复制：' + text);
        trigger.classList.add('is-copied');
        window.clearTimeout(trigger.__copyTimer);
        trigger.__copyTimer = window.setTimeout(function () {
          trigger.classList.remove('is-copied');
        }, 2200);
      }).catch(function () {
        showToast('复制失败，请手动选择邮箱：' + text);
      });
    });
  });
}

/**
 * 听雪底部播放栏“可收起”挂载接口。仅在存在收起按钮时启用，
 * 不触碰 music.js 的播放逻辑，只切换容器状态供 CSS / Codex 使用。
 */
function initMusicPlaybarDock() {
  var playbar = document.getElementById('playbar-container');
  var toggle = document.querySelector('[data-playbar-toggle]');
  if (!playbar || !toggle) return;
  if (toggle.dataset.dockReady === 'true') return;
  toggle.dataset.dockReady = 'true';

  var setCollapsed = function (collapsed) {
    playbar.classList.toggle('is-collapsed', collapsed);
    playbar.setAttribute('data-collapsed', String(collapsed));
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? '展开播放栏' : '收起播放栏');
  };

  setCollapsed(false);
  toggle.addEventListener('click', function () {
    setCollapsed(!playbar.classList.contains('is-collapsed'));
  });
}

/**
 * 听雪播放栏显隐状态。播放核心仍由 music.js 控制；这里仅在用户点选
 * 歌曲后给播放栏加视觉状态，避免初始常驻底部。
 */
function initMusicPlaybarReveal() {
  if (!document.body.classList.contains('page-music')) return;

  var playbar = document.getElementById('playbar-container');
  var playlist = document.getElementById('playlist-container');
  if (!playbar || !playlist) return;
  if (playbar.dataset.revealReady === 'true') return;

  playbar.dataset.revealReady = 'true';
  playbar.dataset.revealed = 'false';
  playbar.classList.add('is-awaiting-selection');
  document.body.classList.remove('music-playbar-revealed');

  var revealPlaybar = function () {
    playbar.classList.remove('is-awaiting-selection');
    playbar.classList.add('is-revealed');
    playbar.dataset.revealed = 'true';
    document.body.classList.add('music-playbar-revealed');
  };

  playlist.addEventListener('click', function (event) {
    if (event.target.closest('[data-track-index]')) {
      revealPlaybar();
    }
  });

  playlist.addEventListener('keydown', function (event) {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('[data-track-index]')) {
      revealPlaybar();
    }
  });
}

/**
 * 影像廊功能底座：渲染影像流 + 可访问灯箱（键盘关闭/切换、焦点管理、
 * 触屏横向滚动回退）。无照片时呈现克制的真实空状态，不伪造内容。
 */
function initGalleryPage() {
  var flow = document.getElementById('gallery-flow');
  if (!flow) return;

  var items = (window.siteData && window.siteData.galleryItems) || [];
  var publicItems = items.filter(function (item) { return item && item.visibility !== 'private' && item.src; });

  if (!publicItems.length) {
    flow.innerHTML = '<p class="gallery-empty">影像廊还在整理中，路上的风景会慢慢收进来。</p>';
    return;
  }

  flow.innerHTML = publicItems.map(function (item, index) {
    var meta = [item.date, item.locationOptional].filter(Boolean).join(' · ');
    return [
      '<button class="gallery-frame" type="button" data-gallery-index="' + index + '"',
      ' data-scene-tone="' + escapeHtml(item.sceneTone || 'neutral') + '"',
      ' aria-label="查看影像：' + escapeHtml(item.title || '影像') + '">',
      '  <span class="gallery-frame-media">',
      '    <img src="' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt || item.title || '生活影像') + '" loading="lazy" decoding="async">',
      '  </span>',
      '  <span class="gallery-frame-caption">',
      '    <span class="gallery-frame-title">' + escapeHtml(item.title || '') + '</span>',
      (meta ? '    <span class="gallery-frame-meta">' + escapeHtml(meta) + '</span>' : ''),
      '  </span>',
      '</button>'
    ].join('');
  }).join('');

  var dialog = document.getElementById('gallery-dialog');
  if (!dialog) return;

  var dialogImg = dialog.querySelector('[data-gallery-image]');
  var dialogTitle = dialog.querySelector('[data-gallery-title]');
  var dialogCaption = dialog.querySelector('[data-gallery-caption]');
  var closeBtn = dialog.querySelector('[data-gallery-close]');
  var prevBtn = dialog.querySelector('[data-gallery-prev]');
  var nextBtn = dialog.querySelector('[data-gallery-next]');
  var lastTrigger = null;
  var currentIndex = 0;

  function renderDialog(index) {
    var item = publicItems[index];
    if (!item) return;
    currentIndex = index;
    if (dialogImg) {
      dialogImg.src = item.src;
      dialogImg.alt = item.alt || item.title || '生活影像';
    }
    if (dialogTitle) dialogTitle.textContent = item.title || '';
    if (dialogCaption) dialogCaption.textContent = item.caption || '';
  }

  function openDialog(index, trigger) {
    lastTrigger = trigger || null;
    renderDialog(index);
    dialog.classList.add('is-open');
    dialog.removeAttribute('hidden');
    document.body.classList.add('gallery-dialog-open');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeDialog() {
    dialog.classList.remove('is-open');
    dialog.setAttribute('hidden', '');
    document.body.classList.remove('gallery-dialog-open');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  function step(delta) {
    renderDialog((currentIndex + delta + publicItems.length) % publicItems.length);
  }

  flow.addEventListener('click', function (event) {
    var frame = event.target.closest('[data-gallery-index]');
    if (!frame) return;
    openDialog(Number(frame.getAttribute('data-gallery-index')), frame);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDialog);
  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog || event.target.hasAttribute('data-gallery-backdrop')) closeDialog();
  });

  document.addEventListener('keydown', function (event) {
    if (!dialog.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeDialog(); }
    else if (event.key === 'ArrowLeft') { step(-1); }
    else if (event.key === 'ArrowRight') { step(1); }
  });
}

/**
 * 学习路功能底座：渲染学习记录条目，关联到真实雪笺文章。
 */
function initLearningPage() {
  var list = document.getElementById('learning-list');
  if (!list) return;

  var entries = (window.siteData && window.siteData.learningEntries) || [];
  if (!entries.length) {
    list.innerHTML = '<p class="learning-empty">学习记录正在路上，慢慢补齐。</p>';
    return;
  }

  list.innerHTML = entries.map(function (entry) {
    var link = entry.relatedArticle
      ? '<a class="learning-entry-link" href="articles.html#' + escapeHtml(entry.relatedArticle) + '">读相关雪笺 →</a>'
      : '';
    return [
      '<article class="learning-entry" data-accent="' + escapeHtml(entry.accent || 'ink') + '">',
      '  <div class="learning-entry-head">',
      '    <span class="learning-entry-period">' + escapeHtml(entry.period || '') + '</span>',
      '    <span class="learning-entry-tag">' + escapeHtml(entry.tag || '') + '</span>',
      '  </div>',
      '  <h3 class="learning-entry-title">' + escapeHtml(entry.title || '') + '</h3>',
      '  <p class="learning-entry-summary">' + escapeHtml(entry.summary || '') + '</p>',
      link,
      '</article>'
    ].join('');
  }).join('');
}

/**
 * 黑猫陪伴系统 · 行为底座。
 * - 自动注入 [data-companion-cat]（home / music / contact / gallery 优先）。
 * - 状态：idle / walk / sit / look / sleep / pet，写在 data-cat-state。
 * - 仅猫自身可点，不用透明层覆盖页面。
 * - 安全路线点：仅在页面底部安全带内移动，远离顶部导航。
 * - prefers-reduced-motion：停止走动，仅保留静态坐姿。
 * - 手机端：降低移动频率。
 */
function initCompanionCat() {
  var priorityPages = ['page-home', 'page-music', 'page-contact', 'page-gallery'];
  var isPriority = priorityPages.some(function (cls) { return document.body.classList.contains(cls); });

  var cat = document.querySelector('[data-companion-cat]');
  if (!cat && !isPriority) return;

  var catMarkup = [
    '<span class="companion-cat-shadow" aria-hidden="true"></span>',
    '<span class="companion-cat-visual" aria-hidden="true">',
    '  <span class="companion-cat-sprite"></span>',
    '  <span class="companion-cat-tail"></span>',
    '  <span class="companion-cat-ear companion-cat-ear-left"></span>',
    '  <span class="companion-cat-ear companion-cat-ear-right"></span>',
    '  <span class="companion-cat-eye companion-cat-eye-left"></span>',
    '  <span class="companion-cat-eye companion-cat-eye-right"></span>',
    '</span>'
  ].join('');

  if (!cat) {
    cat = document.createElement('button');
    cat.type = 'button';
    cat.setAttribute('data-companion-cat', '');
    cat.setAttribute('aria-label', '轻轻抚摸黑猫');
    cat.className = 'companion-cat';
    cat.innerHTML = catMarkup;
    var zone = document.querySelector('.companion-zone') || document.body;
    zone.removeAttribute('aria-hidden');
    zone.appendChild(cat);
  } else if (!cat.querySelector('.companion-cat-sprite')) {
    cat.innerHTML = catMarkup;
  }

  var states = ['idle', 'walk', 'sit', 'look', 'sleep', 'pet'];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia('(pointer: coarse)').matches;
  var meowSources = [
    'assets/audio/cat-meow-soft-01.wav',
    'assets/audio/cat-meow-soft-02.wav',
    'assets/audio/cat-meow-soft-03.wav'
  ];
  var catSfxAudio = null;
  var lastPetAt = 0;

  var setState = function (state) {
    if (states.indexOf(state) === -1) state = 'idle';
    cat.setAttribute('data-cat-state', state);
  };

  // 在底部安全带内取一个不与交互元素重叠的落点（百分比定位，随视口自适应）。
  var isHome = document.body.classList.contains('page-home');
  var avoidSelector = 'header, .nav-container, .courtyard-content, .home-orbit-controls, .home-hero-aside, .home-preview-card, .home-scroll-section, .courtyard-cue, .route-guide, a, button, input, textarea, .music-widget, .music-playbar-container, .back-to-top';

  var getHomeSafeZones = function () {
    if (window.matchMedia('(max-width: 768px)').matches) {
      return [
        { minX: 0.58, maxX: 0.82, minBottom: 0.11, maxBottom: 0.18 }
      ];
    }
    return [
      { minX: 0.08, maxX: 0.28, minBottom: 0.1, maxBottom: 0.17 },
      { minX: 0.62, maxX: 0.86, minBottom: 0.08, maxBottom: 0.16 }
    ];
  };

  var isBlockedAt = function (left, top, width, height) {
    var samples = [
      [left + width * 0.5, top + height * 0.82],
      [left + width * 0.26, top + height * 0.62],
      [left + width * 0.74, top + height * 0.62]
    ];

    return samples.some(function (sample) {
      var x = Math.min(window.innerWidth - 2, Math.max(2, sample[0]));
      var y = Math.min(window.innerHeight - 2, Math.max(2, sample[1]));
      var hit = document.elementFromPoint(x, y);
      if (!hit || !hit.closest) return false;
      if (hit.closest('[data-companion-cat]')) return false;
      return Boolean(hit.closest(avoidSelector));
    });
  };

  var pickWaypoint = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var catW = cat.offsetWidth || 108;
    var catH = cat.offsetHeight || 88;
    for (var attempt = 0; attempt < 8; attempt++) {
      var zone = null;
      if (isHome) {
        var homeZones = getHomeSafeZones();
        zone = homeZones[Math.floor(Math.random() * homeZones.length)];
      }
      var minX = zone ? zone.minX : 0.06;
      var rangeX = zone ? (zone.maxX - zone.minX) : 0.88;
      var minBottom = zone ? zone.minBottom : 0.06;
      var rangeBottom = zone ? (zone.maxBottom - zone.minBottom) : 0.12;
      var x = (minX + Math.random() * rangeX) * width;
      var y = height - (minBottom + Math.random() * rangeBottom) * height;
      var left = Math.min(width - catW - 8, Math.max(8, x - catW / 2));
      var top = Math.min(height - catH - 8, Math.max(8, y - catH));
      if (isBlockedAt(left, top, catW, catH)) continue;
      return {
        x: left,
        y: top
      };
    }
    return null;
  };

  var placeStatic = function () {
    var homeX = window.matchMedia('(max-width: 768px)').matches ? 0.68 : 0.76;
    var x = isHome ? window.innerWidth * homeX : window.innerWidth * 0.08;
    var bottom = isHome ? (window.matchMedia('(max-width: 768px)').matches ? 0.14 : 0.12) : 0.08;
    cat.style.left = Math.max(8, Math.min(window.innerWidth - (cat.offsetWidth || 72) - 8, x)) + 'px';
    cat.style.top = (window.innerHeight - (cat.offsetHeight || 62) - window.innerHeight * bottom) + 'px';
  };

  var placeMapWatcher = function () {
    if (!isHome || !document.body.classList.contains('route-map-open')) return;
    var catW = cat.offsetWidth || 108;
    var catH = cat.offsetHeight || 84;
    var rightGap = Math.max(18, window.innerWidth * 0.045);
    var bottomGap = Math.max(16, window.innerHeight * 0.075);
    window.clearTimeout(cat.__settleTimer);
    cat.style.setProperty('--cat-face', '1');
    cat.style.left = Math.max(8, window.innerWidth - catW - rightGap) + 'px';
    cat.style.top = Math.max(8, window.innerHeight - catH - bottomGap) + 'px';
    setState('look');
  };

  cat.style.position = 'fixed';
  placeStatic();
  setState('sit');

  if (isHome && 'MutationObserver' in window) {
    var routeMapObserver = new MutationObserver(function () {
      window.requestAnimationFrame(placeMapWatcher);
    });
    routeMapObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  var playCatMeow = function () {
    if (!catSfxAudio) {
      catSfxAudio = new Audio();
      catSfxAudio.preload = 'auto';
      catSfxAudio.volume = 0.18;
    }

    var source = meowSources[Math.floor(Math.random() * meowSources.length)];
    catSfxAudio.pause();
    catSfxAudio.src = source;
    catSfxAudio.currentTime = 0;
    catSfxAudio.play().catch(function () {});
  };

  var petCat = function () {
    if (isHome && document.body.classList.contains('route-map-open')) return;
    var now = Date.now();
    if (now - lastPetAt < 4200) return;
    lastPetAt = now;
    window.clearTimeout(cat.__settleTimer);
    setState('pet');
    playCatMeow();
    cat.__settleTimer = window.setTimeout(function () {
      setState('sit');
    }, 1250);
  };

  cat.addEventListener('click', petCat);
  cat.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    petCat();
  });

  if (reduceMotion) {
    // 减少动态：保持静态坐姿，不走动。
    return;
  }

  var moveTimer = null;
  var idleStates = ['idle', 'sit', 'look'];

  var scheduleNext = function () {
    var base = isCoarse ? 12000 : 7600; // 手机端更低频率
    var jitter = isCoarse ? 9000 : 6200;
    var delay = base + Math.random() * jitter;
    moveTimer = window.setTimeout(tick, delay);
  };

  var tick = function () {
    if (document.hidden) { scheduleNext(); return; }
    if (document.body.classList.contains('route-map-open')) {
      setState('look');
      scheduleNext();
      return;
    }

    var roll = Math.random();
    if (roll < 0.12) {
      setState('sleep');
      scheduleNext();
      return;
    }
    if (roll < 0.68) {
      setState(idleStates[Math.floor(Math.random() * idleStates.length)]);
      scheduleNext();
      return;
    }

    var point = pickWaypoint();
    if (!point) {
      setState('sit');
      scheduleNext();
      return;
    }

    setState('walk');
    cat.style.setProperty('--cat-face', point.x < parseFloat(cat.style.left || 0) ? '-1' : '1');
    cat.style.left = point.x + 'px';
    cat.style.top = point.y + 'px';

    window.clearTimeout(cat.__settleTimer);
    cat.__settleTimer = window.setTimeout(function () {
      setState('sit');
    }, 1600);

    scheduleNext();
  };

  cat.style.transition = 'left 1.5s cubic-bezier(0.33, 0, 0.2, 1), top 1.5s cubic-bezier(0.33, 0, 0.2, 1)';
  scheduleNext();

  window.addEventListener('resize', function () {
    var left = parseFloat(cat.style.left || 0);
    var top = parseFloat(cat.style.top || 0);
    cat.style.left = Math.min(window.innerWidth - (cat.offsetWidth || 56) - 8, Math.max(8, left)) + 'px';
    cat.style.top = Math.min(window.innerHeight - (cat.offsetHeight || 56) - 8, Math.max(8, top)) + 'px';
  });
}
