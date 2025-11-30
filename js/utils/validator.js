// Validator Utility - Single Responsibility: Validation Logic
class Validator {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        return CONFIG.validation.patterns.email.test(email.trim());
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone to validate
     * @returns {boolean}
     */
    static isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }
        const cleaned = phone.replace(/\s/g, '');
        return cleaned.length >= 10 && CONFIG.validation.patterns.phone.test(phone);
    }

    /**
     * Validate required field
     * @param {string} value - Value to validate
     * @returns {boolean}
     */
    static isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim().length > 0;
    }

    /**
     * Validate minimum length
     * @param {string} value - Value to validate
     * @param {number} minLength - Minimum length
     * @returns {boolean}
     */
    static hasMinLength(value, minLength) {
        if (!value) return false;
        return value.toString().trim().length >= minLength;
    }

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string}
     */
    static sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validator;
}
