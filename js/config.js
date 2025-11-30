// Configuration - Single Responsibility Principle
const CONFIG = {
    api: {
        baseUrl: '/api',
        endpoints: {
            properties: '/properties',
            contact: '/contact'
        }
    },
    animation: {
        duration: 250,
        easing: 'ease-in-out'
    },
    pagination: {
        itemsPerPage: 9,
        initialPage: 1
    },
    validation: {
        patterns: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\d\s\-\+\(\)]+$/
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
