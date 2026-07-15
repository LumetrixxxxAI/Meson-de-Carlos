(function () {
  "use strict";

  /* -------------------- Header al hacer scroll -------------------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* -------------------- Menú móvil -------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      document.body.style.overflow = "";
    });
  });

  /* -------------------- Scroll reveal -------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -------------------- Carrusel de reseñas -------------------- */
  var track = document.getElementById("reviewsSlides");
  var dotsWrap = document.getElementById("reviewDots");
  var prevBtn = document.getElementById("reviewPrev");
  var nextBtn = document.getElementById("reviewNext");

  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var current = 0;
    var autoplayTimer;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "review-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Ir a la reseña " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        resetAutoplay();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
      });
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () {
        goTo(current + 1);
      }, 6000);
    }

    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
      resetAutoplay();
    });
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
      resetAutoplay();
    });

    var startX = null;
    track.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      function (e) {
        if (startX === null) return;
        var delta = e.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 40) {
          goTo(current + (delta < 0 ? 1 : -1));
          resetAutoplay();
        }
        startX = null;
      },
      { passive: true }
    );

    resetAutoplay();
  }

  /* -------------------- Banner de cookies -------------------- */
  var cookieBanner = document.getElementById("cookieBanner");
  var cookieAccept = document.getElementById("cookieAccept");
  var cookieReject = document.getElementById("cookieReject");
  var COOKIE_KEY = "llc_cookie_consent";

  if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
    setTimeout(function () {
      cookieBanner.classList.add("is-visible");
    }, 700);
  }

  function hideCookieBanner(value) {
    localStorage.setItem(COOKIE_KEY, value);
    cookieBanner.classList.remove("is-visible");
  }

  if (cookieAccept) {
    cookieAccept.addEventListener("click", function () {
      hideCookieBanner("accepted");
    });
  }
  if (cookieReject) {
    cookieReject.addEventListener("click", function () {
      hideCookieBanner("rejected");
    });
  }

  /* -------------------- Año en el footer -------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
