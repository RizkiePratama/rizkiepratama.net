/* =========================================
   PORTFOLIO JS — SHARP INTERACTIVE
   ========================================= */
(function () {
  'use strict';
  window.initPortoScripts = function () {
  // =========================================
  // SCROLL REVEAL
  // =========================================
  function revealVisible() {
    document.querySelectorAll('.reveal:not(.active)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        el.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', revealVisible, { passive: true });
  revealVisible();

  // Staggered reveal for list rows
  function staggerList(selector, delay) {
    document.querySelectorAll(selector).forEach(list => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          Array.from(e.target.children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateX(-8px)';
            child.style.transition = `opacity 0.25s ease ${i * delay}ms, transform 0.25s ease ${i * delay}ms`;
            requestAnimationFrame(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateX(0)';
            });
          });
          io.unobserve(e.target);
        });
      }, { threshold: 0.1 });
      io.observe(list);
    });
  }

  staggerList('.porto-project-list', 50);
  staggerList('.porto-software-list', 60);

  // =========================================
  // SPLIT-SCREEN PREVIEW (Web Dev)
  // =========================================
  const splitRows = document.querySelectorAll('.porto-project-row[data-split-preview]');
  const previewBg = document.getElementById('porto-preview-img'); // Actually a div now
  const previewTitle = document.getElementById('porto-preview-title');
  const previewDesc = document.getElementById('porto-preview-desc');
  const previewStack = document.getElementById('porto-preview-stack');
  const previewLink = document.getElementById('porto-preview-link');

  if (splitRows.length > 0 && previewBg) {
    let autoIterateInterval;
    let isInteracting = false;
    let currentIndex = 0;

    if (!document.querySelector('.porto-project-row[data-split-preview].active')) {
      splitRows[0].classList.add('active');
    } else {
      splitRows.forEach((r, i) => { if (r.classList.contains('active')) currentIndex = i; });
    }

    function updatePreview(activeRow, manual = false) {
      if (manual) {
        isInteracting = true;
        clearInterval(autoIterateInterval);
      }
      
      // If manually hovered/clicked and it's already active, do nothing
      if (activeRow.classList.contains('active') && manual) return;
      
      splitRows.forEach(r => r.classList.remove('active'));
      activeRow.classList.add('active');

      const src = activeRow.getAttribute('data-split-preview');
      const title = activeRow.getAttribute('data-title');
      const desc = activeRow.getAttribute('data-desc');
      const link = activeRow.getAttribute('data-link');
      const stack = activeRow.getAttribute('data-stack') || 'Unknown Stack';

      // Use opacity to smoothly transition the background-image swap
      previewBg.style.opacity = '0';
      
      setTimeout(() => {
        previewBg.style.backgroundImage = `url('${src}')`;
        previewTitle.textContent = title;
        previewDesc.textContent = desc;
        if (previewStack) previewStack.innerHTML = stack;
        previewLink.href = link;
        
        if (link === '#') {
          previewLink.style.display = 'none';
        } else {
          previewLink.style.display = 'inline-flex';
        }

        previewBg.style.opacity = '1';
      }, 150); // wait for fade out
    }

    splitRows.forEach((row, i) => {
      // Handle hover, focus (tabbing), and click/touch
      row.addEventListener('mouseenter', () => { currentIndex = i; updatePreview(row, true); });
      row.addEventListener('focus', () => { currentIndex = i; updatePreview(row, true); });
      row.addEventListener('click', (e) => { 
        e.preventDefault();
        currentIndex = i; 
        updatePreview(row, true); 
      });
    });

    // Auto iterate every 3 seconds until interaction
    autoIterateInterval = setInterval(() => {
      if (!isInteracting) {
        currentIndex = (currentIndex + 1) % splitRows.length;
        updatePreview(splitRows[currentIndex], false);
      }
    }, 3000);
  }

  // =========================================
  // MARQUEE — duplicate items for seamless loop
  // =========================================
  const marquee = document.querySelector('.porto-stack-marquee');
  if (marquee) {
    const clone = marquee.cloneNode(true);
    marquee.parentElement.appendChild(clone);
  }

  // =========================================
  // VIDEO PLAYER (Master-Detail)
  // =========================================
  const videoThumbs = document.querySelectorAll('.porto-video-thumb');
  const featuredIframe = document.getElementById('porto-featured-iframe');

  if (videoThumbs.length > 0 && featuredIframe) {
    videoThumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from all
        videoThumbs.forEach(t => t.classList.remove('active'));
        // Add active to clicked
        thumb.classList.add('active');
        
        // Update iframe src with autoplay
        const videoId = thumb.getAttribute('data-video-id');
        if (videoId) {
          featuredIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
      });
    });
  }

  // =========================================
  // PHOTOGRAPHY SUB-NAV & CAMERA SHUTTER
  // =========================================
  const photoSubnavBtns = document.querySelectorAll('.porto-subnav-btn');

  if (photoSubnavBtns.length > 0) {
    photoSubnavBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-photo-target');
        const targetPane = document.querySelector(targetId);
        
        if (!targetPane || targetPane.classList.contains('active')) return;

        const activePane = document.querySelector('.porto-photo-pane.active');
        const container = targetPane.parentElement; // porto-content-wrap
        container.style.position = 'relative'; // Ensure shutter is contained
        
        // UI Button Updates
        photoSubnavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Create Shutter Element if missing
        let shutter = document.getElementById('porto-camera-shutter');
        if (!shutter) {
          shutter = document.createElement('div');
          shutter.id = 'porto-camera-shutter';
          shutter.style.position = 'absolute';
          shutter.style.top = '0';
          shutter.style.left = '-20px';
          shutter.style.right = '-20px';
          shutter.style.height = '100%';
          shutter.style.backgroundColor = 'var(--p-red)';
          shutter.style.zIndex = '50';
          shutter.style.pointerEvents = 'none';
          shutter.style.transformOrigin = 'top';
          shutter.style.transform = 'scaleY(0)';
          container.appendChild(shutter);
        }

        // 1. Shutter drops DOWN
        shutter.style.transition = 'transform 0.3s cubic-bezier(0.8, 0, 0.2, 1)';
        shutter.style.transformOrigin = 'top';
        shutter.style.transform = 'scaleY(1)';

        // 2. Wait for cover, swap panes, open UP
        setTimeout(() => {
          if (activePane) {
            activePane.classList.remove('active');
            activePane.style.display = 'none';
          }
          
          targetPane.style.display = 'block';
          targetPane.classList.add('active');
          
          // Re-trigger scroll reveal for masonry images
          requestAnimationFrame(revealVisible);

          // Animate Shutter UP
          shutter.style.transformOrigin = 'bottom';
          shutter.style.transform = 'scaleY(0)';
        }, 300);
      });
    });
  }

  };
  
  // Call on initial load
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.initPortoScripts === 'function') {
      window.initPortoScripts();
    }
  });

})();
