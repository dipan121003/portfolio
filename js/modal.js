/**
 * Modal.js - A lightweight modal dialog component
 * 
 * This library provides functionality for showing and hiding modal dialogs
 * with various options and animations.
 */

// Modal controller as a module pattern
const Modal = (function() {
    // Collection of active modal instances
    const modals = {};

    // Constants
    const ANIMATION_DURATION = 300; // ms
    const ESC_KEY = 27;
    const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Custom events
    const EVENTS = {
        OPEN: 'modal:open',
        CLOSE: 'modal:close',
    };

    /**
     * Initialize all modals in the document
     */
    function init() {
        // Find all modals in the document
        const modalElements = document.querySelectorAll('.modal');
        
        // Initialize each modal
        modalElements.forEach(modalElement => {
            initModal(modalElement);
        });
        
        // Set up trigger buttons
        const triggers = document.querySelectorAll('[data-modal-target]');
        triggers.forEach(trigger => {
            const targetId = trigger.getAttribute('data-modal-target');
            if (targetId) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    open(targetId);
                });
            }
        });
        
        // Set up close buttons
        const closeButtons = document.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = button.closest('.modal');
                if (modal) {
                    close(modal.id);
                }
            });
        });
    }
    
    /**
     * Initialize a single modal element
     * @param {HTMLElement} modalElement - The modal DOM element
     */
    function initModal(modalElement) {
        if (!modalElement.id) {
            console.error('Modal element must have an ID', modalElement);
            return;
        }
        
        // Store reference to modal
        modals[modalElement.id] = {
            element: modalElement,
            isOpen: false,
            previouslyFocusedElement: null
        };
        
        // Set up close button event listeners
        const closeButton = modalElement.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                close(modalElement.id);
            });
        }
        
        // Close when clicking on the overlay (outside modal content)
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                close(modalElement.id);
            }
        });
        
        // Set up ARIA attributes
        if (!modalElement.getAttribute('aria-hidden')) {
            modalElement.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Open a modal by its ID
     * @param {string} modalId - The ID of the modal to open
     */
    function open(modalId) {
        const modal = modals[modalId];
        
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found or not initialized.`);
            return;
        }
        
        if (modal.isOpen) {
            return; // Already open
        }
        
        // Save the currently focused element to restore focus when closing
        modal.previouslyFocusedElement = document.activeElement;
        
        // Add active class to show the modal
        modal.element.classList.add('modal-active');
        
        // Set ARIA attributes
        modal.element.setAttribute('aria-hidden', 'false');
        
        // Prevent page scrolling
        document.body.style.overflow = 'hidden';
        
        // Set up keyboard events
        document.addEventListener('keydown', handleEscapeKey);
        
        // Focus the first focusable element in the modal
        setTimeout(() => {
            const focusableElements = modal.element.querySelectorAll(FOCUSABLE_ELEMENTS);
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
            
            // Set up focus trap
            modal.element.addEventListener('keydown', handleFocusTrap);
        }, 100);
        
        // Update state
        modal.isOpen = true;
        
        // Dispatch custom open event
        dispatchModalEvent(modal.element, EVENTS.OPEN);
    }
    
    /**
     * Close a modal by its ID
     * @param {string} modalId - The ID of the modal to close
     */
    function close(modalId) {
        const modal = modals[modalId];
        
        if (!modal || !modal.isOpen) {
            return; // Not open or not found
        }
        
        // Remove active class
        modal.element.classList.remove('modal-active');
        
        // Set ARIA attributes
        modal.element.setAttribute('aria-hidden', 'true');
        
        // Clean up event listeners
        document.removeEventListener('keydown', handleEscapeKey);
        modal.element.removeEventListener('keydown', handleFocusTrap);
        
        // Allow a delay for the animation to complete
        setTimeout(() => {
            // Restore body scrolling if no other modals are open
            if (!isAnyModalOpen()) {
                document.body.style.overflow = '';
            }
            
            // Restore focus to the element that was focused before opening
            if (modal.previouslyFocusedElement) {
                modal.previouslyFocusedElement.focus();
            }
            
            // Update state
            modal.isOpen = false;
            
            // Dispatch custom close event
            dispatchModalEvent(modal.element, EVENTS.CLOSE);
        }, ANIMATION_DURATION);
    }
    
    /**
     * Close all open modals
     */
    function closeAll() {
        Object.keys(modals).forEach(modalId => {
            if (modals[modalId].isOpen) {
                close(modalId);
            }
        });
    }
    
    /**
     * Create a new modal dynamically
     * @param {Object} options - Configuration for the new modal
     * @returns {string} - The ID of the newly created modal
     */
    function create(options = {}) {
        const {
            id = 'modal-' + Date.now(),
            title = 'Modal Title',
            content = '',
            size = '',
            animation = '',
            showFooter = true,
            closeButton = true,
            confirmButton = 'Confirm',
            cancelButton = 'Cancel',
            onConfirm = null,
            onCancel = null,
            onClose = null
        } = options;
        
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.id = id;
        modalElement.className = `modal ${size} ${animation}`;
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.setAttribute('role', 'dialog');
        
        // Set up modal HTML structure
        modalElement.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    ${closeButton ? '<button class="modal-close" aria-label="Close">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${showFooter ? `
                <div class="modal-footer">
                    ${cancelButton ? `<button class="modal-btn modal-btn-secondary" data-modal-close>${cancelButton}</button>` : ''}
                    ${confirmButton ? `<button class="modal-btn modal-btn-primary">${confirmButton}</button>` : ''}
                </div>
                ` : ''}
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modalElement);
        
        // Initialize modal
        initModal(modalElement);
        
        // Set up event listeners
        if (onConfirm) {
            const confirmBtn = modalElement.querySelector('.modal-btn-primary');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    onConfirm();
                    if (options.closeOnConfirm !== false) {
                        close(id);
                    }
                });
            }
        }
        
        if (onCancel) {
            const cancelBtn = modalElement.querySelector('.modal-btn-secondary');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    onCancel();
                    close(id);
                });
            }
        }
        
        if (onClose) {
            modalElement.addEventListener(EVENTS.CLOSE, onClose);
        }
        
        return id;
    }
    
    /**
     * Handle Escape key press to close modal
     * @param {KeyboardEvent} e - The keyboard event
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape' || e.keyCode === ESC_KEY) {
            const openModalIds = Object.keys(modals).filter(id => modals[id].isOpen);
            if (openModalIds.length > 0) {
                // Close the most recently opened modal
                close(openModalIds[openModalIds.length - 1]);
            }
        }
    }
    
    /**
     * Handle focus trap inside modal
     * @param {KeyboardEvent} e - The keyboard event
     */
    function handleFocusTrap(e) {
        if (e.key !== 'Tab') return;
        
        const modal = e.currentTarget;
        const focusableElements = Array.from(modal.querySelectorAll(FOCUSABLE_ELEMENTS));
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If going backward (shift+tab) and focused on first element, go to last element
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // If going forward (tab) and focused on last element, go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    /**
     * Check if any modal is currently open
     * @returns {boolean} - True if any modal is open
     */
    function isAnyModalOpen() {
        return Object.values(modals).some(modal => modal.isOpen);
    }
    
    /**
     * Dispatch a custom modal event
     * @param {HTMLElement} element - The modal element
     * @param {string} eventName - The name of the event to dispatch
     */
    function dispatchModalEvent(element, eventName) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            detail: { modalId: element.id }
        });
        element.dispatchEvent(event);
    }
    
    // Public API
    return {
        init,
        open,
        close,
        closeAll,
        create
    };
})();

// Export for module usage if needed
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Modal;
} 