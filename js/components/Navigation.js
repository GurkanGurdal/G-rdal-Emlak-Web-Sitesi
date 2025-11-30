// Navigation Component - Single Responsibility: Handle Navigation
class Navigation {
    constructor(navToggleSelector, navMenuSelector) {
        this.navToggle = document.querySelector(navToggleSelector);
        this.navMenu = document.querySelector(navMenuSelector);
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;

        this._init();
    }

    /**
     * Initialize navigation
     * @private
     */
    _init() {
        this._bindEvents();
        this._setupSmoothScroll();
        this._setupActiveLinks();
    }

    /**
     * Bind event listeners
     * @private
     */
    _bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this._toggleMobileMenu());
        }

        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this._closeMobileMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => this._handleOutsideClick(e));

        // Handle scroll
        window.addEventListener('scroll', () => this._handleScroll(), { passive: true });
    }

    /**
     * Toggle mobile menu
     * @private
     */
    _toggleMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');

        // Update aria-expanded for accessibility
        const isExpanded = this.navToggle.classList.contains('active');
        this.navToggle.setAttribute('aria-expanded', isExpanded);
    }

    /**
     * Close mobile menu
     * @private
     */
    _closeMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }

    /**
     * Handle clicks outside menu
     * @private
     */
    _handleOutsideClick(e) {
        if (!this.navToggle || !this.navMenu) return;

        const isClickInsideMenu = this.navMenu.contains(e.target);
        const isClickOnToggle = this.navToggle.contains(e.target);

        if (!isClickInsideMenu && !isClickOnToggle && this.navMenu.classList.contains('active')) {
            this._closeMobileMenu();
        }
    }

    /**
     * Setup smooth scroll for anchor links
     * @private
     */
    _setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = this.header ? this.header.offsetHeight : 0;
                        Animator.scrollTo(targetElement, headerHeight);
                    }
                }
            });
        });
    }

    /**
     * Setup active link highlighting based on scroll position
     * @private
     */
    _setupActiveLinks() {
        const sections = Array.from(this.navLinks)
            .map(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    return document.getElementById(href.substring(1));
                }
                return null;
            })
            .filter(section => section !== null);

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const headerHeight = this.header ? this.header.offsetHeight : 0;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollY >= sectionTop && scrollY < sectionBottom) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    this.navLinks[index]?.classList.add('active');
                }
            });
        }, { passive: true });
    }

    /**
     * Handle scroll for header visibility
     * @private
     */
    _handleScroll() {
        if (!this.header) return;

        const currentScrollY = window.scrollY;

        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.header.classList.add('hidden');
        } else {
            this.header.classList.remove('hidden');
        }

        this.lastScrollY = currentScrollY;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
