/**
 * ════════════════════════════════════════════════════════
 * IMAGE SLIDESHOW COMPONENT
 * Auto-advance every 2 seconds, user-controllable
 * ════════════════════════════════════════════════════════
 */

class ImageSlideshow {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Slideshow container with id "${containerId}" not found`);
      return;
    }

    // Configuration
    this.autoplayInterval = options.autoplayInterval || 2000; // 2 seconds
    this.transitionSpeed = options.transitionSpeed || 500; // 0.5 seconds
    this.autoplay = options.autoplay !== false; // Enable by default
    this.loop = options.loop !== false; // Loop by default

    // State
    this.currentIndex = 0;
    this.slides = [];
    this.autoplayTimer = null;
    this.isAutoplayActive = this.autoplay;

    // Initialize
    this.init();
  }

  init() {
    // Get all slides
    this.slides = Array.from(this.container.querySelectorAll('.slide'));
    
    if (this.slides.length === 0) {
      console.warn('No slides found in slideshow container');
      return;
    }

    // Initialize UI
    this.updateSlideDisplay();
    this.setupEventListeners();

    // Start autoplay if enabled
    if (this.isAutoplayActive) {
      this.startAutoplay();
    }
  }

  setupEventListeners() {
    // Previous button
    const prevBtn = this.container.querySelector('.slide-nav-btn.prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevSlide());
    }

    // Next button
    const nextBtn = this.container.querySelector('.slide-nav-btn.next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Dot indicators
    const dots = this.container.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Autoplay toggle button
    const autoplayBtn = this.container.querySelector('.autoplay-indicator');
    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
    }

    // Pause on mouse hover
    this.container.addEventListener('mouseenter', () => {
      if (this.isAutoplayActive) {
        this.pauseAutoplay();
      }
    });

    // Resume on mouse leave
    this.container.addEventListener('mouseleave', () => {
      if (this.isAutoplayActive) {
        this.resumeAutoplay();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle if slideshow is focused or visible
      if (!this.container.offsetParent) return; // Hidden element

      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }

  nextSlide() {
    this.resetAutoplayTimer();
    
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
    } else if (this.loop) {
      this.currentIndex = 0;
    }
    
    this.updateSlideDisplay();
  }

  prevSlide() {
    this.resetAutoplayTimer();
    
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.loop) {
      this.currentIndex = this.slides.length - 1;
    }
    
    this.updateSlideDisplay();
  }

  goToSlide(index) {
    this.resetAutoplayTimer();
    
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.updateSlideDisplay();
    }
  }

  updateSlideDisplay() {
    // Update slide visibility
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentIndex);
    });

    // Update dots
    const dots = this.container.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });

    // Update counter
    const counter = this.container.querySelector('.slide-counter');
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    }
  }

  startAutoplay() {
    if (this.autoplayTimer) return; // Already running

    const updateButton = () => {
      const btn = this.container.querySelector('.autoplay-indicator');
      if (btn) {
        btn.classList.add('playing');
        btn.classList.remove('paused');
      }
    };

    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoplayInterval);

    this.isAutoplayActive = true;
    updateButton();
  }

  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resumeAutoplay() {
    if (!this.autoplayTimer && this.autoplay) {
      this.startAutoplay();
    }
  }

  stopAutoplay() {
    this.pauseAutoplay();
    this.isAutoplayActive = false;

    const btn = this.container.querySelector('.autoplay-indicator');
    if (btn) {
      btn.classList.remove('playing');
      btn.classList.add('paused');
    }
  }

  toggleAutoplay() {
    if (this.isAutoplayActive) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  resetAutoplayTimer() {
    if (this.isAutoplayActive) {
      this.pauseAutoplay();
      this.startAutoplay();
    }
  }

  destroy() {
    this.pauseAutoplay();
    this.slides = [];
    this.container = null;
  }
}

// Auto-initialize all slideshows on page load
document.addEventListener('DOMContentLoaded', () => {
  // Find all slideshow containers and initialize them
  const slideshowContainers = document.querySelectorAll('[data-slideshow]');
  
  slideshowContainers.forEach((container) => {
    const containerId = container.id;
    if (containerId) {
      new ImageSlideshow(containerId);
    }
  });
});
