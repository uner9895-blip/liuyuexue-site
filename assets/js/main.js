/**
 * 六月雪个人网页 - 静态站基础交互与特效系统
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initContactForm();
  initActiveNavLink();
  initScrollReveal();
  initInkParticles();
  initSkillExplanations();
  initBackToTop();
});

/**
 * 移动端导航交互
 */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!burgerBtn || !navMenu) return;

  const openMenu = () => {
    burgerBtn.classList.add('active');
    navMenu.classList.add('active');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', '关闭导航菜单');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    burgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', '打开导航菜单');
    document.body.classList.remove('menu-open');
  };

  burgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!navMenu.classList.contains('active')) return;
    if (!navMenu.contains(event.target) && !burgerBtn.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
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

/**
 * 克制的水墨微粒背景
 */
function initInkParticles() {
  // 检查 prefers-reduced-motion 系统级减弱动画偏好
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ink-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  const particleCount = 12;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class InkParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // 随机初始化高度
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -40;
      this.size = Math.random() * 38 + 18; // 18px ~ 56px
      this.speedY = Math.random() * 0.35 + 0.12; // 极其缓慢
      this.speedX = Math.random() * 0.15 - 0.075;
      this.opacity = Math.random() * 0.026 + 0.006; // 极低透明度，克制优雅
      this.angle = Math.random() * Math.PI * 2;
      this.swingSpeed = Math.random() * 0.004 + 0.002;
    }

    update() {
      this.y += this.speedY;
      this.angle += this.swingSpeed;
      this.x += this.speedX + Math.sin(this.angle) * 0.15;

      if (this.y - this.size > canvas.height || this.x < -this.size || this.x > canvas.width + this.size) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      // 水墨晕染渐变，从中心向边缘淡出
      grad.addColorStop(0, `rgba(32, 33, 31, ${this.opacity})`);
      grad.addColorStop(0.5, `rgba(32, 33, 31, ${this.opacity * 0.4})`);
      grad.addColorStop(1, 'rgba(32, 33, 31, 0)');
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new InkParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // 监听并动态卸载
  motionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
      window.removeEventListener('resize', resizeCanvas);
    }
  });
}

/**
 * 技能标签点击互动释义
 */
const SKILL_EXPLANATIONS = {
  'HTML': '超文本标记语言。网页的骨骼与墨线，我遵循语义化原则，力求结构清晰、无障碍友好。',
  'CSS': '层叠样式表。网页的设色与笔触，在此用于实践中式留白、淡雅色调及响应式布局。',
  'JavaScript': '网页的生命力。使用原生 JS 实现轻量且无依赖的动画与交互，关注性能。',
  '响应式布局': '随器赋形。确保网站从 320px 手机屏到 2K 显示器都能如卷轴般完美舒展。',
  'GitHub Pages': '行止留痕。将静态代码一键托管，是我的第一个线上发布与版本管理实践。',
  '个人网页设计': '以画入网。探索传统水墨美学在现代数字媒介中的体现，讲究克制与留白。'
};

function initSkillExplanations() {
  const skillTags = document.querySelectorAll('.skill-tag');

  skillTags.forEach(tag => {
    const skillName = tag.textContent.trim();
    const explanation = SKILL_EXPLANATIONS[skillName];
    if (!explanation) return;

    tag.addEventListener('click', (e) => {
      e.stopPropagation();

      // 关闭其他提示气泡
      document.querySelectorAll('.skill-tooltip').forEach(tip => {
        tip.classList.remove('show');
      });

      let tooltip = tag.querySelector('.skill-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = explanation;
        tag.appendChild(tooltip);

        // 强制重绘
        tooltip.offsetHeight;
      }

      tooltip.classList.add('show');

      clearTimeout(tag.tooltipTimeout);
      tag.tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('show');
      }, 3500);
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.skill-tooltip').forEach(tip => {
      tip.classList.remove('show');
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
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollBack();
    }
  });
}

