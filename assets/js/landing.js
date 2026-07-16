/**
 * landing.js — Watchdogs HUD style script for the Landing Page
 */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 0. Startup Sequence ───────────────────────────────── */
  function initStartupSequence(onComplete) {
    const wrapper = document.getElementById('startup-sequence-wrapper');
    const container = document.getElementById('startup-sequence');
    const hudFrame = document.getElementById('landing-hud-frame');
    
    if (!wrapper || !container || !hudFrame) {
      if (onComplete) onComplete();
      return;
    }
    
    if (reducedMotion) {
      wrapper.style.display = 'none';
      hudFrame.style.display = 'inline-block';
      document.body.classList.add('skip-anims');
      document.body.classList.add('booted');
      if (onComplete) onComplete();
      return;
    }

    // Reset for boot sequence
    document.body.classList.remove('skip-anims');
    document.body.classList.remove('booted');
    wrapper.style.opacity = '1';
    wrapper.style.visibility = 'visible';
    wrapper.style.display = 'flex';
    container.innerHTML = '';
    container.style.display = 'flex';
    hudFrame.style.display = 'none';

    const lines = [
      "INITIATING SYSTEM...",
      "ESTABLISHING SECURE CONNECTION...",
      "LOADING KERNEL MODULES...",
      "DECRYPTING IDENTITY...",
      "ACCESS GRANTED."
    ];

    let currentLine = 0;
    let charIndex = 0;
    let p = null;
    
    function typeNextChar() {
      if (!document.getElementById('startup-sequence')) return; // Exit if navigated away
      
      if (currentLine >= lines.length) {
        // Sequence finished
        setTimeout(() => {
          if (!document.getElementById('startup-sequence-wrapper')) return;
          
          // Fade to black and reveal
          wrapper.style.opacity = '0';
          wrapper.style.visibility = 'hidden';
          hudFrame.style.display = 'inline-block';
          
          // Wait for the fade out to finish before triggering component intro animations
          setTimeout(() => {
             document.body.classList.add('booted');
             if (onComplete) onComplete();
          }, 400);

        }, 200);
        return;
      }
      
      if (charIndex === 0) {
        p = document.createElement('p');
        p.className = 'startup-line';
        container.appendChild(p);
      }
      
      const lineText = '> ' + lines[currentLine];
      
      if (charIndex < lineText.length) {
        // Random glitch character chance
        let charToType = lineText[charIndex];
        if (Math.random() > 0.95 && charToType !== ' ') {
          charToType = '!@#$%^&*()'[Math.floor(Math.random() * 10)];
          // don't increment charIndex so it fixes itself next tick, like a real glitch
        } else {
          charIndex++;
        }
        
        p.textContent = lineText.substring(0, charIndex) + (Math.random() > 0.5 ? '█' : '');
        setTimeout(typeNextChar, 7 + Math.random() * 10); // Accelerated typing delay
      } else {
        p.textContent = lineText; // Ensure block cursor is gone and text is perfect
        currentLine++;
        charIndex = 0;
        setTimeout(typeNextChar, 100 + Math.random() * 120); // Accelerated line pause
      }
    }
    
    setTimeout(typeNextChar, 300);
  }

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

    const lines = [
      stringsData.getAttribute('data-dev') || 'Software Developer',
      stringsData.getAttribute('data-vid') || 'Video Engineer',
      stringsData.getAttribute('data-pho') || 'Photographer',
      stringsData.getAttribute('data-game') || 'Game Developer'
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const SPEED_TYPE = 60;
    const SPEED_DEL  = 30;
    const PAUSE_END  = 2000;
    const PAUSE_DEL  = 600;

    function tick () {
      if (!document.getElementById('landing-typewriter')) return; // Exit if navigated away
      
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

    initStartupSequence(function() {
      initLandingDecode();
      initLandingTypewriter();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLandingScripts);
  } else {
    window.initLandingScripts();
  }
}());