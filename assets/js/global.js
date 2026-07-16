$(document).ready(function(){
  // Main Mobile Navigation Drawer Toggle
  function toggleNavDrawer() {
    var nav_menu = $('.navbar-collapse');
    var nav_toggler = $('.navbar-toggler');
    if (nav_menu.hasClass('open')) {
      nav_menu.removeClass('open');
      nav_toggler.children().removeClass('fa-times').addClass('fa-bars');
    } else {
      nav_menu.addClass('open');
      nav_toggler.children().removeClass('fa-bars').addClass('fa-times');
    }
  }

  // Bind toggler click (delegated so Swup transitions don't break listeners)
  $(document).on('click', '.navbar-toggler', function(e) {
    e.preventDefault();
    toggleNavDrawer();
  });
  
  // Bind close button click (delegated so Swup transitions don't break listeners)
  $(document).on('click', '.navbar-drawer-close', function(e) {
    e.preventDefault();
    toggleNavDrawer();
  });

  // Automatically close navigation drawer when clicking links (vital for Swup page swaps)
  $(document).on('click', '.navbar-nav .nav-link', function() {
    var nav_menu = $('.navbar-collapse');
    if (nav_menu.hasClass('open')) {
      toggleNavDrawer();
    }
  });



  // Adaptive Navbar Text Color
  
  window.syncBodyPage = function() {
    // No-op: body page sync no longer needed (carousel removed)
  };
  window.syncBodyPage();

  window.initBlogScripts = function() {
    // No-op: scroll jacking removed (carousel replaced with grid)
  };

  window.checkAndInvertNavLinks = function() {
    const heroPostHeader = $('.hero-post-header');
    const navLinks = $('.nav-link');
    const navBars = $('.navbar-toggler');
    const brandName = $('.navbar-brand');

    if (!heroPostHeader.length) {
      // Reset inversion on non-post pages
      navLinks.removeClass('invert');
      navBars.removeClass('invert');
      brandName.removeClass('invert');
      return;
    }

    const bgImg = heroPostHeader.css('background-image');
    if (!bgImg || bgImg === 'none') {
      navLinks.removeClass('invert');
      navBars.removeClass('invert');
      brandName.removeClass('invert');
      return;
    }

    const bgUrlMatch = bgImg.match(/url\(["']?(.*?)["']?\)/);
    if (!bgUrlMatch) {
      navLinks.removeClass('invert');
      navBars.removeClass('invert');
      brandName.removeClass('invert');
      return;
    }
    const imgUrl = bgUrlMatch[1];

    const img = new Image();
    if (imgUrl.indexOf('http') === 0) {
      img.crossOrigin = "Anonymous";
    }
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Crop and analyze only the top 15% of the image (exactly where the navbar overlays)
          const sampleHeight = Math.max(1, img.height * 0.15);
          ctx.drawImage(img, 0, 0, img.width, sampleHeight, 0, 0, 1, 1);
          
          const data = ctx.getImageData(0, 0, 1, 1).data;
          const r = data[0];
          const g = data[1];
          const b = data[2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          
          if (luminance >= 170) { // Slightly stricter threshold for light text inversion
            navLinks.addClass('invert');
            navBars.addClass('invert');
            brandName.addClass('invert');
          } else {
            navLinks.removeClass('invert');
            navBars.removeClass('invert');
            brandName.removeClass('invert');
          }
        }
      } catch (e) {
        console.warn("Failed to check background luminance via canvas (CORS/Secure context):", e);
        navLinks.removeClass('invert');
        navBars.removeClass('invert');
        brandName.removeClass('invert');
      }
    };
    img.onerror = function() {
      navLinks.removeClass('invert');
      navBars.removeClass('invert');
      brandName.removeClass('invert');
    };
    img.src = imgUrl;
  }

  window.checkAndInvertNavLinks();

  // Scroll Progress Bar for blog posts
  window.initReadProgressBar = function() {
    const progressBar = document.getElementById('read-progress-bar');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
      } else {
        progressBar.style.width = '0%';
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Run once initially
  };
  window.initReadProgressBar();

  // Scroll Reveal Animation
  window.revealElements = function() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const revealTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 150; // Adjust this value to control when the animation triggers

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add('active');
      } else {
        reveals[i].classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', revealElements);
  revealElements(); // Call on load to reveal elements already in view

  // Back to Top Button functionality
  const backToTopButton = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Only show if page height is greater than viewport height (i.e., scrollable)
    if (document.body.scrollHeight > window.innerHeight && window.scrollY > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// SPA Initialization
if (typeof Swup !== 'undefined') {
  try {
    const plugins = [];
    if (typeof SwupHeadPlugin !== 'undefined') {
      plugins.push(new SwupHeadPlugin());
    } else {
      console.warn('SwupHeadPlugin is not defined, running without it.');
    }

    const swup = new Swup({ 
      plugins: plugins,
      containers: ["#swup", "#navbar"]
    });
    console.log('Swup initialized successfully!');

    swup.hooks.on('page:view', () => {
      console.log('Swup page:view triggered');
      // CRITICAL: sync body data-page FIRST before anything else
      // (Swup doesn't replace <body> so CSS body#blog rules don't fire on SPA nav)
      if (typeof window.syncBodyPage === 'function') window.syncBodyPage();
      if (typeof window.revealElements === 'function') window.revealElements();
      if (typeof window.checkAndInvertNavLinks === 'function') window.checkAndInvertNavLinks();
      if (typeof window.initReadProgressBar === 'function') window.initReadProgressBar();
      if (typeof window.initPortoScripts === 'function') window.initPortoScripts();
      if (typeof window.initAboutScripts === 'function') window.initAboutScripts();
      if (typeof window.initLandingScripts === 'function') window.initLandingScripts();
      if (typeof window.initBlogScripts === 'function') window.initBlogScripts();
    });
  } catch (error) {
    console.error('Failed to initialize Swup:', error);
  }
} else {
  console.error('Swup is not defined. Script failed to load.');
}
