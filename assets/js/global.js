$(document).ready(function(){
  initTab();

  var grid = document.querySelector('.portofolio-wrapper');
  var msnry = new Masonry( grid, {
    itemSelector: '.gallery-item',
    percentPosition: true,
  });

  document.querySelectorAll('.gallery-item').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    const lightBox = new Lightbox(el, {
      keyboard: true,
      showArrows: true,
      wrapping: true,
      size: 'fullscreen',
    });
    lightBox.show();
    $('.ratio').css('background-color', '');
  }));

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
      nav_menu.animate({top: 0});
      nav_toggler.children().removeClass('fa-bars').addClass('fa-times');
    }
  });

  $(window).on('hashchange', function() {
    try {
        var current = document.querySelectorAll('.portofolio-wrapper');
        for(var i = 0; i < current.length; i++) {
          current[i].classList.remove('active');
        }
    } catch(err) {
        console.log(err.message);
        console.log("Continuing with next iteration...");
    }

    initTab();
  });

  function initTab() {
    var target = [];
    var tabHash = document.location.hash;
    if(tabHash === '') tabHash = '#street';

    /*
    if(tabHash === '#all') target = ['.street-photog','.cosplay-photog'];
    if(tabHash === '#street') target = ['.street-photog'];
    if(tabHash === '#cosplay') target = ['.cosplay-photog'];*/

    var qselector = document.querySelectorAll(tabHash);
    for(var i = 0; i < qselector.length; i++){
      qselector[i].classList.toggle('active');
    }
  }
});