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

// Image slider with error handling
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

function showNextImage() {
  const img = new Image();
  img.src = images[current];
  
  img.onload = () => {
    sliderImage.src = img.src;
    sliderImage.classList.remove('loaded');
    void sliderImage.offsetWidth; // Force reflow
    sliderImage.classList.add('loaded');
  };
  
  img.onerror = () => {
    console.error(`Failed to load image: ${images[current]}`);
    // Fallback to next image
    current = (current + 1) % images.length;
    showNextImage();
  };
  
  current = (current + 1) % images.length;
}

// Start slider
setInterval(showNextImage, 3000);
showNextImage(); // Initial load 