/**
 * Homepage V4.1 formal integration.
 * Preserves the approved desktop timeline without prototype diagnostics.
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("page-home")) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var stage = document.querySelector("#home-v41-stage");
  var world = document.querySelector("#home-v41-world");
  var journey = document.querySelector("#home-journey");
  var heroCopy = document.querySelector(".home-v41-hero-copy");
  var prologue = document.querySelector(".home-v41-prologue");

  if (!stage || !world || !journey || !heroCopy || !prologue) return;

  document.body.setAttribute("data-home-stage", "entrance");

  if (!gsap || !ScrollTrigger) {
    document.body.setAttribute("data-home-stage", "content");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var IMG_W = 2560;
  var IMG_H = 1440;
  var VP = { x: 0.56, y: 0.57 };
  var DEPTH_END = 0.25;
  var LAYER_TARGET_SCALE = {
    ".home-v41-layer-base": 1.0,
    ".home-v41-layer-road": 1.18,
    ".home-v41-layer-cliff": 1.24,
    ".home-v41-layer-left": 1.32
  };
  var timeline = null;

  function computeVpOrigin() {
    var vw = stage.clientWidth;
    var vh = stage.clientHeight;
    var scale = Math.max(vw / IMG_W, vh / IMG_H);
    var originX = (vw - IMG_W * scale) / 2 + VP.x * IMG_W * scale;
    var originY = (vh - IMG_H * scale) / 2 + VP.y * IMG_H * scale;
    return originX + "px " + originY + "px";
  }

  function applyOrigin() {
    var origin = computeVpOrigin();
    var layers = world.querySelectorAll(".home-v41-layer");
    for (var i = 0; i < layers.length; i++) {
      layers[i].style.transformOrigin = origin;
    }
  }

  function setJourneyStage(value) {
    document.body.setAttribute("data-home-stage", value);
  }

  function buildTimeline() {
    gsap.set(".home-v41-prologue-title", { opacity: 0, y: 16 });
    gsap.set(".home-v41-prologue-line", { opacity: 0, y: 18 });
    gsap.set(".home-v41-prologue-chapter", { opacity: 0 });
    gsap.set(".home-v41-prologue-seal", { opacity: 0 });
    gsap.set(".home-v41-prologue-actions", { opacity: 0 });
    gsap.set(".home-v41-prologue-rail", { scaleY: 0, transformOrigin: "top" });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "home-v41-journey",
        trigger: journey,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        invalidateOnRefresh: true,
        onEnter: function () { setJourneyStage("entrance"); },
        onEnterBack: function () { setJourneyStage("entrance"); },
        onLeaveBack: function () { setJourneyStage("entrance"); },
        onLeave: function () { setJourneyStage("content"); },
        onUpdate: function (self) {
          heroCopy.style.pointerEvents = self.progress < 0.08 ? "auto" : "none";
          prologue.style.pointerEvents = self.progress > 0.82 ? "auto" : "none";
          if (self.progress < 1) setJourneyStage("entrance");
        }
      }
    });

    Object.keys(LAYER_TARGET_SCALE).forEach(function (selector) {
      var target = LAYER_TARGET_SCALE[selector];
      if (target === 1) return;
      tl.to(selector, { scale: target, duration: DEPTH_END, ease: "power1.in" }, 0);
    });

    tl.to(".home-v41-mist-a", { xPercent: -18, yPercent: -22, opacity: 0.30, duration: 0.25, ease: "power1.out" }, 0);
    tl.to(".home-v41-mist-b", { xPercent: 12, yPercent: -12, opacity: 0.26, duration: 0.25, ease: "power1.out" }, 0);

    tl.to(".home-v41-primary-action", { opacity: 0, duration: 0.045 }, 0.020);
    tl.to(".home-v41-hero-eyebrow", { opacity: 0, duration: 0.055 }, 0.035);
    tl.to(".home-v41-hero-subtitle", { opacity: 0, y: -18, duration: 0.070 }, 0.040);
    tl.to(".home-v41-hero-title", { opacity: 0, y: -10, duration: 0.105 }, 0.055);

    tl.to(".home-v41-scroll-cue", { opacity: 0, duration: 0.07 }, 0);
    tl.to("body.page-home > header", { opacity: 0.30, y: -6, duration: 0.14 }, 0.04);

    tl.addLabel("见山", 0);
    tl.addLabel("启行", 0.02);
    tl.addLabel("入谷", 0.10);
    tl.addLabel("谷中呼吸", 0.25);
    tl.addLabel("卷开", 0.40);

    tl.to(".home-v41-dusk-wash", { opacity: 1, duration: 0.16 }, 0.40);
    tl.to(".home-v41-mist-a", { opacity: 0.36, duration: 0.13 }, 0.40);
    tl.to(".home-v41-mist-b", { opacity: 0.32, duration: 0.13 }, 0.40);
    tl.to(".home-v41-paper-grain", { opacity: 0.32, duration: 0.14 }, 0.42);

    tl.to(".home-v41-prologue", { opacity: 1, duration: 0.07 }, 0.45);
    tl.to(".home-v41-prologue-rail", { scaleY: 1, duration: 0.12 }, 0.48);
    tl.to(".home-v41-prologue-chapter", { opacity: 1, duration: 0.09 }, 0.49);
    tl.to(".home-v41-prologue-seal", { opacity: 1, duration: 0.09 }, 0.49);
    tl.to(".home-v41-prologue-title", { opacity: 1, y: 0, duration: 0.09 }, 0.52);
    tl.addLabel("小序", 0.56);

    var lines = document.querySelectorAll(".home-v41-prologue-line");
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      tl.to(lines[lineIndex], { opacity: 1, y: 0, duration: 0.05 }, 0.60 + lineIndex * 0.035);
    }

    tl.to(".home-v41-prologue-actions", { opacity: 1, duration: 0.07 }, 0.82);
    tl.to("body.page-home > header", { opacity: 0.95, y: 0, duration: 0.12 }, 0.66);
    tl.to(".home-v41-progress-rail i", { scaleY: 1, duration: 1 }, 0);

    return tl;
  }

  function observeStaticJourney() {
    if (!("IntersectionObserver" in window)) {
      setJourneyStage("content");
      return function () {};
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setJourneyStage(entry.isIntersecting ? "entrance" : "content");
      });
    }, { threshold: 0.02 });
    observer.observe(journey);
    return function () { observer.disconnect(); };
  }

  var media = gsap.matchMedia();
  media.add({
    desktop: "(min-width: 769px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    if (!context.conditions.desktop || context.conditions.reduceMotion) {
      prologue.style.pointerEvents = "auto";
      return observeStaticJourney();
    }

    applyOrigin();
    window.addEventListener("resize", applyOrigin, { passive: true });
    timeline = buildTimeline();

    return function () {
      window.removeEventListener("resize", applyOrigin);
      timeline = null;
    };
  });

  document.querySelectorAll("[data-home-v41-scroll]").forEach(function (element) {
    element.addEventListener("click", function (event) {
      if (!timeline || !timeline.scrollTrigger) return;
      event.preventDefault();
      var target = parseFloat(element.getAttribute("data-home-v41-scroll")) || 0;
      var trigger = timeline.scrollTrigger;
      var scrollTop = trigger.start + (trigger.end - trigger.start) * target;
      window.scrollTo({ top: Math.round(scrollTop), behavior: "smooth" });
    });
  });

  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(function (resolve) {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(resolve);
      });
    })
  ]).then(function () {
    ScrollTrigger.refresh();
    document.documentElement.dataset.homeV41Ready = "true";
  });
})();
