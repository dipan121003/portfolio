// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded and ready!');
    
    // Theme Toggle Functionality
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const storageKey = 'theme-preference';
        
        // Function to get stored theme preference
        const getStoredTheme = () => {
            return localStorage.getItem(storageKey);
        };
        
        // Function to set theme preference in localStorage
        const setStoredTheme = (theme) => {
            localStorage.setItem(storageKey, theme);
        };
        
        // Function to apply theme
        const setTheme = (theme) => {
            if (theme === 'dark' || (!theme && prefersDarkScheme.matches)) {
                document.body.classList.add('dark-theme');
                if (themeToggle) {
                    themeToggle.setAttribute('aria-checked', 'true');
                }
                setStoredTheme('dark');
            } else {
                document.body.classList.remove('dark-theme');
                if (themeToggle) {
                    themeToggle.setAttribute('aria-checked', 'false');
                }
                setStoredTheme('light');
            }
        };
        
        // Initialize theme based on stored preference or system preference
        const storedTheme = getStoredTheme();
        setTheme(storedTheme);
        
        // Toggle theme when the switch is clicked
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.contains('dark-theme');
                setTheme(isDark ? 'light' : 'dark');
            });
            
            // Support keyboard accessibility
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isDark = document.body.classList.contains('dark-theme');
                    setTheme(isDark ? 'light' : 'dark');
                }
            });
        }
        
        // Listen for system preference changes
        prefersDarkScheme.addEventListener('change', (e) => {
            const storedTheme = getStoredTheme();
            if (!storedTheme) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    };
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Hamburger menu functionality
    const navToggle = document.querySelector('.nav-toggle');
    const body = document.body;
    const overlay = document.querySelector('.overlay');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            body.classList.toggle('nav-open');
            
            // Update ARIA attributes
            const expanded = body.classList.contains('nav-open');
            this.setAttribute('aria-expanded', expanded);
        });
        
        // Close menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        }
        
        // Close menu when clicking a nav link (mobile only)
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    body.classList.remove('nav-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when resizing above breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Enhanced Smooth Scroll for Navigation
    const initSmoothScroll = () => {
        const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]:not(.nav-link)');
        const header = document.querySelector('header');
        const sections = document.querySelectorAll('.section-scroll');
        const backToTopBtn = document.querySelector('.back-to-top');
        
        // Get header height for offset
        const getHeaderHeight = () => {
            return header ? header.offsetHeight : 0;
        };
        
        // Smooth scroll function with offset
        const smoothScrollTo = (target, duration = 800) => {
            if (!target) return;
            
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const headerOffset = getHeaderHeight();
            const distance = targetPosition - startPosition - headerOffset;
            
            let startTime = null;
            
            // Animation function
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };
            
            // Easing function for smooth animation
            const easeOutCubic = (t) => {
                return 1 - Math.pow(1 - t, 3);
            };
            
            requestAnimationFrame(animation);
        };
        
        // Set active nav link based on current section
        const setActiveNavLink = () => {
            let currentSectionId = '';
            const scrollPosition = window.scrollY;
            
            // Determine which section is currently in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop - getHeaderHeight() - 20;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('data-section');
                }
            });
            
            // Update nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkSection = link.getAttribute('data-section');
                
                if (linkSection === currentSectionId) {
                    link.classList.add('active');
                }
            });
            
            // Show/hide back to top button
            if (backToTopBtn) {
                if (scrollPosition > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
        };
        
        // Click event for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') {
                    // Scroll to top for home link
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        smoothScrollTo(targetElement);
                        
                        // Update URL hash without scrolling
                        history.pushState(null, null, targetId);
                        
                        // Close mobile menu if open
                        if (window.innerWidth < 992) {
                            document.body.classList.remove('nav-open');
                            const navToggle = document.querySelector('.nav-toggle');
                            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
            });
        });
        
        // Back to top button functionality
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            // Keyboard accessibility
            backToTopBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
        
        // Update active link on scroll
        window.addEventListener('scroll', setActiveNavLink, { passive: true });
        
        // Initial active link setting
        setActiveNavLink();
        
        // Handle initial URL hash for direct links
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                // Delay to ensure page is fully loaded
                setTimeout(() => {
                    smoothScrollTo(targetElement);
                }, 300);
            }
        }
    };
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Scroll Animation using Intersection Observer
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        
        // Create options for the observer
        const options = {
            root: null, // Use viewport as root
            rootMargin: '0px 0px -100px 0px', // Trigger slightly before elements come into view
            threshold: 0.15 // Trigger when 15% of element is visible
        };
        
        // Create the observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get any animation delay from data attribute
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    
                    // Apply animation with delay
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Start observing all animated elements
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        // Special handling for touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
            
            // Add touch-specific handling for animations if needed
            document.querySelectorAll('.scroll-animate').forEach(element => {
                element.style.willChange = 'auto'; // Optimize for touch devices
            });
        }
    };
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Section heading animations
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When heading comes into view, animate the underline
                entry.target.style.setProperty('--underline-width', '100%');
                entry.target.classList.add('animated');
                
                // Stop observing after it's animated
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe each section heading
    document.querySelectorAll('.section-heading').forEach(heading => {
        headingObserver.observe(heading);
    });
    
    // Lazy load images that are not already using the loading="lazy" attribute
    const lazyLoadImages = () => {
        if ('IntersectionObserver' in window) {
            const imgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imgObserver.observe(img);
            });
        }
    };
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Add touch-friendly hover effects for mobile
    const addTouchHoverEffects = () => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.classList.add('touch-hover');
                }, { passive: true });
                
                card.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-hover');
                    }, 300);
                }, { passive: true });
            });
        }
    };
    
    // Initialize touch hover effects
    addTouchHoverEffects();

    // Contact Form Validation and Submission
    const initContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        const formStatus = document.querySelector('.form-status');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formOverlay = document.getElementById('formThankYou');
        const formCloseButton = document.getElementById('formCloseButton');
        
        // Form state tracking
        let formSubmitting = false;
        let formSubmitted = false;
        
        // Form fields validation configuration
        const validationConfig = {
            name: {
                element: nameInput,
                errorElement: document.getElementById('nameError'),
                validate: (value) => {
                    if (!value.trim()) {
                        return { isValid: false, message: 'Please enter your name' };
                    }
                    if (value.trim().length < 2) {
                        return { isValid: false, message: 'Name must be at least 2 characters' };
                    }
                    return { isValid: true };
                }
            },
            email: {
                element: emailInput,
                errorElement: document.getElementById('emailError'),
                validate: (value) => {
                    if (!value.trim()) {
                        return { isValid: false, message: 'Please enter your email' };
                    }
                    
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        return { isValid: false, message: 'Please enter a valid email address' };
                    }
                    return { isValid: true };
                }
            },
            message: {
                element: messageInput,
                errorElement: document.getElementById('messageError'),
                validate: (value) => {
                    if (!value.trim()) {
                        return { isValid: false, message: 'Please enter a message' };
                    }
                    if (value.trim().length < 10) {
                        return { isValid: false, message: 'Message must be at least 10 characters' };
                    }
                    return { isValid: true };
                }
            }
        };
        
        // Validate a single field
        const validateField = (fieldName) => {
            const field = validationConfig[fieldName];
            if (!field) return { isValid: true };
            
            const result = field.validate(field.element.value);
            const parentGroup = field.element.closest('.form-group');
            
            // Remove pristine class on first validation
            field.element.classList.remove('pristine');
            
            if (!result.isValid) {
                field.element.classList.add('error');
                if (parentGroup) parentGroup.classList.add('error');
                if (field.errorElement) {
                    field.errorElement.textContent = result.message;
                    field.errorElement.classList.add('visible');
                }
            } else {
                field.element.classList.remove('error');
                if (parentGroup) parentGroup.classList.remove('error');
                if (field.errorElement) {
                    field.errorElement.textContent = '';
                    field.errorElement.classList.remove('visible');
                }
            }
            
            return result;
        };
        
        // Validate all fields
        const validateAllFields = () => {
            let isFormValid = true;
            
            for (const fieldName in validationConfig) {
                const result = validateField(fieldName);
                if (!result.isValid) {
                    isFormValid = false;
                }
            }
            
            return isFormValid;
        };
        
        // Show form status message
        const showFormStatus = (type, message) => {
            if (!formStatus) return;
            
            formStatus.className = `form-status ${type}`;
            formStatus.textContent = message;
            formStatus.classList.add('visible');
            
            if (type === 'success') {
                contactForm.classList.add('form-success-animation');
                setTimeout(() => {
                    contactForm.classList.remove('form-success-animation');
                }, 1000);
            }
        };
        
        // Hide form status message
        const hideFormStatus = () => {
            if (!formStatus) return;
            formStatus.classList.remove('visible');
        };
        
        // Handle form submission
        const handleFormSubmit = async (e) => {
            e.preventDefault();
            
            // Prevent double submission
            if (formSubmitting) return;
            
            // Validate all fields
            const isValid = validateAllFields();
            if (!isValid) return;
            
            // Start loading state
            formSubmitting = true;
            contactForm.classList.add('submitting');
            submitBtn.classList.add('loading');
            hideFormStatus();
            
            try {
                // If using Netlify Forms
                if (contactForm.getAttribute('data-netlify') === 'true') {
                    // Create FormData object
                    const formData = new FormData(contactForm);
                    
                    // Submit the form data using fetch
                    const response = await fetch('/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(formData).toString()
                    });
                    
                    if (response.ok) {
                        // Show success message with overlay
                        setTimeout(() => {
                            showFormThankYou();
                            resetForm();
                        }, 1000);
                    } else {
                        throw new Error('Form submission failed');
                    }
                } else {
                    // Demo submission (simulated)
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // 90% chance of success for demo
                    const success = Math.random() > 0.1;
                    
                    if (success) {
                        // Show success message with overlay
                        showFormThankYou();
                        resetForm();
                    } else {
                        throw new Error('Form submission failed (demo error)');
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('error', 'There was a problem sending your message. Please try again.');
            } finally {
                // End loading state
                formSubmitting = false;
                contactForm.classList.remove('submitting');
                submitBtn.classList.remove('loading');
            }
        };
        
        // Show thank you overlay
        const showFormThankYou = () => {
            if (!formOverlay) return;
            formSubmitted = true;
            formOverlay.classList.add('visible');
        };
        
        // Hide thank you overlay
        const hideFormThankYou = () => {
            if (!formOverlay) return;
            formOverlay.classList.remove('visible');
        };
        
        // Reset form to initial state
        const resetForm = () => {
            contactForm.reset();
            
            // Reset validation state
            for (const fieldName in validationConfig) {
                const field = validationConfig[fieldName];
                field.element.classList.remove('error');
                field.element.classList.add('pristine');
                const parentGroup = field.element.closest('.form-group');
                if (parentGroup) parentGroup.classList.remove('error');
                if (field.errorElement) {
                    field.errorElement.textContent = '';
                    field.errorElement.classList.remove('visible');
                }
            }
            
            hideFormStatus();
        };
        
        // Set up input event listeners for real-time validation
        for (const fieldName in validationConfig) {
            const field = validationConfig[fieldName];
            
            field.element.addEventListener('input', () => {
                if (!field.element.classList.contains('pristine')) {
                    validateField(fieldName);
                }
            });
            
            field.element.addEventListener('blur', () => {
                validateField(fieldName);
            });
        }
        
        // Form submission event
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Close button for thank you message
        if (formCloseButton) {
            formCloseButton.addEventListener('click', hideFormThankYou);
        }
        
        // Prevent form submission with Enter key in fields (except textarea)
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                emailInput.focus();
            }
        });
        
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                messageInput.focus();
            }
        });
    };
    
    // Initialize contact form
    initContactForm();
}); 