// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initializeTheme();
  
  // Loading spinner management
  const loadingSpinner = document.getElementById('loading-spinner');
  
  // Hide loading spinner after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingSpinner.classList.add('hidden');
      setTimeout(() => {
        loadingSpinner.style.display = 'none';
      }, 500);
    }, 1000);
  });

  // Mobile navigation toggle
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    // Update aria-expanded attribute for accessibility
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Close mobile nav when clicking on links
  document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll to top functionality
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle button aria-label
    darkModeToggle.setAttribute('aria-label', 
      newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  });

  // Add scroll effects to sections
  const sections = document.querySelectorAll('.section');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });

  // Add loading animation to tables
  const tables = document.querySelectorAll('.info-table');
  tables.forEach((table, index) => {
    table.style.opacity = '0';
    table.style.transform = 'translateY(20px)';
    table.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      table.style.opacity = '1';
      table.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });

  // Enhanced image slider with controls and indicators
  const sliderImage = document.getElementById('slider-image');
  const sliderControls = document.querySelector('.slider-controls');
  const sliderIndicators = document.querySelector('.slider-indicators');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  
  const images = [
    'sliders/slide1.jpeg',
    'sliders/slide2.jpeg',
    'sliders/slide3.jpeg',
    'sliders/slide4.jpeg',
    'sliders/slide5.jpeg',
    'sliders/slide6.jpeg',
    'sliders/slide7.jpeg',
    'sliders/slide8.jpeg',
    'sliders/slide9.jpeg'
  ];
  
  let current = 0;
  let isLoading = false;
  let autoPlayInterval;

  // Create indicators
  images.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
    indicator.addEventListener('click', () => goToSlide(index));
    sliderIndicators.appendChild(indicator);
  });

  function updateIndicators() {
    const indicators = sliderIndicators.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === current);
    });
  }

  function goToSlide(index) {
    if (isLoading || index === current) return;
    current = index;
    showImage();
    updateIndicators();
  }

  function showNextImage() {
    if (isLoading) return;
    current = (current + 1) % images.length;
    showImage();
    updateIndicators();
  }

  function showPrevImage() {
    if (isLoading) return;
    current = (current - 1 + images.length) % images.length;
    showImage();
    updateIndicators();
  }

  function showImage() {
    isLoading = true;

    const img = new Image();
    img.src = images[current];
    
    img.onload = () => {
      sliderImage.style.opacity = '0';
      sliderImage.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        sliderImage.src = img.src;
        sliderImage.classList.remove('loaded');
        void sliderImage.offsetWidth; // Force reflow
        sliderImage.classList.add('loaded');
        sliderImage.style.opacity = '1';
        sliderImage.style.transform = 'scale(1.02)';
        isLoading = false;
      }, 300);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${images[current]}`);
      // Fallback to next image
      current = (current + 1) % images.length;
      isLoading = false;
      showNextImage();
    };
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(showNextImage, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Event listeners for slider controls
  prevBtn.addEventListener('click', () => {
    showPrevImage();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    showNextImage();
    resetAutoPlay();
  });

  // Pause autoplay on hover
  const slider = document.querySelector('.slider');
  slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  slider.addEventListener('mouseleave', startAutoPlay);

  // Keyboard navigation for slider
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showPrevImage();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
      resetAutoPlay();
    }
  });

  // Start slider
  showImage();
  updateIndicators();
  startAutoPlay();

  // Add hover effects to contact links
  const contactLinks = document.querySelectorAll('.phone-link, .whatsapp-link');
  contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add click-to-copy functionality for phone numbers
  const phoneNumbers = document.querySelectorAll('.phone-link');
  phoneNumbers.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const phoneNumber = this.textContent.trim();
      
      // Use modern clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(phoneNumber).then(() => {
          showCopyFeedback(this, '✓ Copied!');
        }).catch(() => {
          fallbackCopyTextToClipboard(phoneNumber, this);
        });
      } else {
        fallbackCopyTextToClipboard(phoneNumber, this);
      }
    });
  });

  function fallbackCopyTextToClipboard(text, element) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopyFeedback(element, '✓ Copied!');
  }

  function showCopyFeedback(element, message) {
    const originalText = element.innerHTML;
    element.innerHTML = message;
    element.style.color = '#27ae60';
    
    setTimeout(() => {
      element.innerHTML = originalText;
      element.style.color = '';
    }, 2000);
  }

  // Add parallax effect to banner
  const banner = document.querySelector('.banner');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    banner.style.transform = `translateY(${rate}px)`;
  });

  // Add typing effect to admission banner
  const admissionText = document.querySelector('.admission-text');
  if (admissionText) {
    const text = admissionText.textContent;
    admissionText.textContent = '';
    admissionText.style.borderRight = '2px solid #e74c3c';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        admissionText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        admissionText.style.borderRight = 'none';
      }
    };
    
    setTimeout(typeWriter, 1000);
  }

  // Add intersection observer for performance
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));

  // Add error handling for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      console.error(`Failed to load image: ${this.src}`);
    });
  });

  // Add focus management for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Add service worker registration for PWA capabilities
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});

// Theme initialization function
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update toggle button aria-label
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
  .keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(style); 