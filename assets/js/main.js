/* ================================================================
   Pradeep Kumar — Portfolio Interactions
   Vanilla JS. No dependencies.
   ================================================================ */

(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    // --- Scroll Progress Bar ---
    const progressBar = $('#scrollProgress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
        }
    }

    // --- Nav background on scroll ---
    const nav = $('#nav');
    function updateNav() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }

    // --- Back to Top visibility ---
    const backToTop = $('#backToTop');
    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Combined scroll handler (runs on rAF for perf) ---
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateProgress();
                updateNav();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- Mobile Nav Toggle ---
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');

    navToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when a link is clicked
    $$('a', navLinks).forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // --- Active nav link on scroll (IntersectionObserver) ---
    const sections = $$('section[id]');
    const navAnchors = $$('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(function (a) {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(function (sec) { sectionObserver.observe(sec); });

    // --- Scroll-triggered fade-in animations ---
    const animElements = $$('[data-animate]');
    const animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(function (el) { animObserver.observe(el); });

    // --- Initial state ---
    updateProgress();
    updateNav();
    updateBackToTop();

})();
