$(document).ready(function(){
  $('.navbar-toggler').click(function() {
    var nav_menu = $('.navbar-collapse');
    var nav_toggler = $('.navbar-toggler');
    if ( nav_menu.hasClass('show') ) {
      nav_menu.animate(
        {top: "-250px"},
        {
          duration: 1000,
          complete: function() {
            nav_menu.removeClass('show');
            nav_toggler.children().removeClass('fa-times').addClass('fa-bars');
          }
        }
      );
    } else {
      nav_menu.addClass('show');
      nav_menu.addClass('active'); // Add active class for slide-in
      nav_menu.animate({top: 0});
      nav_toggler.children().removeClass('fa-bars').addClass('fa-times');
    }
  });

  // Randomnize Background Images
  var html_parent = $('html');
  var min = 1; var max = 4;
  var rand = Math.floor(Math.random() * (max - min + 1)) + min;
  html_parent.css("background", "url('/assets/images/bg/" + rand + ".jpg') no-repeat center center fixed");

  // Adaptive Navbar Text Color
  const heroPostHeader = $('.hero-post-header');
  function isDarkColor(color) {
    const rgb = color.match(/\d+/g);
    const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    return luminance < 128;
  }

  function checkAndInvertNavLinks() {
    const navLinks = $('.nav-link');
    const navBars = $('.navbar-toggler .fa-bars');
    const bgColor = heroPostHeader.css('background-color');

    if (bgColor !== undefined && isDarkColor(bgColor)) {
      navLinks.addClass('invert');
      navBars.addClass('invert');
    } else {
      navLinks.removeClass('invert');
      navBars.removeClass('invert');
    }
  }

  checkAndInvertNavLinks();

  // Scroll Reveal Animation
  function revealElements() {
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
