# Modal Component

A lightweight, customizable, and accessible modal dialog component for web applications.

## Features

- Clean, modern design with customizable styles
- Responsive layout that works on all device sizes
- Focus trap for keyboard accessibility
- Multiple animation options (fade, slide, zoom)
- Different size variants
- Programmatic control via JavaScript API
- Form support with validation
- Custom events for integration
- Close via:
  - Close button
  - Clicking overlay
  - Escape key
  - Programmatically

## Usage

### 1. Include the CSS and JavaScript files

```html
<link rel="stylesheet" href="css/modal.css">
<script src="js/modal.js"></script>
```

### 2. Initialize the Modal library

```javascript
document.addEventListener('DOMContentLoaded', function() {
    Modal.init();
});
```

### 3. Create a Modal in HTML

```html
<div id="my-modal" class="modal" aria-hidden="true" role="dialog">
    <div class="modal-container">
        <div class="modal-header">
            <h3 class="modal-title">Modal Title</h3>
            <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
            <p>Modal content goes here...</p>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" data-modal-close>Cancel</button>
            <button class="modal-btn modal-btn-primary">Confirm</button>
        </div>
    </div>
</div>
```

### 4. Add a trigger button

```html
<button data-modal-target="my-modal">Open Modal</button>
```

## JavaScript API

### Opening a Modal

```javascript
// Open by ID
Modal.open('my-modal');
```

### Closing a Modal

```javascript
// Close by ID
Modal.close('my-modal');

// Close all open modals
Modal.closeAll();
```

### Creating a Modal Programmatically

```javascript
const modalId = Modal.create({
    id: 'dynamic-modal',  // Optional, will generate one if not provided
    title: 'Dynamic Modal',
    content: '<p>This modal was created dynamically.</p>',
    size: 'modal-lg',  // Optional: modal-sm, modal-lg
    animation: 'modal-fade',  // Optional: modal-fade, modal-slide-up, modal-zoom
    confirmButton: 'Save',  // Button text
    cancelButton: 'Cancel',  // Button text
    onConfirm: function() {
        console.log('Confirmed!');
    },
    onCancel: function() {
        console.log('Cancelled!');
    },
    onClose: function() {
        console.log('Modal closed!');
    }
});

// Open the newly created modal
Modal.open(modalId);
```

## CSS Customization

### Size Variants

```html
<!-- Small Modal -->
<div id="small-modal" class="modal modal-sm">
    <!-- Modal content -->
</div>

<!-- Default Modal -->
<div id="default-modal" class="modal">
    <!-- Modal content -->
</div>

<!-- Large Modal -->
<div id="large-modal" class="modal modal-lg">
    <!-- Modal content -->
</div>
```

### Animation Types

```html
<!-- Fade Animation (default) -->
<div id="fade-modal" class="modal modal-fade">
    <!-- Modal content -->
</div>

<!-- Slide Up Animation -->
<div id="slide-modal" class="modal modal-slide-up">
    <!-- Modal content -->
</div>

<!-- Zoom Animation -->
<div id="zoom-modal" class="modal modal-zoom">
    <!-- Modal content -->
</div>
```

## Events

```javascript
// Listen for modal open event
document.getElementById('my-modal').addEventListener('modal:open', function(e) {
    console.log('Modal opened!', e.detail);
});

// Listen for modal close event
document.getElementById('my-modal').addEventListener('modal:close', function(e) {
    console.log('Modal closed!', e.detail);
});
```

## Accessibility Features

- ARIA attributes (`role="dialog"`, `aria-hidden`, `aria-labelledby`)
- Focus management (autofocus first focusable element)
- Focus trap (tab navigation stays within modal)
- Keyboard support (Escape to close)
- Screen reader friendly

## Browser Support

The modal component works in all modern browsers:
- Chrome
- Firefox
- Safari 
- Edge

## Example

See the `examples/modal-example.html` file for a complete working example of all features. 