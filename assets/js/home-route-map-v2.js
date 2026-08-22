/**
 * Homepage V4.2.1 formal route-map integration.
 * Keeps the map inline and only enhances real same-page destinations.
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("page-home")) return;

  var routeMap = document.getElementById("home-route-map");
  if (!routeMap) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var samePageLinks = routeMap.querySelectorAll('a[href^="#"]');

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        document.body.classList.toggle("route-map-in-view", entry.isIntersecting && entry.intersectionRatio > 0.12);
      });
    }, { threshold: [0, 0.12, 0.5] }).observe(routeMap);
  }

  function updateHash(hash) {
    if (!window.history || !window.history.pushState || window.location.hash === hash) return;
    window.history.pushState(null, "", hash);
  }

  function scrollToTarget(target, hash) {
    var progressValue = target.getAttribute("data-home-v41-progress");
    var journey = target.closest(".home-v41-journey");
    var useJourneyProgress = progressValue !== null && journey && window.matchMedia("(min-width: 769px)").matches && !reduceMotion.matches;

    updateHash(hash);

    if (useJourneyProgress) {
      var progress = Math.min(1, Math.max(0, Number(progressValue) || 0));
      var scrollRange = Math.max(0, journey.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: journey.offsetTop + scrollRange * progress,
        behavior: "smooth"
      });
      return;
    }

    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  }

  samePageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var hash = link.getAttribute("href");
      var target = hash && document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target, hash);
    });
  });
})();
