document.addEventListener("DOMContentLoaded", function() {

    // --- Mobile Navigation ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));
    
    // --- Header Scroll Behavior ---
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            // Scroll Down
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            // Scroll Up
            header.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    });


    // --- Animate on Scroll ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        scrollObserver.observe(element);
    });

    // --- Image Lazy Loading ---
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Since images already have src, just remove lazy class and show them
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => lazyLoadObserver.observe(img));

    // --- Carousel Functionality ---
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const carouselInner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;
        let interval;

        function createDots() {
            items.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        }
        
        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            currentIndex = index;
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function startInterval() {
           interval = setInterval(() => goToSlide(currentIndex + 1), 5000);
        }
        
        function resetInterval() {
            clearInterval(interval);
            startInterval();
        }
        
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetInterval();
        });

        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetInterval();
        });

        carousel.addEventListener('mouseenter', () => clearInterval(interval));
        carousel.addEventListener('mouseleave', () => startInterval());

        createDots();
        startInterval();
    });

    // --- Modal Functionality ---
    const readMoreLinks = document.querySelectorAll('.read-more');
    const modalBackdrop = document.getElementById('modal-backdrop');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Find the parent card of the clicked link
            const card = link.closest('.blog-card');
            if (!card) return;

            // Get the title and the full caption text from the card
            const title = card.querySelector('.card-title').textContent;
            const fullCaption = card.querySelector('.card-caption').textContent;

            // Get the target modal specified in the link's data-modal-target attribute
            const modalId = link.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            // Find the elements inside the modal to update
            const modalTitle = modal.querySelector('h2');
            const modalBody = modal.querySelector('p');
            
            // Populate the modal with the content from the card
            if (modalTitle) {
                modalTitle.textContent = title;
            }
            if (modalBody) {
                modalBody.textContent = fullCaption;
            }

            openModal(modal);
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
        modalBackdrop.classList.add('active');
        
        // Use .onclick to safely attach a single event listener for closing
        modal.querySelector('.close-button').onclick = () => closeModal(modal);
        modalBackdrop.onclick = () => closeModal(modal);
    }

    function closeModal(modal) {
         if (modal == null) return;
         modal.classList.remove('active');
         modalBackdrop.classList.remove('active');
    }

    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // --- Theme Swapper ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = document.getElementById('theme-icon');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';


    themeSwitcher.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Add a small rotation animation
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // --- Particle.js Background ---
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
            },
            "opacity": {
                "value": 0.5,
                "random": false,
            },
            "size": {
                "value": 3,
                "random": true,
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });
});