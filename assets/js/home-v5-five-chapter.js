/**
 * Homepage V5 · five-chapter post-Hero journey.
 * One GSAP timeline / one ScrollTrigger owns the long-scroll choreography.
 */
(function () {
  "use strict";

  var body = document.body;
  var journey = document.getElementById("home-v5-journey");
  if (!body || !journey || !body.classList.contains("page-home-v5")) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mapLayer = journey.querySelector(".home-v5-world-layer--map");
  var duskLayer = journey.querySelector(".home-v5-world-layer--dusk");
  var snowLayer = journey.querySelector(".home-v5-world-layer--snow");
  var tone = journey.querySelector(".home-v5-world-tone");
  var companion = journey.querySelector(".home-v5-companion");
  var cat = document.querySelector("[data-companion-cat]");
  var catTimers = [];

  function clearCatTimers() {
    catTimers.forEach(window.clearTimeout);
    catTimers = [];
  }

  function setCatState(state) {
    if (cat) cat.setAttribute("data-cat-state", state);
  }

  function showCat() {
    if (body.classList.contains("home-v5-cat-visible")) return;
    body.classList.add("home-v5-cat-visible");
    clearCatTimers();
    if (reduceMotion.matches) {
      setCatState("sit");
      return;
    }
    setCatState("walk");
    catTimers.push(window.setTimeout(function () { setCatState("look"); }, 1050));
    catTimers.push(window.setTimeout(function () { setCatState("sit"); }, 2350));
  }

  function hideCat() {
    body.classList.remove("home-v5-cat-visible");
    clearCatTimers();
  }

  function initCatStage() {
    if (!companion || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2 && (reduceMotion.matches || body.dataset.v5Scene === "companion")) showCat();
        else hideCat();
      });
    }, { threshold: [0, 0.2, 0.55] }).observe(companion);
  }

  function applyStaticScene(scene) {
    body.dataset.v5Scene = scene;
    mapLayer.style.opacity = scene === "map" ? "1" : "0";
    duskLayer.style.opacity = scene === "entry" || scene === "companion" ? "1" : "0";
    snowLayer.style.opacity = scene === "snow" ? "1" : scene === "gallery" ? "0.42" : scene === "ending" ? "0.16" : "0";
    snowLayer.style.transform = scene === "gallery" || scene === "ending" ? "translate3d(0, -1.2%, 0) scale(0.985)" : "none";
    tone.style.backgroundColor = scene === "gallery" ? "rgba(3, 5, 7, 0.62)" : scene === "ending" ? "rgba(3, 5, 7, 0.82)" : "rgba(3, 5, 7, 0)";
    if (scene === "companion") showCat();
    else hideCat();
  }

  function initReducedMotionScenes() {
    var scenes = [
      [journey.querySelector(".home-v5-map"), "map"],
      [journey.querySelector(".home-v5-entry"), "entry"],
      [companion, "companion"],
      [journey.querySelector(".home-v5-snow"), "snow"],
      [journey.querySelector(".home-v5-gallery"), "gallery"],
      [journey.querySelector(".home-v5-ending"), "ending"]
    ].filter(function (item) { return item[0]; });

    applyStaticScene("map");
    if (!("IntersectionObserver" in window)) return;

    var ratios = new Map();
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { ratios.set(entry.target, entry.intersectionRatio); });
      var active = scenes.reduce(function (best, item) {
        var ratio = ratios.get(item[0]) || 0;
        return ratio > best.ratio ? { scene: item[1], ratio: ratio } : best;
      }, { scene: "map", ratio: 0 });
      applyStaticScene(active.scene);
    }, { threshold: [0, 0.12, 0.3, 0.55, 0.8] }).observe(scenes[0][0]);

    /* Observe remaining sections on the same observer instance. */
    var staticObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          var match = scenes.find(function (item) { return item[0] === entry.target; });
          if (match) applyStaticScene(match[1]);
        }
      });
    }, { threshold: [0, 0.2, 0.5] });
    scenes.forEach(function (item) { staticObserver.observe(item[0]); });
  }

  function initJourneyTimeline() {
    if (!window.gsap || !window.ScrollTrigger) {
      applyStaticScene("map");
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    var gsap = window.gsap;
    var mapCopy = journey.querySelector(".home-v5-map-copy");
    var nodes = journey.querySelectorAll(".home-v5-landmarks a");
    var entryCopy = journey.querySelector(".home-v5-entry-copy");
    var roadCue = journey.querySelector(".home-v5-road-cue");
    var companionCopy = journey.querySelector(".home-v5-companion-copy");
    var lantern = document.querySelector(".home-v5-lantern");
    var snowCopy = journey.querySelector(".home-v5-snow-copy");
    var galleryCopy = journey.querySelector(".home-v5-gallery-copy");
    var memories = journey.querySelectorAll(".home-v5-memory");
    var mainMemory = journey.querySelector(".home-v5-memory--main");
    var cloudMemory = journey.querySelector(".home-v5-memory--cloud");
    var mossMemory = journey.querySelector(".home-v5-memory--moss");
    var endingCopy = journey.querySelector(".home-v5-ending-copy");
    var mapImage = mapLayer.querySelector("img");
    var duskImages = duskLayer.querySelectorAll("img");
    var snowImages = snowLayer.querySelectorAll("img");

    gsap.set([entryCopy, roadCue, companionCopy, lantern, snowCopy, galleryCopy, endingCopy], { autoAlpha: 0, y: 34 });
    gsap.set(mainMemory, { autoAlpha: 0, xPercent: 6, yPercent: 3, scale: 0.975 });
    gsap.set(cloudMemory, { autoAlpha: 0, xPercent: 28, yPercent: 0, scale: 0.985 });
    gsap.set(mossMemory, { autoAlpha: 0, xPercent: 34, yPercent: 0, scale: 0.985 });
    gsap.set(nodes, { autoAlpha: 1, y: 0 });
    gsap.set(mapCopy, { autoAlpha: 1, y: 0 });
    gsap.set(mapLayer, { autoAlpha: 1 });
    gsap.set([duskLayer, snowLayer], { autoAlpha: 0 });
    gsap.set(tone, { backgroundColor: "rgba(3, 5, 7, 0)" });

    var timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "home-v5-journey",
        trigger: journey,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var progress = self.progress;
          var scene = progress < 0.2 ? "map" : progress < 0.38 ? "entry" : progress < 0.56 ? "companion" : progress < 0.77 ? "snow" : progress < 0.965 ? "gallery" : "ending";
          if (body.dataset.v5Scene !== scene) body.dataset.v5Scene = scene;

          /* Let the companion leave during the first half of the dusk-to-snow
             dissolve, before the snow chapter becomes the dominant image. */
          if (scene === "companion" && progress < 0.5) showCat();
          else hideCat();
        }
      }
    });

    timeline
      .to(mapCopy, { autoAlpha: 0, y: -22, duration: 4 }, 10)
      .to(nodes, { autoAlpha: 0, y: -12, duration: 4, stagger: 0.16 }, 11)
      .to(mapImage, { scale: 1.045, duration: 16 }, 0)
      .to(mapLayer, { autoAlpha: 0, duration: 8 }, 12)
      .to(duskLayer, { autoAlpha: 1, duration: 8 }, 12)
      .to(duskImages, { scale: 1.075, yPercent: -1.5, duration: 34 }, 13)
      .to(entryCopy, { autoAlpha: 1, y: 0, duration: 5 }, 17)
      .to(roadCue, { autoAlpha: 1, y: 0, duration: 4 }, 20)
      .to(entryCopy, { autoAlpha: 0, y: -22, duration: 4 }, 29)
      .to(roadCue, { autoAlpha: 0, y: -15, duration: 3 }, 30)
      .to(companionCopy, { autoAlpha: 1, y: 0, duration: 5 }, 33)
      .to(lantern, { autoAlpha: 1, y: 0, duration: 5 }, 34)
      .to(companionCopy, { autoAlpha: 0, y: -24, duration: 4 }, 45)
      .to(lantern, { autoAlpha: 0, y: -12, duration: 4 }, 46)
      .to(duskLayer, { autoAlpha: 0, duration: 8 }, 47)
      .to(snowLayer, { autoAlpha: 1, duration: 8 }, 47)
      .to(snowImages, { scale: 1.07, xPercent: -1, duration: 34 }, 48)
      .to(snowCopy, { autoAlpha: 1, y: 0, duration: 5 }, 53)
      .to(snowCopy, { autoAlpha: 0, y: -22, duration: 4 }, 65)
      .to(tone, { backgroundColor: "rgba(3, 5, 7, 0.62)", duration: 10 }, 65)
      .to(snowLayer, { autoAlpha: 0.42, scale: 0.985, yPercent: -1.2, duration: 11 }, 66)
      .to(mainMemory, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 7 }, 70)
      .to(galleryCopy, { autoAlpha: 1, y: 0, duration: 5 }, 73)
      .to(cloudMemory, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 5 }, 78)
      .to(mossMemory, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 5 }, 82)
      .to(memories, { yPercent: -2, duration: 10, stagger: 0.35 }, 86)
      .to(galleryCopy, { autoAlpha: 0, y: -20, duration: 4 }, 94)
      .to(memories, { autoAlpha: 0, yPercent: -5, scale: 0.985, duration: 4, stagger: 0.2 }, 94)
      .to(snowLayer, { autoAlpha: 0.16, scale: 0.975, yPercent: -2, duration: 6 }, 93)
      .to(tone, { backgroundColor: "rgba(3, 5, 7, 0.82)", duration: 6 }, 93)
      .to(endingCopy, { autoAlpha: 1, y: 0, duration: 4 }, 96);

    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); }, { once: true });
  }

  initCatStage();
  if (reduceMotion.matches) initReducedMotionScenes();
  else initJourneyTimeline();
})();
