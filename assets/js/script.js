// Custom script for service slider autoplay
// This runs after the main script.js from theme
(function() {
  "use strict";
  
  // Wait a bit for theme's Swiper initialization, then update with autoplay
  setTimeout(function() {
    const sliders = document.querySelectorAll('.testimonial-slider');
    
    sliders.forEach(function(slider) {
      // Check if swiper is already initialized
      if (slider.swiper) {
        // Destroy existing instance
        slider.swiper.destroy(true, true);
      }
      
      // Get pagination element
      const pagination = slider.parentElement.querySelector('.testimonial-slider-pagination');
      
      // Reinitialize with autoplay
      new Swiper(slider, {
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 10000, // 10 seconds (10000 milliseconds)
          disableOnInteraction: false, // Continue autoplay after clicking pagination dots
        },
        pagination: {
          el: pagination || slider.querySelector('.testimonial-slider-pagination'),
          type: "bullets",
          clickable: true,
        },
      });
    });
  }, 100); // Small delay to ensure theme script has run
})();
