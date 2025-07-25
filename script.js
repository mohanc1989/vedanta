// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Theme switcher functionality
  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'teal';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateActiveTheme(savedTheme);
  
  // Theme toggle click
  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    themeDropdown.classList.remove('show');
  });
  
  // Theme option clicks
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateActiveTheme(theme);
      themeDropdown.classList.remove('show');
    });
  });
  
  function updateActiveTheme(theme) {
    themeOptions.forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-theme') === theme) {
        option.classList.add('active');
      }
    });
  }
  
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

  // Enhanced image slider with loading states
  const sliderImage = document.getElementById('slider-image');
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

  function showNextImage() {
    if (isLoading) return;
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
    
    current = (current + 1) % images.length;
  }

  // Start slider
  setInterval(showNextImage, 4000);
  showNextImage(); // Initial load

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



  // Add loading animation for page
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  // Add click-to-copy functionality for phone numbers
  const phoneNumbers = document.querySelectorAll('.phone-link');
  phoneNumbers.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const phoneNumber = this.textContent.trim();
      
      // Create temporary element to copy text
      const tempInput = document.createElement('input');
      tempInput.value = phoneNumber;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      // Show feedback
      const originalText = this.innerHTML;
      this.innerHTML = '✓ Copied!';
      this.style.color = '#27ae60';
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.color = '';
      }, 2000);
    });
  });

  // Add parallax effect to banner
  const banner = document.querySelector('.banner');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    banner.style.transform = `translateY(${rate}px)`;
  });

  // Add typing effect to admission banner
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