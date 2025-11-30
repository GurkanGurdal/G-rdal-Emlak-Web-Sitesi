// ContactForm Component - Single Responsibility: Handle Contact Form
class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.messageInput = document.getElementById('message');

        this._init();
    }

    /**
     * Initialize contact form
     * @private
     */
    _init() {
        this._bindEvents();
    }

    /**
     * Bind event listeners
     * @private
     */
    _bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this._handleSubmit(e));
        }

        // Real-time validation
        [this.nameInput, this.emailInput, this.phoneInput, this.messageInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this._validateField(input));
            }
        });
    }

    /**
     * Handle form submission
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = this._validateForm();

        if (!isValid) {
            this._showMessage('Lütfen tüm alanları doğru şekilde doldurun.', 'error');
            return;
        }

        // Get form data
        const formData = this._getFormData();

        // Simulate form submission (in production, this would send to backend)
        this._submitForm(formData);
    }

    /**
     * Validate entire form
     * @private
     * @returns {boolean}
     */
    _validateForm() {
        let isValid = true;

        // Validate name
        if (!Validator.isRequired(this.nameInput?.value) || 
            !Validator.hasMinLength(this.nameInput?.value, 2)) {
            this._setFieldError(this.nameInput, 'Geçerli bir ad soyad girin');
            isValid = false;
        } else {
            this._clearFieldError(this.nameInput);
        }

        // Validate email
        if (!Validator.isValidEmail(this.emailInput?.value)) {
            this._setFieldError(this.emailInput, 'Geçerli bir e-posta adresi girin');
            isValid = false;
        } else {
            this._clearFieldError(this.emailInput);
        }

        // Validate phone
        if (!Validator.isValidPhone(this.phoneInput?.value)) {
            this._setFieldError(this.phoneInput, 'Geçerli bir telefon numarası girin');
            isValid = false;
        } else {
            this._clearFieldError(this.phoneInput);
        }

        // Validate message
        if (!Validator.isRequired(this.messageInput?.value) || 
            !Validator.hasMinLength(this.messageInput?.value, 10)) {
            this._setFieldError(this.messageInput, 'Mesajınız en az 10 karakter olmalıdır');
            isValid = false;
        } else {
            this._clearFieldError(this.messageInput);
        }

        return isValid;
    }

    /**
     * Validate single field
     * @private
     */
    _validateField(input) {
        if (!input) return;

        switch (input.id) {
            case 'name':
                if (!Validator.isRequired(input.value) || !Validator.hasMinLength(input.value, 2)) {
                    this._setFieldError(input, 'Geçerli bir ad soyad girin');
                } else {
                    this._clearFieldError(input);
                }
                break;
            case 'email':
                if (!Validator.isValidEmail(input.value)) {
                    this._setFieldError(input, 'Geçerli bir e-posta adresi girin');
                } else {
                    this._clearFieldError(input);
                }
                break;
            case 'phone':
                if (!Validator.isValidPhone(input.value)) {
                    this._setFieldError(input, 'Geçerli bir telefon numarası girin');
                } else {
                    this._clearFieldError(input);
                }
                break;
            case 'message':
                if (!Validator.isRequired(input.value) || !Validator.hasMinLength(input.value, 10)) {
                    this._setFieldError(input, 'Mesajınız en az 10 karakter olmalıdır');
                } else {
                    this._clearFieldError(input);
                }
                break;
        }
    }

    /**
     * Set field error
     * @private
     */
    _setFieldError(input, message) {
        if (!input) return;

        input.style.borderColor = 'var(--color-error)';
        
        // Remove existing error message
        this._clearFieldError(input);

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--spacing-xs)';
        errorDiv.textContent = message;

        input.parentElement?.appendChild(errorDiv);
    }

    /**
     * Clear field error
     * @private
     */
    _clearFieldError(input) {
        if (!input) return;

        input.style.borderColor = '';
        const errorDiv = input.parentElement?.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Get form data
     * @private
     * @returns {Object}
     */
    _getFormData() {
        return {
            name: Validator.sanitizeHTML(this.nameInput?.value || ''),
            email: Validator.sanitizeHTML(this.emailInput?.value || ''),
            phone: Validator.sanitizeHTML(this.phoneInput?.value || ''),
            message: Validator.sanitizeHTML(this.messageInput?.value || '')
        };
    }

    /**
     * Submit form data
     * @private
     */
    async _submitForm(formData) {
        try {
            // Show loading state
            const submitBtn = this.form?.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Gönderiliyor...';
            }

            // Simulate API call (replace with actual API call in production)
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Form submitted:', formData);

            // Show success message
            this._showMessage('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.', 'success');

            // Reset form
            this._resetForm();

            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gönder';
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this._showMessage('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');

            // Restore button state
            const submitBtn = this.form?.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gönder';
            }
        }
    }

    /**
     * Show message to user
     * @private
     */
    _showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = this.form?.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        messageDiv.style.padding = 'var(--spacing-md)';
        messageDiv.style.marginBottom = 'var(--spacing-lg)';
        messageDiv.style.borderRadius = 'var(--radius-md)';
        messageDiv.style.fontWeight = 'var(--font-weight-medium)';
        messageDiv.textContent = message;

        // Set colors based on type
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }

        // Insert at top of form
        this.form?.insertBefore(messageDiv, this.form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    /**
     * Reset form
     * @private
     */
    _resetForm() {
        if (this.form) {
            this.form.reset();
        }

        // Clear all errors
        [this.nameInput, this.emailInput, this.phoneInput, this.messageInput].forEach(input => {
            this._clearFieldError(input);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}
