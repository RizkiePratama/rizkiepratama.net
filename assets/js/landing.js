/**
 * landing.js — Watchdogs HUD style script for the Landing Page
 */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



  /* ── 1. Text Decode Animation ──────────────────────────── */
  function runDecodeAnimation(element) {
    if (element.classList.contains('decoded')) return;
    element.classList.add('decoded');
    
    const finalStr = element.getAttribute('data-value');
    if (!finalStr) return;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?';
    let iterations = 0;
    const maxIterations = 20; // slightly longer for the big main title
    
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
    }, 45);
  }

  function initLandingDecode() {
    const el = document.querySelector('.home-name.decode-text');
    if (el && !el.classList.contains('decoded')) {
      const finalStr = el.getAttribute('data-value') || '';
      el.innerText = finalStr.split('').map(c => c === ' ' ? ' ' : 'X').join('');
      setTimeout(() => runDecodeAnimation(el), 300); // slight delay after load
    }
  }

  /* ── 2. Typewriter Role Loop ───────────────────────────── */
  function initLandingTypewriter() {
    const target = document.getElementById('landing-typewriter');
    const stringsData = document.getElementById('role-strings');
    
    if (!target || !stringsData) return;

    const lines = [];
    const keys = ['dev', 'vid', 'pho', 'game'];
    const defaults = {
      dev: 'Software Developer',
      vid: 'Video Editor',
      pho: 'Photographer',
      game: 'Game Developer'
    };

    keys.forEach(key => {
      const kanji = stringsData.getAttribute(`data-${key}`) || defaults[key];
      const kana = stringsData.getAttribute(`data-${key}-kana`);
      lines.push({ kanji, kana });
    });

    let lineIndex = 0;
    let charIndex = 0;
    let state = 'typing'; // 'typing', 'converting', 'pause', 'deleting'
    
    const SPEED_TYPE = 65;
    const SPEED_DEL  = 30;
    const PAUSE_END  = 2000;
    const PAUSE_DEL  = 600;
    const PAUSE_CONV = 350; // Visual pause for the IME candidate select

    function tick() {
      if (!document.getElementById('landing-typewriter')) return; // Exit if navigated away
      
      const line = lines[lineIndex];

      if (state === 'typing') {
        if (line.kana) {
          // Japanese phonetic composition typing
          target.innerHTML = `<span class="ime-composition">${line.kana.slice(0, charIndex + 1)}</span>`;
          charIndex++;
          if (charIndex === line.kana.length) {
            state = 'converting';
            setTimeout(tick, SPEED_TYPE + 100); // Slight delay before space conversion
            return;
          }
        } else {
          // Standard English typing
          target.textContent = line.kanji.slice(0, charIndex + 1);
          charIndex++;
          if (charIndex === line.kanji.length) {
            state = 'deleting';
            setTimeout(tick, PAUSE_END);
            return;
          }
        }
        setTimeout(tick, SPEED_TYPE);
      } else if (state === 'converting') {
        // Simulates space bar conversion to Kanji with solid background candidate select highlight
        target.innerHTML = `<span class="ime-converted">${line.kanji}</span>`;
        state = 'pause';
        setTimeout(tick, PAUSE_CONV);
      } else if (state === 'pause') {
        // Clears selection style, displays finalized Kanji text
        target.textContent = line.kanji;
        charIndex = line.kanji.length;
        state = 'deleting';
        setTimeout(tick, PAUSE_END);
      } else if (state === 'deleting') {
        // Backspaces the Kanji characters
        target.textContent = line.kanji.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          state = 'typing';
          lineIndex = (lineIndex + 1) % lines.length;
          setTimeout(tick, PAUSE_DEL);
          return;
        }
        setTimeout(tick, SPEED_DEL);
      }
    }

    // start after title decode settles
    setTimeout(tick, 1500);
  }

  /* ── Boot sequence ─────────────────────────────────────── */
  window.initLandingScripts = function () {
    if (!document.getElementById('home')) return;
    document.body.id = 'landing'; // Fix CSS rules targeting body#landing on Swup navigation

    if (reducedMotion) {
      // Skip animation
      const hudFrame = document.getElementById('landing-hud-frame');
      if (hudFrame) hudFrame.style.display = 'inline-block';
      
      const container = document.getElementById('startup-sequence');
      if (container) container.style.display = 'none';

      const nameEl = document.querySelector('.home-name.decode-text');
      if (nameEl && nameEl.hasAttribute('data-value')) {
        nameEl.innerText = nameEl.getAttribute('data-value');
        nameEl.classList.add('decoded');
      }
      
      const tw = document.getElementById('landing-typewriter');
      const stringsData = document.getElementById('role-strings');
      if (tw && stringsData) {
        tw.textContent = stringsData.getAttribute('data-dev') || 'Software Developer';
      }
      return;
    }

    // Set random background image on #home to simulate the previous CRT vibes
    const homeEl = document.getElementById('home');
    if (homeEl) {
      let bgId = sessionStorage.getItem('landing_bg_id');
      if (!bgId) {
        const min = 1; const max = 4;
        bgId = Math.floor(Math.random() * (max - min + 1)) + min;
        sessionStorage.setItem('landing_bg_id', bgId);
      }
      homeEl.style.backgroundImage = `url('/assets/images/bg/${bgId}.jpg')`;
    }

    document.body.classList.add('booted');
    initLandingDecode();
    initLandingTypewriter();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLandingScripts);
  } else {
    window.initLandingScripts();
  }
}());