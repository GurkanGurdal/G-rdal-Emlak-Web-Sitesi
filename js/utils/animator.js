// Animator Utility - Single Responsibility: Animation Logic
class Animator {
    /**
     * Animate counter from 0 to target value
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     */
    static animateCounter(element, target, duration = 2000) {
        if (!element || !target) return;

        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    /**
     * Fade in element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Animation duration in ms
     */
    static fadeIn(element, duration = CONFIG.animation.duration) {
        if (!element) return;

        element.style.opacity = '0';
        element.style.display = 'block';

        let opacity = 0;
        const increment = 16 / duration;

        const timer = setInterval(() => {
            opacity += increment;
            if (opacity >= 1) {
                element.style.opacity = '1';
                clearInterval(timer);
            } else {
                element.style.opacity = opacity.toString();
            }
        }, 16);
    }

    /**
     * Fade out element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Animation duration in ms
     */
    static fadeOut(element, duration = CONFIG.animation.duration) {
        if (!element) return;

        let opacity = 1;
        const decrement = 16 / duration;

        const timer = setInterval(() => {
            opacity -= decrement;
            if (opacity <= 0) {
                element.style.opacity = '0';
                element.style.display = 'none';
                clearInterval(timer);
            } else {
                element.style.opacity = opacity.toString();
            }
        }, 16);
    }

    /**
     * Smooth scroll to element
     * @param {HTMLElement|string} target - Element or selector to scroll to
     * @param {number} offset - Offset from top
     */
    static scrollTo(target, offset = 0) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;

        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Observe element and trigger callback when visible
     * @param {HTMLElement} element - Element to observe
     * @param {Function} callback - Callback function
     * @param {Object} options - Intersection observer options
     */
    static observeVisibility(element, callback, options = {}) {
        if (!element || !callback) return;

        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px',
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, defaultOptions);

        observer.observe(element);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animator;
}
