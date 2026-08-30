/**
 * landing.js — Interactions for the Home Showcase
 */
(function () {
  'use strict';

  window.initLandingScripts = function () {
    // Subtle hero entrance
    const heroContent = document.querySelector('.hero-content-wrap');
    if (heroContent) {
      heroContent.style.opacity = '1';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLandingScripts);
  } else {
    window.initLandingScripts();
  }
})();