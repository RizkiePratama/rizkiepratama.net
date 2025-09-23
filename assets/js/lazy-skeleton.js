document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll('img.skeleton-loader');

  images.forEach(img => {
    if (img.complete) {
      img.classList.remove('skeleton-loader');
    } else {
      img.addEventListener('load', () => {
        img.classList.remove('skeleton-loader');
      });
      img.addEventListener('error', () => {
        // Optionally handle error, e.g., replace with a broken image placeholder
        img.classList.remove('skeleton-loader'); // Still remove skeleton on error
      });
    }
  });
});
