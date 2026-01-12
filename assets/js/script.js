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
    
    // Initialize events hero slider
    const eventsHeroSlider = document.querySelector('.events-hero-slider');
    if (eventsHeroSlider) {
      const paginationEl = eventsHeroSlider.querySelector('.events-hero-pagination');
      const swiperInstance = new Swiper(eventsHeroSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 6000, // 6 seconds
          disableOnInteraction: false,
        },
        pagination: {
          el: paginationEl,
          clickable: true,
          type: 'bullets',
          dynamicBullets: false,
        },
      });
      
      // Ensure pagination is visible
      if (paginationEl) {
        paginationEl.style.display = 'flex';
        paginationEl.style.visibility = 'visible';
        paginationEl.style.opacity = '1';
      }
    }
  }, 100); // Small delay to ensure theme script has run
})();
