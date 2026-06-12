/**
 * 六月雪个人网页 - 静态站基础交互与特效系统
 */

function initAll() {
  initLivingInkScene();
  initMobileMenu();
  initContactForm();
  initActiveNavLink();
  initScrollReveal();
  initSkillExplanations();
  initBackToTop();
  initThemeToggle();
  initMusicWidget();
  initDomPlumTrail();
  initInkRipples();
  initSnowLettersPage();
  initHomeLatestSnowLetters();
  initLightParallax();
}

const musicTracks = [
  {
    id: 'ecoute-cherie',
    title: 'Ecoute Cherie',
    artist: 'Vendredi sur mer',
    src: 'assets/audio/ecoute-cherie.mp3',
    tag: '雪音',
    duration: '03:46'
  },
  {
    id: 'fallin-out',
    title: 'Fallin Out',
    artist: 'Keyshia Cole',
    src: 'assets/audio/fallin-out.mp3',
    tag: '风音',
    duration: '04:27'
  },
  {
    id: 'hong-san-ke-zhan',
    title: '红尘客栈',
    artist: '周杰伦',
    src: 'assets/audio/hong-san-ke-zhan.mp3',
    tag: '伞音',
    duration: '04:34'
  },
  {
    id: 'ji-mo-ji-mo-bu-hao',
    title: '寂寞寂寞不好',
    artist: '曹格',
    src: 'assets/audio/ji-mo-ji-mo-bu-hao.mp3',
    tag: '夜音',
    duration: '04:03'
  },
  {
    id: 'lan-ting-xu',
    title: '兰亭序',
    artist: '周杰伦',
    src: 'assets/audio/lan-ting-xu.mp3',
    tag: '墨音',
    duration: '04:14'
  },
  {
    id: 'lian-ren',
    title: '恋人',
    artist: '李荣浩',
    src: 'assets/audio/lian-ren.mp3',
    tag: '梅音',
    duration: '04:35'
  },
  {
    id: 'yin-tian',
    title: '阴天',
    artist: '莫文蔚',
    src: 'assets/audio/yin-tian.mp3',
    tag: '雨音',
    duration: '04:02'
  }
];

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

const snowLetterPosts = [
  {
    id: 'why-personal-site',
    title: '我为什么开始做这个个人网页',
    category: '项目',
    date: '2026.01.01',
    readTime: '3 分钟',
    excerpt: '从一个空白页面开始，我想给自己搭一个安静的小角落。',
    content: '这是我第一次认真做一个完整的个人网页。它不只是一个展示名字和作品的地方，也像一个可以慢慢记录学习过程的小房间。我希望这里能放下我的前端练习、网页作品、一些风景照片，也放下一些还没有完全想明白的话。'
  },
  {
    id: 'first-web-music',
    title: '第一次让音乐在网页里响起来',
    category: '学习',
    date: '2026.01.02',
    readTime: '2 分钟',
    excerpt: '音乐按钮看起来很小，但里面藏着浏览器限制和交互逻辑。',
    content: '给网页加音乐以后，我才发现浏览器并不总是允许页面自动播放声音。后来我把音乐改成需要点击按钮后播放，这样在电脑和手机上都更稳定。一个小小的按钮，也让我明白网页交互需要尊重用户的操作。'
  },
  {
    id: 'ink-background-thoughts',
    title: '关于中式水墨网页背景的一点想法',
    category: '灵感',
    date: '2026.01.03',
    readTime: '4 分钟',
    excerpt: '水墨风不是简单放一张图，而是留白、层次、墨色和呼吸感。',
    content: '我想要的中式网页背景，不应该只是铺一张模糊图片。它应该像一张慢慢展开的纸：有淡淡的纸纹，有远山一样的墨影，有很轻的水波线，也有恰到好处的留白。背景不应该抢走文字，而应该让文字像落在纸面上一样安静。'
  },
  {
    id: 'words-to-future-self',
    title: '给未来自己的几句话',
    category: '随笔',
    date: '2026.01.04',
    readTime: '2 分钟',
    excerpt: '慢一点也没关系，重要的是一直在走。',
    content: '如果以后再看到这个网页，希望我还能记得现在一点点搭建它的心情。也许那时候我已经学会了更多技术，也许这个网站已经变了很多样子。但我希望它仍然保留一点安静，一点认真，还有一点属于自己的温度。'
  },
  {
    id: 'first-road-of-front-end',
    title: 'HTML、CSS 和 JavaScript 的第一段路',
    category: '学习',
    date: '2026.01.05',
    readTime: '3 分钟',
    excerpt: '网页不是一下子完成的，它是一层一层搭起来的。',
    content: 'HTML 像骨架，CSS 像衣服和气质，JavaScript 则让页面开始回应人的动作。刚开始学的时候，每一部分都很零散，但当它们组合到一个完整页面里，我才真正感觉到前端开发的乐趣。'
  }
];

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
    drawerHeader.innerHTML = `
      <span class="nav-drawer-brand">
        <span class="seal">六月<br>雪印</span>
        <span>六月雪</span>
      </span>
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
    localStorage.setItem('theme', theme);
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
  pendant.dataset.musicWidgetReady = 'true';

  const track = musicTracks[0];

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
  if (existingPetals.length >= 35) {
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
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reducedMotion = prefersReducedMotion;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  var hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var isPureTouch = hasCoarsePointer && !hasFinePointer;

  var enabled = hasFinePointer && !isPureTouch;
  var trailConfig = reducedMotion ? {
    throttleMin: 180,
    throttleMax: 260,
    durationMin: 3200,
    durationMax: 4800,
    sizeMin: 20,
    sizeMax: 34,
    opacityMin: 0.75,
    opacityMax: 0.95,
    jitter: 12,
    driftX: 42,
    driftYMin: 38,
    driftYMax: 78,
    rotateBase: 46,
    rotateStepMin: 18,
    rotateStepMax: 48
  } : {
    throttleMin: 90,
    throttleMax: 120,
    durationMin: 3200,
    durationMax: 5000,
    sizeMin: 16,
    sizeMax: 32,
    opacityMin: 0.78,
    opacityMax: 0.96,
    jitter: 16,
    driftX: 76,
    driftYMin: 64,
    driftYMax: 132,
    rotateBase: 96,
    rotateStepMin: 58,
    rotateStepMax: 148
  };

  window.__plumTrailState = {
    enabled: enabled,
    prefersReducedMotion: prefersReducedMotion,
    reducedMotion: reducedMotion,
    hasFinePointer: hasFinePointer,
    hasCoarsePointer: hasCoarsePointer,
    isPureTouch: isPureTouch,
    viewportWidth: window.innerWidth,
    throttle: Math.round(randomBetween(trailConfig.throttleMin, trailConfig.throttleMax)),
    lastEventType: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    petalsCreated: 0
  };

  console.log('Plum trail ready', window.__plumTrailState);

  window.__testDomPetals = function () {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var total = 30;
    for (var i = 0; i < total; i++) {
      (function (idx) {
        setTimeout(function () {
          createPlumPetal(
            centerX + (Math.random() - 0.5) * 220,
            centerY + (Math.random() - 0.5) * 120,
            {
              className: 'plum-petal--test',
              size: randomBetween(26, 40),
              life: randomBetween(4200, 5200),
              driftX: (Math.random() - 0.5) * 110,
              driftY: randomBetween(64, 132),
              rotate: (Math.random() - 0.5) * 70,
              rotateMid: (Math.random() - 0.5) * 120,
              rotateEnd: (Math.random() - 0.5) * 180,
              color: 'rgba(216, 70, 84, 0.95)',
              opacity: 0.95,
              midOpacity: 0.86
            }
          );
        }, idx * 35);
      })(i);
    }
    window.setTimeout(function () {
      console.log('__testDomPetals spawned:', total);
      console.log('current petals:', document.querySelectorAll('.plum-petal').length);
    }, total * 35 + 120);
  };

  if (!enabled) {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', handleTouchPlumBurst, { passive: true, capture: true });
    }
    return;
  }

  var lastSpawnTime = 0;
  var spawnInterval = window.__plumTrailState.throttle;

  function buildPetalOptions() {
    var rotate = (Math.random() - 0.5) * trailConfig.rotateBase;
    var rotateStep = randomBetween(trailConfig.rotateStepMin, trailConfig.rotateStepMax);
    var depth = Math.random();
    var depthClass = depth > 0.72 ? 'plum-petal--near' : (depth < 0.34 ? 'plum-petal--far' : '');
    var petalColors = [
      'rgba(204, 67, 67, 0.9)',
      'rgba(188, 58, 72, 0.78)',
      'rgba(251, 202, 208, 0.82)'
    ];

    return {
      className: depthClass,
      size: randomBetween(trailConfig.sizeMin, trailConfig.sizeMax) * (depthClass === 'plum-petal--near' ? 1.08 : 0.92),
      life: randomBetween(trailConfig.durationMin, trailConfig.durationMax) + (depthClass === 'plum-petal--far' ? 400 : 0),
      driftX: (Math.random() - 0.5) * trailConfig.driftX * (depthClass === 'plum-petal--far' ? 0.72 : 1),
      driftY: randomBetween(trailConfig.driftYMin, trailConfig.driftYMax) * (depthClass === 'plum-petal--far' ? 0.78 : 1),
      rotate: rotate,
      rotateMid: rotate + rotateStep * 0.5,
      rotateEnd: rotate + rotateStep,
      opacity: randomBetween(trailConfig.opacityMin, trailConfig.opacityMax) * (depthClass === 'plum-petal--far' ? 0.76 : 1),
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    };
  }

  function handlePlumMove(event) {
    if (event.pointerType && event.pointerType === 'touch') return;

    var now = Date.now();
    window.__plumTrailState.lastEventType = event.type;
    window.__plumTrailState.lastX = event.clientX;
    window.__plumTrailState.lastY = event.clientY;
    window.__plumTrailState.lastTime = now;

    if (now - lastSpawnTime < spawnInterval) return;
    lastSpawnTime = now;

    createPlumPetal(
      event.clientX + (Math.random() - 0.5) * trailConfig.jitter,
      event.clientY + (Math.random() - 0.5) * trailConfig.jitter,
      buildPetalOptions()
    );
  }

  if (window.PointerEvent) {
    document.addEventListener('pointermove', handlePlumMove, { passive: true, capture: true });
    document.addEventListener('pointerdown', handleTouchPlumBurst, { passive: true, capture: true });
  } else {
    document.addEventListener('mousemove', handlePlumMove, { passive: true, capture: true });
  }

  function handleTouchPlumBurst(event) {
    if (!event.pointerType || event.pointerType !== 'touch') return;

    var total = Math.floor(randomBetween(3, 6));
    for (var i = 0; i < total; i++) {
      createPlumPetal(
        event.clientX + (Math.random() - 0.5) * 26,
        event.clientY + (Math.random() - 0.5) * 20,
        {
          size: randomBetween(17, 26),
          life: randomBetween(2600, 3800),
          driftX: (Math.random() - 0.5) * 58,
          driftY: randomBetween(44, 92),
          rotate: (Math.random() - 0.5) * 80,
          rotateMid: (Math.random() - 0.5) * 120,
          rotateEnd: (Math.random() - 0.5) * 180,
          color: ['rgba(201, 75, 82, 0.9)', 'rgba(184, 62, 70, 0.82)', 'rgba(251, 202, 208, 0.78)'][Math.floor(Math.random() * 3)],
          opacity: randomBetween(0.78, 0.94),
          midOpacity: randomBetween(0.58, 0.76)
        }
      );
    }
  }
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
