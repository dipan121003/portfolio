/**
 * app.bundle.js - Non-critical JavaScript functionality
 * This bundle contains features that are not essential for initial page load
 */

// Wait for the main JavaScript to be executed first
window.addEventListener('DOMContentLoaded', () => {
    console.log('App bundle loaded');
    
    // Initialize only after the main script has loaded
    setTimeout(() => {
        initializeEnhancements();
    }, 100);
});

/**
 * Initialize non-critical UI enhancements
 */
function initializeEnhancements() {
    // Enhanced animations
    initAnimations();
    
    // Image lazy loading optimization
    optimizeImages();
    
    // Add enhanced interaction effects
    addInteractionEffects();
    
    // Setup modals
    setupModals();
}

/**
 * Enhanced animations beyond the critical ones
 */
function initAnimations() {
    // Parallax scrolling effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                const translateY = scrollPosition * 0.3;
                heroSection.style.backgroundPositionY = `-${translateY}px`;
            }
        }, { passive: true });
    }
    
    // Staggered animations for tech stack badges
    const techBadges = document.querySelectorAll('.tech-stack .badge');
    if (techBadges.length) {
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const badges = entry.target.querySelectorAll('.badge');
                    badges.forEach((badge, index) => {
                        setTimeout(() => {
                            badge.classList.add('animate-in');
                        }, index * 100);
                    });
                    badgeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.tech-stack').forEach(stack => {
            badgeObserver.observe(stack);
        });
    }
}

/**
 * Image loading optimizations
 */
function optimizeImages() {
    // Preload images that will be needed soon based on scroll position
    const preloadNearbyImages = () => {
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        // Look for images within the next 2 viewport heights
        const imagesToPreload = document.querySelectorAll('img[loading="lazy"]');
        
        imagesToPreload.forEach(img => {
            const rect = img.getBoundingClientRect();
            const distanceFromViewport = rect.top - viewportHeight;
            
            // If the image is within 2 viewport heights
            if (distanceFromViewport < viewportHeight * 2 && !img.preloaded) {
                // Change fetchpriority to high for images that will soon be visible
                img.setAttribute('fetchpriority', 'high');
                img.preloaded = true;
            }
        });
    };
    
    // Add scroll listener for image preloading
    window.addEventListener('scroll', () => {
        // Use requestAnimationFrame to avoid performance issues
        requestAnimationFrame(preloadNearbyImages);
    }, { passive: true });
    
    // Handle image load errors
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            // Apply a fallback image if loading fails
            img.src = 'images/placeholder.jpg';
            img.alt = 'Image could not be loaded';
        });
    });
}

/**
 * Enhanced interaction effects
 */
function addInteractionEffects() {
    // Smooth hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover-active');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover-active');
        });
        
        // Add 3D tilt effect on mousemove
        card.addEventListener('mousemove', (e) => {
            // Only apply on desktop devices
            if (window.innerWidth >= 992) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            }
        });
        
        // Reset transform on mouseleave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Enhanced focus styles for form inputs
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('focused');
            }
        });
        
        input.addEventListener('blur', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('focused');
            }
        });
    });
}

function setupModals() {
    // Get all modal triggers and modals
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Setup modal triggers
    if (modalTriggers.length) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal-trigger');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    // Add animation classes
                    document.body.classList.add('modal-open');
                    modal.classList.add('modal-active');
                    
                    // Fade in animation
                    setTimeout(() => {
                        modal.classList.add('modal-visible');
                    }, 10);
                }
            });
        });
    }
    
    // Setup close buttons
    if (closeButtons.length) {
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
    }
    
    // Close when clicking outside the modal content
    if (modals.length) {
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(e);
                }
            });
        });
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.modal-active');
            if (activeModal) {
                closeModal(e, activeModal);
            }
        }
    });
    
    // Function to close modal with animation
    function closeModal(e, specificModal = null) {
        e.preventDefault();
        const modal = specificModal || this.closest('.modal');
        
        if (modal) {
            modal.classList.remove('modal-visible');
            
            // Wait for animation to complete before fully removing
            setTimeout(() => {
                modal.classList.remove('modal-active');
                document.body.classList.remove('modal-open');
            }, 300); // Match this with CSS transition duration
        }
    }
}

// Add CSS class to indicate the bundle has loaded
document.documentElement.classList.add('js-bundle-loaded'); 