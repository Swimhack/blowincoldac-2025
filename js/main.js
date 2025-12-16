// Main JavaScript - Blowin' Cold AC - Modern Enhanced Version

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        heroVideo: document.querySelector('.hero-video'),
        heroVideoControl: document.querySelector('.hero-video-control'),
        testimonialCards: document.querySelectorAll('.testimonial-card'),
        testimonialPrev: document.querySelector('.testimonial-prev'),
        testimonialNext: document.querySelector('.testimonial-next'),
        testimonialDots: document.querySelectorAll('.dot'),
        header: document.querySelector('.main-header'),
        dropdownMenus: document.querySelectorAll('.has-dropdown'),
        phoneLinks: document.querySelectorAll('a[href^="tel:"]'),
        smoothScrollLinks: document.querySelectorAll('a[href^="#"]'),
        serviceCards: document.querySelectorAll('.service-card'),
        featureItems: document.querySelectorAll('.feature-item'),
        contactForm: document.querySelector('#contact-form'),
        loadingOverlay: document.querySelector('.loading-overlay')
    };

    // State
    let currentTestimonial = 0;
    let isVideoPlaying = true;
    let lastScrollTop = 0;

    // Initialize
    function init() {
        setupMobileMenu();
        setupVideoControls();
        setupTestimonials();
        setupSmoothScroll();
        setupHeaderScroll();
        setupDropdownMenus();
        setupPhoneTracking();
        setupIntersectionObserver();
        setupServiceCardHover();
        setupFormValidation();
        setupLazyLoading();
        setupPerformanceOptimizations();
        checkReducedMotion();
    }

    // Enhanced Mobile Menu Toggle with Animations
    function setupMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.navMenu) return;

        // Remove any existing mobile-menu-extra or mobile-menu-cta elements
        // (Header buttons are now always visible in header-top bar)
        try {
            const existingExtra = elements.navMenu.querySelector('.mobile-menu-extra');
            if (existingExtra) {
                existingExtra.remove();
            }
            const existingCta = elements.navMenu.querySelector('.mobile-menu-cta');
            if (existingCta) {
                existingCta.remove();
            }
        } catch (e) {
            console.warn('Unable to clean mobile menu:', e);
        }

        // Debounce function for performance
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        elements.mobileMenuToggle.addEventListener('click', function() {
            const isActive = elements.navMenu.classList.contains('active');
            
            // Toggle menu visibility
            elements.navMenu.classList.toggle('active');
            elements.mobileMenuToggle.classList.toggle('active');
            
            // Set ARIA attributes for accessibility
            elements.mobileMenuToggle.setAttribute('aria-expanded', !isActive);
            
            // Update screen reader text
            const srText = elements.mobileMenuToggle.querySelector('.sr-only');
            if (srText) {
                srText.textContent = isActive ? 'Menu' : 'Close Menu';
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? '' : 'hidden';
            
            // Focus management for accessibility
            if (!isActive) {
                // Menu is opening - focus first menu item after animation
                setTimeout(() => {
                    const firstMenuItem = elements.navMenu.querySelector('a');
                    if (firstMenuItem) firstMenuItem.focus();
                }, 100);
            } else {
                // Menu is closing - return focus to toggle button
                elements.mobileMenuToggle.focus();
            }
            
            // Add slide animation with better performance
            if (!isActive) {
                elements.navMenu.style.transform = 'translateX(0)';
                elements.navMenu.style.opacity = '1';
            } else {
                elements.navMenu.style.transform = 'translateX(-100%)';
                elements.navMenu.style.opacity = '0';
            }
        });

        // Helper function to close mobile menu
        function closeMobileMenu() {
            elements.navMenu.classList.remove('active');
            elements.mobileMenuToggle.classList.remove('active');
            elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            
            const srText = elements.mobileMenuToggle.querySelector('.sr-only');
            if (srText) {
                srText.textContent = 'Menu';
            }
            
            // Return focus to toggle button
            elements.mobileMenuToggle.focus();
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!elements.mobileMenuToggle.contains(e.target) && 
                !elements.navMenu.contains(e.target) && 
                elements.navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on a navigation link
        elements.navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && !e.target.getAttribute('aria-haspopup')) {
                closeMobileMenu();
            }
        });
        
        // Handle touch events for better mobile experience
        let touchStartX = null;
        let touchStartY = null;
        
        elements.navMenu.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        elements.navMenu.addEventListener('touchend', function(e) {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe left to close menu
            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -50) {
                closeMobileMenu();
            }
            
            touchStartX = null;
            touchStartY = null;
        }, { passive: true });
    }

    // Video Controls
    function setupVideoControls() {
        if (!elements.heroVideo || !elements.heroVideoControl) return;

        const pauseIcon = elements.heroVideoControl.querySelector('.icon-pause');
        const playIcon = elements.heroVideoControl.querySelector('.icon-play');

        elements.heroVideoControl.addEventListener('click', function() {
            if (isVideoPlaying) {
                elements.heroVideo.pause();
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
            } else {
                elements.heroVideo.play();
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
            }
            isVideoPlaying = !isVideoPlaying;
        });

        // Handle video errors
        elements.heroVideo.addEventListener('error', function() {
            console.error('Video failed to load, falling back to poster image');
            elements.heroVideoControl.style.display = 'none';
        });
    }

    // Testimonials Slider
    function setupTestimonials() {
        if (!elements.testimonialCards.length) return;

        function showTestimonial(index) {
            elements.testimonialCards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            
            elements.testimonialDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentTestimonial = index;
        }

        // Previous button
        if (elements.testimonialPrev) {
            elements.testimonialPrev.addEventListener('click', function() {
                currentTestimonial = currentTestimonial === 0 
                    ? elements.testimonialCards.length - 1 
                    : currentTestimonial - 1;
                showTestimonial(currentTestimonial);
            });
        }

        // Next button
        if (elements.testimonialNext) {
            elements.testimonialNext.addEventListener('click', function() {
                currentTestimonial = (currentTestimonial + 1) % elements.testimonialCards.length;
                showTestimonial(currentTestimonial);
            });
        }

        // Dot navigation
        elements.testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showTestimonial(index);
            });
        });

        // Auto-rotate testimonials
        setInterval(function() {
            if (!document.hidden && !document.querySelector('.testimonials-section:hover')) {
                currentTestimonial = (currentTestimonial + 1) % elements.testimonialCards.length;
                showTestimonial(currentTestimonial);
            }
        }, 5000);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            const testimonialSection = document.querySelector('.testimonials-section');
            if (!testimonialSection || !isInViewport(testimonialSection)) return;

            if (e.key === 'ArrowLeft' && elements.testimonialPrev) {
                elements.testimonialPrev.click();
            } else if (e.key === 'ArrowRight' && elements.testimonialNext) {
                elements.testimonialNext.click();
            }
        });
    }

    // Smooth Scroll
    function setupSmoothScroll() {
        elements.smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if not a hash link
                if (!href || href === '#' || href.indexOf('#') !== 0) return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                // Close mobile menu if open
                if (elements.navMenu && elements.navMenu.classList.contains('active')) {
                    elements.navMenu.classList.remove('active');
                    elements.mobileMenuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Calculate offset for fixed header
                const headerHeight = elements.header ? elements.header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Header Scroll Behavior
    function setupHeaderScroll() {
        if (!elements.header) return;

        let ticking = false;

        function updateHeader() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow and hide contact bar on scroll
            if (scrollTop > 50) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll (mobile only)
            if (window.innerWidth <= 767) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    elements.header.style.transform = 'translateY(-100%)';
                } else {
                    elements.header.style.transform = 'translateY(0)';
                }
            } else {
                elements.header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // Dropdown Menus (Desktop)
    function setupDropdownMenus() {
        elements.dropdownMenus.forEach(dropdown => {
            let timeout;
            
            dropdown.addEventListener('mouseenter', function() {
                clearTimeout(timeout);
                this.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                timeout = setTimeout(() => {
                    this.classList.remove('active');
                }, 200);
            });
        });
    }

    // Phone Link Tracking
    function setupPhoneTracking() {
        elements.phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Track phone clicks (analytics would go here)
                console.log('Phone link clicked:', this.href);
                
                // You could send this to Google Analytics or another tracking service
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call',
                        'value': this.href
                    });
                }
            });
        });
    }

    // Intersection Observer for Animations
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe service cards
        elements.serviceCards.forEach(card => {
            observer.observe(card);
        });

        // Observe feature items
        elements.featureItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Service Card Hover Effects
    function setupServiceCardHover() {
        elements.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // Check for Reduced Motion Preference
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Disable auto-play video
            if (elements.heroVideo) {
                elements.heroVideo.pause();
                elements.heroVideo.removeAttribute('autoplay');
                isVideoPlaying = false;
            }
            
            // Remove animations
            document.documentElement.classList.add('reduced-motion');
        }
    }

    // Utility Functions
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Form Validation (placeholder for contact form)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('error');
                    isValid = false;
                }
            }
            
            // Phone validation
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\d\s\-\(\)\+]+$/;
                if (!phoneRegex.test(input.value)) {
                    input.classList.add('error');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    // Performance monitoring
    function monitorPerformance() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP monitoring not supported');
            }
        }
    }

    // Update copyright year
    function updateCopyrightYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            updateCopyrightYear();
        });
    } else {
        init();
        updateCopyrightYear();
    }

    // Monitor performance
    // Enhanced Form Validation with Real-time Feedback
    function setupFormValidation() {
        if (!elements.contactForm) return;
        
        const inputs = elements.contactForm.querySelectorAll('input, textarea, select');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
        
        // Form submission
        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success-message';
                successMsg.textContent = 'Thank you! We\'ll contact you within 24 hours.';
                this.appendChild(successMsg);
                
                // Reset form after delay
                setTimeout(() => {
                    this.reset();
                    successMsg.remove();
                }, 3000);
            }
        });
    }
    
    // Validate individual input
    function validateInput(input) {
        let isValid = true;
        const errorMsg = input.parentElement.querySelector('.error-message') || createErrorMessage(input);
        
        // Required field validation
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, errorMsg, 'This field is required');
            return false;
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, errorMsg, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                showError(input, errorMsg, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Clear error if valid
        clearError(input, errorMsg);
        return true;
    }
    
    function createErrorMessage(input) {
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        input.parentElement.appendChild(errorMsg);
        return errorMsg;
    }
    
    function showError(input, errorMsg, message) {
        input.classList.add('error');
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
    
    function clearError(input, errorMsg) {
        input.classList.remove('error');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
    }
    
    // Lazy Loading for Images and Videos
    function setupLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        if (element.tagName === 'IMG') {
                            element.src = element.dataset.lazy;
                        } else if (element.tagName === 'VIDEO') {
                            element.src = element.dataset.lazy;
                            element.load();
                        }
                        
                        element.removeAttribute('data-lazy');
                        lazyObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            lazyElements.forEach(element => lazyObserver.observe(element));
        } else {
            // Fallback for older browsers
            lazyElements.forEach(element => {
                if (element.tagName === 'IMG') {
                    element.src = element.dataset.lazy;
                } else if (element.tagName === 'VIDEO') {
                    element.src = element.dataset.lazy;
                }
            });
        }
    }
    
    // Performance Optimizations
    function setupPerformanceOptimizations() {
        // Optimize scroll events
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(() => {
                // Pause video when not in viewport
                if (elements.heroVideo && !isInViewport(elements.heroVideo)) {
                    if (isVideoPlaying) {
                        elements.heroVideo.pause();
                    }
                } else if (elements.heroVideo && isInViewport(elements.heroVideo)) {
                    if (isVideoPlaying && elements.heroVideo.paused) {
                        elements.heroVideo.play();
                    }
                }
            }, 150);
        });
        
        // Preload critical resources
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = '/images/hero-bg.webp';
        document.head.appendChild(preloadLink);
        
        // Enable smooth scrolling with CSS
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    monitorPerformance();

    // Snowflake Effect Implementation
    function createSnowflakeEffect() {
        const snowflakeConfig = {
            show: 1,
            flakes_num: 25,
            falling_speed_min: 1,
            falling_speed_max: 3,
            flake_max_size: 20,
            flake_min_size: 10,
            vertical_size: 800,
            flake_color: '#efefef',
            flake_zindex: 100000,
            flake_type: '❄',
            fade_away: 1
        };

        if (!snowflakeConfig.show) return;

        const snowflakes = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = snowflakeConfig.flake_zindex;
        
        document.body.appendChild(canvas);
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function createSnowflake() {
            return {
                x: Math.random() * canvas.width,
                y: -10,
                size: Math.random() * (snowflakeConfig.flake_max_size - snowflakeConfig.flake_min_size) + snowflakeConfig.flake_min_size,
                speed: Math.random() * (snowflakeConfig.falling_speed_max - snowflakeConfig.falling_speed_min) + snowflakeConfig.falling_speed_min,
                opacity: Math.random() * 0.5 + 0.5,
                wind: Math.random() * 2 - 1
            };
        }
        
        function initSnowflakes() {
            snowflakes.length = 0;
            for (let i = 0; i < snowflakeConfig.flakes_num; i++) {
                const snowflake = createSnowflake();
                snowflake.y = Math.random() * canvas.height;
                snowflakes.push(snowflake);
            }
        }
        
        function updateSnowflakes() {
            snowflakes.forEach((snowflake, index) => {
                snowflake.y += snowflake.speed;
                snowflake.x += snowflake.wind * 0.5;
                
                if (snowflakeConfig.fade_away) {
                    if (snowflake.y > canvas.height - 50) {
                        snowflake.opacity -= 0.02;
                        if (snowflake.opacity <= 0) {
                            snowflakes[index] = createSnowflake();
                        }
                    }
                } else {
                    if (snowflake.y > canvas.height) {
                        snowflakes[index] = createSnowflake();
                    }
                }
                
                if (snowflake.x > canvas.width + 10) {
                    snowflake.x = -10;
                } else if (snowflake.x < -10) {
                    snowflake.x = canvas.width + 10;
                }
            });
        }
        
        function drawSnowflakes() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            snowflakes.forEach(snowflake => {
                ctx.save();
                ctx.globalAlpha = snowflake.opacity;
                ctx.fillStyle = snowflakeConfig.flake_color;
                ctx.font = `${snowflake.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(snowflakeConfig.flake_type, snowflake.x, snowflake.y);
                ctx.restore();
            });
        }
        
        function animate() {
            updateSnowflakes();
            drawSnowflakes();
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        initSnowflakes();
        animate();
        
        // Pause snowflakes when page is hidden (performance optimization)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                snowflakes.forEach(snowflake => {
                    snowflake.paused = true;
                });
            } else {
                snowflakes.forEach(snowflake => {
                    snowflake.paused = false;
                });
            }
        });
    }
    
    // Initialize snowflake effect
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSnowflakeEffect);
    } else {
        createSnowflakeEffect();
    }

    // Export functions for testing
    window.BlowingColdAC = {
        init,
        validateForm,
        isInViewport,
        validateInput,
        createSnowflakeEffect,
        updateCopyrightYear
    };

})();