// BITM203 Final Project - JavaScript File
// Demonstrating JavaScript concepts from Weeks 10-11

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('BITM203 Final Project - Website loaded successfully');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize form validation if on contact page
    if (document.getElementById('contactForm')) {
        initFormValidation();
    }
    
    // Initialize other interactive features
    initInteractiveFeatures();
    
    // Update footer year
    updateFooterYear();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.innerHTML = navList.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Form Validation Functions
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    // Get form elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const phone = document.getElementById('phone');
    const terms = document.getElementById('terms');
    
    // Real-time validation for full name
    if (fullName) {
        fullName.addEventListener('blur', validateFullName);
        fullName.addEventListener('input', function() {
            clearError('nameError');
        });
    }
    
    // Real-time validation for email
    if (email) {
        email.addEventListener('blur', validateEmail);
        email.addEventListener('input', function() {
            clearError('emailError');
        });
    }
    
    // Real-time validation for password
    if (password) {
        password.addEventListener('blur', validatePassword);
        password.addEventListener('input', function() {
            clearError('passwordError');
            // Also validate confirm password if it has value
            if (confirmPassword.value) {
                validateConfirmPassword();
            }
        });
    }
    
    // Real-time validation for confirm password
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', validateConfirmPassword);
        confirmPassword.addEventListener('input', function() {
            clearError('confirmPasswordError');
        });
    }
    
    // Real-time validation for phone
    if (phone) {
        phone.addEventListener('blur', validatePhone);
        phone.addEventListener('input', function() {
            clearError('phoneError');
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate all fields
        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isPhoneValid = validatePhone();
        const isGenderValid = validateGender();
        const isTermsValid = validateTerms();
        
        // If all validations pass
        if (isNameValid && isEmailValid && isPasswordValid && 
            isConfirmPasswordValid && isPhoneValid && isGenderValid && isTermsValid) {
            
            // Show success message
            showFormMessage('Form submitted successfully! Thank you for registering.', 'success');
            
            // In a real application, you would send data to a server here
            console.log('Form Data:', {
                fullName: fullName.value,
                email: email.value,
                phone: phone.value,
                gender: getSelectedGender(),
                interests: getSelectedInterests(),
                country: document.getElementById('country').value,
                messageType: document.getElementById('messageType').value,
                message: document.getElementById('message').value,
                newsletter: document.getElementById('newsletter').checked,
                terms: terms.checked
            });
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                showFormMessage('', '');
            }, 3000);
        } else {
            showFormMessage('Please fix the errors in the form before submitting.', 'error');
        }
    });
    
    // Form reset
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Clear all error messages
            const errorIds = ['nameError', 'emailError', 'passwordError', 
                            'confirmPasswordError', 'phoneError', 'genderError', 'termsError'];
            errorIds.forEach(id => clearError(id));
            
            // Clear form message
            showFormMessage('', '');
        });
    }
}

// Individual Validation Functions
function validateFullName() {
    const fullName = document.getElementById('fullName');
    const errorId = 'nameError';
    
    if (!fullName || !fullName.value.trim()) {
        showError(errorId, 'Full name is required');
        return false;
    }
    
    if (fullName.value.trim().length < 2) {
        showError(errorId, 'Name must be at least 2 characters');
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateEmail() {
    const email = document.getElementById('email');
    const errorId = 'emailError';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !email.value.trim()) {
        showError(errorId, 'Email address is required');
        return false;
    }
    
    if (!emailPattern.test(email.value)) {
        showError(errorId, 'Please enter a valid email address (e.g., user@example.com)');
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validatePassword() {
    const password = document.getElementById('password');
    const errorId = 'passwordError';
    
    if (!password || !password.value) {
        showError(errorId, 'Password is required');
        return false;
    }
    
    if (password.value.length < 8) {
        showError(errorId, 'Password must be at least 8 characters');
        return false;
    }
    
    // Check for at least one number and one letter
    const hasNumber = /\d/.test(password.value);
    const hasLetter = /[a-zA-Z]/.test(password.value);
    
    if (!hasNumber || !hasLetter) {
        showError(errorId, 'Password must contain at least one letter and one number');
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorId = 'confirmPasswordError';
    
    if (!confirmPassword || !confirmPassword.value) {
        showError(errorId, 'Please confirm your password');
        return false;
    }
    
    if (password.value !== confirmPassword.value) {
        showError(errorId, 'Passwords do not match');
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validatePhone() {
    const phone = document.getElementById('phone');
    const errorId = 'phoneError';
    
    // Phone is optional, but if provided, validate format
    if (phone && phone.value.trim() && !/^[\d\s\-\+\(\)]{10,}$/.test(phone.value)) {
        showError(errorId, 'Please enter a valid phone number (at least 10 digits)');
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateGender() {
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const errorId = 'genderError';
    let isChecked = false;
    
    genderInputs.forEach(input => {
        if (input.checked) {
            isChecked = true;
        }
    });
    
    if (!isChecked) {
        showError(errorId, 'Please select a gender');
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateTerms() {
    const terms = document.getElementById('terms');
    const errorId = 'termsError';
    
    if (!terms || !terms.checked) {
        showError(errorId, 'You must agree to the terms and conditions');
        return false;
    }
    
    clearError(errorId);
    return true;
}

// Helper Functions
function getSelectedGender() {
    const genderInputs = document.querySelectorAll('input[name="gender"]:checked');
    return genderInputs.length > 0 ? genderInputs[0].value : null;
}

function getSelectedInterests() {
    const interestInputs = document.querySelectorAll('input[name="interests"]:checked');
    const interests = [];
    interestInputs.forEach(input => {
        interests.push(input.value);
    });
    return interests;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = 'var(--danger-color)';
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message';
        
        if (type === 'success') {
            formMessage.classList.add('success');
        } else if (type === 'error') {
            formMessage.classList.add('error');
        } else {
            formMessage.className = 'form-message';
        }
    }
}

// Other Interactive Features
function initInteractiveFeatures() {
    // Add hover effects to timetable rows
    if (document.querySelector('.timetable')) {
        initTimetableHover();
    }
    
    // Add click effects to gallery items
    if (document.querySelector('.gallery-item')) {
        initGalleryClick();
    }
    
    // Highlight current day in timetable
    highlightCurrentDay();
}

function initTimetableHover() {
    const rows = document.querySelectorAll('.timetable tbody tr');
    
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f7ff';
            this.style.transition = 'background-color 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            // Check if it's an even row
            if (this.rowIndex % 2 === 0) {
                this.style.backgroundColor = 'var(--gray-light)';
            } else {
                this.style.backgroundColor = 'white';
            }
        });
    });
}

function initGalleryClick() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Get image source and alt text
            const img = this.querySelector('img');
            if (img) {
                console.log('Gallery item clicked:', img.alt);
                
                // In a real project, you could open a modal here
                // showImageModal(img.src, img.alt);
            }
        });
    });
}

function highlightCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const currentDay = days[today];
    
    // Find the column for today
    const tableHeaders = document.querySelectorAll('.timetable th');
    tableHeaders.forEach((header, index) => {
        if (header.textContent === currentDay) {
            header.style.backgroundColor = 'var(--accent-color)';
        }
    });
}

function updateFooterYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    // Close menu with Escape key
    if (event.key === 'Escape') {
        const navList = document.querySelector('.nav-list');
        const menuToggle = document.getElementById('menuToggle');
        
        if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }
});