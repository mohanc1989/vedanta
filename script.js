// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // Mobile navigation toggle
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
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

  // Enhanced Slider Functionality
  const sliderImage = document.getElementById('slider-image');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const sliderDots = document.getElementById('slider-dots');
  const sliderLoading = document.getElementById('slider-loading');
  const currentSlideSpan = document.getElementById('current-slide');
  const totalSlidesSpan = document.getElementById('total-slides');
  
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
  
  let currentSlide = 0;
  let isLoading = false;
  let autoSlideInterval;
  let isPaused = false;

  // Initialize slider
  function initSlider() {
    totalSlidesSpan.textContent = images.length;
    createDots();
    updateSlider();
    startAutoSlide();
  }

  // Create dots
  function createDots() {
    sliderDots.innerHTML = '';
    images.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      sliderDots.appendChild(dot);
    });
  }

  // Update slider display
  function updateSlider() {
    if (isLoading) return;
    isLoading = true;
    
    sliderLoading.classList.add('show');
    
    const img = new Image();
    img.src = images[currentSlide];
    
    img.onload = () => {
      sliderImage.style.opacity = '0';
      sliderImage.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        sliderImage.src = img.src;
        sliderImage.alt = `Vedanta School slide ${currentSlide + 1}`;
        sliderImage.classList.remove('loaded');
        void sliderImage.offsetWidth;
        sliderImage.classList.add('loaded');
        sliderImage.style.opacity = '1';
        sliderImage.style.transform = 'scale(1.02)';
        
        currentSlideSpan.textContent = currentSlide + 1;
        updateDots();
        sliderLoading.classList.remove('show');
        isLoading = false;
      }, 300);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${images[currentSlide]}`);
      currentSlide = (currentSlide + 1) % images.length;
      sliderLoading.classList.remove('show');
      isLoading = false;
      updateSlider();
    };
  }

  // Update dots
  function updateDots() {
    const dots = sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index === currentSlide || isLoading) return;
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
  }

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    updateSlider();
    resetAutoSlide();
  }

  // Previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    updateSlider();
    resetAutoSlide();
  }

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === ' ') {
      e.preventDefault();
      isPaused = !isPaused;
    }
  });

  // Pause on hover
  const slider = document.querySelector('.slider');
  slider.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  
  slider.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // Touch/swipe support for mobile
  let startX = 0;
  let endX = 0;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });

  // Initialize slider
  initSlider();

  // Scroll effects
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

  // Table animations
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

  // Contact links hover effects
  const contactLinks = document.querySelectorAll('.phone-link, .whatsapp-link');
  contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Page loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  // Click-to-copy phone numbers
  const phoneNumbers = document.querySelectorAll('.phone-link');
  phoneNumbers.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const phoneNumber = this.textContent.trim();
      
      const tempInput = document.createElement('input');
      tempInput.value = phoneNumber;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      const originalText = this.innerHTML;
      this.innerHTML = '✓ Copied!';
      this.style.color = '#27ae60';
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.color = '';
      }, 2000);
    });
  });


  // Typing effect
  const admissionText = document.querySelector('.admission-banner');
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
}); 