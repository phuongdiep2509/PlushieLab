# Image Slideshow Component Guide

## Overview

A fully-featured, responsive image slideshow component with auto-advance (2 seconds), manual controls, and accessibility support.

## 🎯 Features

- **Auto-Advance**: Slides automatically change every 2 seconds
- **User Controls**: 
  - Click ‹ › buttons to navigate
  - Click dot indicators to jump to any slide
  - Use keyboard arrows (← →) to navigate
  - Click "Auto" badge to toggle auto-play
- **Smart Pausing**: Auto-play pauses on hover, resumes on mouse leave
- **Smooth Transitions**: 0.5s fade effect between slides
- **Responsive**: Mobile, tablet, and desktop optimized
- **Accessibility**: Full keyboard navigation, ARIA labels, semantic HTML
- **Loop Support**: Seamlessly loops back to start after last slide

## 📁 Files Created

```
static/
├── css/
│   └── slideshow.css          # All styling and animations
├── js/
│   └── slideshow.js           # Main JavaScript logic

templates/
├── components/
│   └── slideshow.html         # Reusable component template
├── slideshow_example.html     # Demo page with examples
└── base.html                  # Updated with slideshow resources
```

## 🚀 Quick Start

### Method 1: Using Dynamic Images (Recommended)

In your Flask template or Python backend, pass a list of image objects:

```python
# app.py or view
images = [
    {'src': '/static/image/pic1.jpg', 'alt': 'Slide 1'},
    {'src': '/static/image/pic2.jpg', 'alt': 'Slide 2'},
    {'src': '/static/image/pic3.jpg', 'alt': 'Slide 3'},
]
return render_template('your_page.html', images=images)
```

In your template:

```html
{% extends "base.html" %}

{% block content %}
  <div style="max-width: 800px; margin: 0 auto;">
    {% include "components/slideshow.html" with 
       slideshow_id="my-slideshow",
       images=images
    %}
  </div>
{% endblock %}
```

### Method 2: Hardcoded Slides

```html
{% extends "base.html" %}

{% block content %}
  <div 
    class="slideshow-container" 
    id="my-slideshow"
    data-slideshow
  >
    <div class="slideshow-wrapper">
      <div class="slideshow-slides">
        
        <div class="slide active">
          <img src="/path/to/image1.jpg" alt="Slide 1" />
        </div>
        
        <div class="slide">
          <img src="/path/to/image2.jpg" alt="Slide 2" />
        </div>
        
        <div class="slide">
          <img src="/path/to/image3.jpg" alt="Slide 3" />
        </div>
        
      </div>
    </div>

    <!-- Auto-play Indicator -->
    <div class="autoplay-indicator playing">
      <span>Auto</span>
    </div>

    <!-- Controls -->
    <div class="slideshow-controls">
      <button type="button" class="slide-nav-btn prev"></button>
      
      <ul class="slide-indicators">
        <li class="dot active"></li>
        <li class="dot"></li>
        <li class="dot"></li>
      </ul>
      
      <button type="button" class="slide-nav-btn next"></button>
      <div class="slide-counter"></div>
    </div>
  </div>
{% endblock %}
```

### Method 3: Programmatic Control

```javascript
// Initialize a slideshow
const slideshow = new ImageSlideshow('slideshow-id', {
  autoplayInterval: 2000,  // 2 seconds
  transitionSpeed: 500,    // 0.5 seconds
  autoplay: true,          // Start auto-playing
  loop: true               // Loop back to start
});

// Control methods
slideshow.nextSlide();           // Go to next slide
slideshow.prevSlide();           // Go to previous slide
slideshow.goToSlide(2);          // Jump to slide index 2
slideshow.startAutoplay();       // Start auto-play
slideshow.pauseAutoplay();       // Pause auto-play
slideshow.toggleAutoplay();      // Toggle auto-play on/off
slideshow.destroy();             // Clean up
```

## 🎨 Customization

### Change Auto-Play Interval

**In Python:**
```python
# Pass to template context
slideshow_interval = 3000  # 3 seconds
```

**In JavaScript:**
```javascript
const slideshow = new ImageSlideshow('my-slideshow', {
  autoplayInterval: 3000  // 3 seconds instead of 2
});
```

### Adjust Transition Speed

```javascript
const slideshow = new ImageSlideshow('my-slideshow', {
  transitionSpeed: 800  // 0.8 second fade
});
```

### Disable Auto-Play

```javascript
const slideshow = new ImageSlideshow('my-slideshow', {
  autoplay: false  // Start paused
});
```

### Custom Styling

Edit `static/css/slideshow.css`:

```css
/* Change button style */
.slide-nav-btn {
  background: rgba(255, 255, 255, 0.9);  /* Modify color */
  width: 44px;  /* Adjust size */
}

/* Change dot indicator color */
.dot.active {
  background: #fff;  /* Active dot color */
}

/* Change slide container size */
.slideshow-container {
  max-width: 600px;  /* Set width limit */
  border-radius: 8px;  /* Adjust corner radius */
}
```

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` (Left Arrow) | Previous slide |
| `→` (Right Arrow) | Next slide |

## 🖱️ Mouse Interactions

- **Click Arrows**: Navigate between slides
- **Click Dots**: Jump to any slide
- **Click "Auto" Badge**: Toggle auto-play on/off
- **Hover**: Pause auto-play temporarily
- **Leave**: Resume auto-play

## 📱 Responsive Behavior

The slideshow automatically adapts to screen size:

- **Desktop (>768px)**: Full controls with counter display
- **Tablet (481-768px)**: Compact controls, hidden counter
- **Mobile (<480px)**: Minimal UI, stacked controls

## ♿ Accessibility

- Full keyboard navigation (arrow keys)
- ARIA labels on all interactive elements
- Semantic HTML structure
- Live regions for screen readers
- High contrast controls
- Focus indicators on buttons

## 🔧 Integration Examples

### In News/Blog Page

```html
{% extends "base.html" %}

{% block content %}
  <article class="post">
    <h1>{{ post.title }}</h1>
    
    {% include "components/slideshow.html" with 
       slideshow_id="post-gallery",
       images=post.images
    %}
    
    <div class="post-content">
      {{ post.content }}
    </div>
  </article>
{% endblock %}
```

### In Product Page

```html
{% extends "base.html" %}

{% block content %}
  <div class="product-gallery">
    {% include "components/slideshow.html" with 
       slideshow_id="product-images",
       images=product.product_images
    %}
  </div>
  
  <div class="product-details">
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
  </div>
{% endblock %}
```

### In Portfolio Page

```html
{% extends "base.html" %}

{% block content %}
  <section class="portfolio-section">
    <h2>My Work</h2>
    
    {% for project in projects %}
      <div class="portfolio-item">
        <h3>{{ project.title }}</h3>
        {% include "components/slideshow.html" with 
           slideshow_id="project-" ~ project.id,
           images=project.screenshots
        %}
      </div>
    {% endfor %}
  </section>
{% endblock %}
```

## 🐛 Troubleshooting

### Slideshow not showing images

1. Check that `data-slideshow` attribute is on the container
2. Verify `.slide` elements exist inside `.slideshow-slides`
3. Check image paths are correct (use absolute paths like `/static/...`)
4. Open browser console for JavaScript errors

### Auto-play not working

1. Check that `slideshow.js` is loaded before the slideshow is initialized
2. Verify `autoplay: true` is set in options
3. Check that no JavaScript errors are preventing initialization

### Styling issues

1. Ensure `slideshow.css` is linked in `base.html`
2. Check CSS specificity if custom styles aren't applied
3. Clear browser cache and do hard refresh (Ctrl+Shift+R)

## 📚 File Reference

### slideshow.css
- Container styling
- Slide display and transitions
- Control button styling
- Dot indicators
- Responsive breakpoints
- Animation definitions

### slideshow.js
- `ImageSlideshow` class - main component
- Auto-initialization on page load
- Event handlers (click, keyboard, hover)
- State management
- Methods: `nextSlide()`, `prevSlide()`, `goToSlide()`, etc.

### slideshow.html (Component Template)
- Flexible template with dynamic and hardcoded options
- Uses Jinja2 templating
- Auto-loads JavaScript if needed
- Semantic HTML with ARIA labels

## 💡 Tips

1. **Always use `max-width`** on the container for large screens
2. **Set aspect ratio** via `padding-bottom` in `.slideshow-wrapper` for consistent sizing
3. **Preload images** in Python if using many high-res images
4. **Use lazy loading** on `<img>` tags for performance
5. **Test on mobile** - use dev tools device emulation
6. **Check accessibility** - use keyboard navigation and screen reader

## 🎓 Example: Photo Gallery

```html
{% extends "base.html" %}

{% block content %}
  <div class="gallery-page" style="max-width: 1000px; margin: 0 auto; padding: 40px 20px;">
    <h1 style="text-align: center; font-family: 'Playfair Display'; margin-bottom: 40px;">
      Photo Gallery
    </h1>
    
    {% include "components/slideshow.html" with 
       slideshow_id="photo-gallery",
       images=gallery_images
    %}
    
    <div style="margin-top: 40px; text-align: center;">
      <p>{{ gallery_description }}</p>
      <a href="/upload" class="btn-primary">Upload More Photos</a>
    </div>
  </div>
{% endblock %}
```

---

**Happy sliding! 🎬✨**
