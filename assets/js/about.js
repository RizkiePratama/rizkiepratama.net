/**
 * about.js — Clean interactions and dynamic experience calculation for About page
 */
(function () {
  'use strict';

  function updateExperienceDates() {
    const dateElements = document.querySelectorAll('[data-start-date]');
    const now = new Date();

    dateElements.forEach(el => {
      const startStr = el.getAttribute('data-start-date');
      if (!startStr) return;

      const [startYear, startMonth] = startStr.split('-').map(Number);
      const start = new Date(startYear, startMonth - 1);

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      const format = el.getAttribute('data-format');
      if (format === 'short') {
        el.textContent = `${years}+ yrs`;
      } else if (months > 0) {
        el.textContent = `${years} yrs ${months} mos`;
      } else {
        el.textContent = `${years} yrs`;
      }
    });
  }

  window.initAboutScripts = function () {
    updateExperienceDates();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAboutScripts);
  } else {
    window.initAboutScripts();
  }
})();
