// client/scripts/utils.js

// Show notification messages to users
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show confirmation dialog with custom UI
function showConfirmDialog(message) {
    return new Promise((resolve) => {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.confirm-dialog-overlay');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'confirm-dialog-overlay';
        
        // Create dialog box
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        
        // Create message
        const messageEl = document.createElement('p');
        messageEl.className = 'confirm-message';
        messageEl.textContent = message;
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'confirm-buttons';
        
        // Create confirm button (checkmark)
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-btn confirm-yes';
        confirmBtn.innerHTML = '✓';
        confirmBtn.setAttribute('aria-label', 'Confirm');
        
        // Create cancel button (x)
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'confirm-btn confirm-no';
        cancelBtn.innerHTML = '✕';
        cancelBtn.setAttribute('aria-label', 'Cancel');
        
        // Add event listeners
        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        
        cancelBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(false);
            }
        });
        
        // Assemble dialog
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        dialog.appendChild(messageEl);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        
        // Add to body
        document.body.appendChild(overlay);
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[a-zA-Z]/.test(password)) {
        errors.push('Password must contain at least one letter');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Sanitize user input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Debounce function for search/filter
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

// Local storage helpers
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage error:', error);
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage error:', error);
        }
    },
    
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage error:', error);
        }
    }
};

// Show loading state
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

// Hide loading state
function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Handle API errors consistently
function handleApiError(error, defaultMessage = 'An error occurred') {
    if (error.response && error.response.data) {
        // API error with response
        const message = error.response.data.message || defaultMessage;
        showNotification(message, 'error');
    } else if (error.message) {
        // Network or other error
        showNotification(error.message, 'error');
    } else {
        showNotification(defaultMessage, 'error');
    }
}

// Confirmation dialog
function confirmAction(message) {
    return window.confirm(message);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Failed to copy', 'error');
        return false;
    }
}