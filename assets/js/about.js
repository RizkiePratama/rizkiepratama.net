/**
 * about.js — Interactive effects for the About page
 * Covers:
 *   1. Staggered character name reveal
 *   2. Typewriter role animation
 *   3. Scroll-reveal (IntersectionObserver) for sections & timeline items
 *   4. Stat-bar fill on scroll-into-view
 *   5. 3D tilt effect on stack cards
 *   6. Holographic mouse-position sheen on affiliation cards
 *
 * Zero dependencies — vanilla JS only.
 * Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Text Decode Animation (Watchdogs Style) ────────── */
  function runDecodeAnimation(element) {
    if (element.classList.contains('decoded')) return;
    element.classList.add('decoded');
    
    const finalStr = element.getAttribute('data-value');
    if (!finalStr) return;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?';
    let iterations = 0;
    const maxIterations = 15;
    
    const interval = setInterval(() => {
      element.innerText = finalStr.split('').map((letter, index) => {
        if (index < (iterations / maxIterations) * finalStr.length) {
          return finalStr[index];
        }
        if (letter === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        element.innerText = finalStr;
      }
      iterations += 1;
    }, 40);
  }

  function initDecodeText() {
    const decodes = document.querySelectorAll('.decode-text');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(() => runDecodeAnimation(entry.target), 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    decodes.forEach(el => {
      // Set initial random characters before reveal
      if (!el.classList.contains('decoded')) {
        const finalStr = el.getAttribute('data-value') || '';
        el.innerText = finalStr.split('').map(c => c === ' ' ? ' ' : 'X').join('');
        observer.observe(el);
      }
    });
  }

  /* ── 2. Typewriter role text ───────────────────────────── */
  function typewriterRole () {
    const target = document.getElementById('typewriter-text');
    if (!target) return;
    
    const container = document.querySelector('.hero-role');
    const lines = [
      container ? container.getAttribute('data-role1') : 'Senior Systems Engineer',
      container ? container.getAttribute('data-role2') : 'OTT / Live Transcoding Architect',
      container ? container.getAttribute('data-role3') : 'Video Pipeline Builder',
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const SPEED_TYPE = 60;
    const SPEED_DEL  = 28;
    const PAUSE_END  = 1800;
    const PAUSE_DEL  = 500;

    function tick () {
      const current = lines[lineIndex];

      if (!deleting) {
        target.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, PAUSE_END);
          return;
        }
        setTimeout(tick, SPEED_TYPE);
      } else {
        target.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
          setTimeout(tick, PAUSE_DEL);
          return;
        }
        setTimeout(tick, SPEED_DEL);
      }
    }

    // start after name animation settles
    setTimeout(tick, 1400);
  }

  /* ── 3 & 4. Scroll-reveal + stat-bar fill ─────────────── */
  function initScrollReveal () {
    // Generic sections
    const sections = document.querySelectorAll('.js-reveal');

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(function (el) {
      sectionObserver.observe(el);
    });

    // Work history role items — staggered slide-in per company
    const roleItems = document.querySelectorAll('.exp-role-item');
    const roleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Reveal all role items in the same company list together
          const siblingItems = entry.target
            .closest('.exp-roles-list')
            .querySelectorAll('.exp-role-item');
          siblingItems.forEach(function (item, i) {
            setTimeout(function () {
              item.classList.add('in-view');
            }, i * 110);
          });
          roleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Observe the first role item in each company group
    document.querySelectorAll('.exp-roles-list').forEach(function (list) {
      var first = list.querySelector('.exp-role-item');
      if (first) roleObserver.observe(first);
    });
  }

  /* ── 5. 3D Tilt on stack cards ────────────────────────── */
  function initTilt () {
    if (reducedMotion) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(function (card) {
      const inner = card.querySelector('.stack-card-inner');
      if (!inner) return;

      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const tiltX  = -(dy * 6).toFixed(2);  // max ±6 deg
        const tiltY  =  (dx * 6).toFixed(2);

        inner.style.setProperty('--tilt-x', tiltX + 'deg');
        inner.style.setProperty('--tilt-y', tiltY + 'deg');
      });

      card.addEventListener('mouseleave', function () {
        inner.style.setProperty('--tilt-x', '0deg');
        inner.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  /* ── 6. Holographic mouse sheen on aff cards ──────────── */
  function initHolo () {
    if (reducedMotion) return;

    const cards = document.querySelectorAll('.holo-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
      });
    });
  }

  /* ── Auto-Calculate Durations ────────────────────────── */
  function updateDurations() {
    const aboutSection = document.getElementById('about-section');
    if (!aboutSection) return;
    
    const strYr = aboutSection.getAttribute('data-yr') || 'yr';
    const strYrs = aboutSection.getAttribute('data-yrs') || 'yrs';
    const strMo = aboutSection.getAttribute('data-mo') || 'mo';
    const strMos = aboutSection.getAttribute('data-mos') || 'mos';

    const elements = document.querySelectorAll('[data-start-date]');
    const now = new Date();

    elements.forEach(el => {
      const startDate = new Date(el.getAttribute('data-start-date'));
      const format = el.getAttribute('data-format') || 'long';
      
      let months = (now.getFullYear() - startDate.getFullYear()) * 12;
      months -= startDate.getMonth();
      months += now.getMonth();
      
      const years = Math.floor(months / 12);
      months = months % 12;

      let durationStr = '';
      if (format === 'short') {
        durationStr = years + '+ ' + strYrs;
      } else {
        if (years > 0) {
          durationStr += years + ' ' + (years > 1 ? strYrs : strYr);
        }
        if (months > 0) {
          if (durationStr) durationStr += ' ';
          durationStr += months + ' ' + (months > 1 ? strMos : strMo);
        }
      }
      
      el.textContent = durationStr;
    });
  }

  /* ── Boot sequence ─────────────────────────────────────── */
  window.initAboutScripts = function () {
    // Only run if we are actually on the about page
    if (!document.getElementById('about-section')) return;
    document.body.id = 'about';

    if (reducedMotion) {
      // Skip all animation; just make everything visible
      document.querySelectorAll('.char, .decode-text').forEach(function (c) {
        c.style.opacity = 1;
        c.style.transform = 'none';
        if (c.hasAttribute('data-value')) {
          c.innerText = c.getAttribute('data-value');
          c.classList.add('decoded');
        }
      });
      document.querySelectorAll('.js-reveal, .exp-role-item').forEach(function (el) {
        el.classList.add('in-view');
      });
      var tw = document.getElementById('typewriter-text');
      if (tw) tw.textContent = 'Senior Systems Engineer / OTT Transcoding';
      return;
    }

    initDecodeText();
    typewriterRole();
    initScrollReveal();
    initTilt();
    initHolo();
    updateDurations();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAboutScripts);
  } else {
    window.initAboutScripts();
  }
}());
