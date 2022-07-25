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

    var qselector = document.querySelectorAll(tabHash);
    for(var i = 0; i < qselector.length; i++){
      qselector[i].classList.toggle('active');
    }
  }
});