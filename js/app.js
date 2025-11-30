// Main Application - Dependency Injection Pattern
// Liskov Substitution & Dependency Inversion: Components depend on abstractions

class App {
    constructor() {
        this.propertyService = null;
        this.navigation = null;
        this.searchBox = null;
        this.contactForm = null;
        this.propertiesGrid = null;
        this.loadingSpinner = null;
    }

    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._initializeApp());
        } else {
            this._initializeApp();
        }
    }

    /**
     * Initialize all app components
     * @private
     */
    _initializeApp() {
        // Initialize services
        this.propertyService = new PropertyService();

        // Initialize UI components
        this.navigation = new Navigation('#navToggle', '#navMenu');
        this.searchBox = new SearchBox('#searchBtn', this.propertyService);
        this.contactForm = new ContactForm('#contactForm');

        // Get DOM elements
        this.propertiesGrid = document.getElementById('propertiesGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        // Setup event listeners
        this._setupEventListeners();
        
        // Setup city-district dropdown
        this._setupCityDistrict();
        
        // Restore saved filters
        this._restoreFilters();

        // Initial property load (after filter restore)
        setTimeout(() => {
            this._loadProperties();
        }, 100);

        // Initialize animations
        this._initializeAnimations();
        
        // Setup scroll animations
        this._setupScrollAnimations();

        console.log('Gürdal Emlak web sitesi başlatıldı');
    }

    /**
     * Setup global event listeners
     * @private
     */
    _setupEventListeners() {
        // Listen for search events
        document.addEventListener('searchProperties', () => {
            this._saveFilters();
            this._loadProperties();
        });

        // Listen for property card clicks
        document.addEventListener('propertyCardClick', (e) => {
            console.log('Property details:', e.detail.property);
            // In production, this would navigate to property detail page
        });

        // Setup filter buttons
        this._setupFilterButtons();
    }

    /**
     * Setup property filter buttons
     * @private
     */
    _setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Get filter value
                const filterValue = btn.dataset.filter || 'all';

                // Update service filter
                this.propertyService.setFilter('type', filterValue);

                // Save and reload
                this._saveFilters();
                this._loadProperties();
            });
        });
    }
    
    /**
     * Save current filters to localStorage
     * @private
     */
    _saveFilters() {
        const filters = {
            propertyType: document.getElementById('propertyType')?.value || '',
            propertyCategory: document.getElementById('propertyCategory')?.value || '',
            city: document.getElementById('city')?.value || '',
            district: document.getElementById('district')?.value || '',
            filterType: this.propertyService.filters.type,
            location: this.propertyService.filters.location,
            category: this.propertyService.filters.category
        };
        localStorage.setItem('gurdalEmlakFilters', JSON.stringify(filters));
    }
    
    /**
     * Restore filters from localStorage
     * @private
     */
    _restoreFilters() {
        // Check if we're coming back from detail page
        const isReturningFromDetail = sessionStorage.getItem('navigatingToDetail') === 'true';
        
        // Clear the flag
        sessionStorage.removeItem('navigatingToDetail');
        
        // Only restore filters if returning from detail page
        if (!isReturningFromDetail) {
            localStorage.removeItem('gurdalEmlakFilters');
            return;
        }
        
        const savedFilters = localStorage.getItem('gurdalEmlakFilters');
        if (!savedFilters) return;
        
        try {
            const filters = JSON.parse(savedFilters);
            
            // Restore select values
            if (filters.propertyType) {
                const propertyTypeSelect = document.getElementById('propertyType');
                if (propertyTypeSelect) propertyTypeSelect.value = filters.propertyType;
            }
            
            if (filters.propertyCategory) {
                const propertyCategorySelect = document.getElementById('propertyCategory');
                if (propertyCategorySelect) propertyCategorySelect.value = filters.propertyCategory;
            }
            
            if (filters.city) {
                const citySelect = document.getElementById('city');
                if (citySelect) {
                    citySelect.value = filters.city;
                    // Trigger change event to populate districts
                    citySelect.dispatchEvent(new Event('change'));
                    
                    // Restore district after a short delay
                    if (filters.district) {
                        setTimeout(() => {
                            const districtSelect = document.getElementById('district');
                            if (districtSelect) districtSelect.value = filters.district;
                        }, 50);
                    }
                }
            }
            
            // Restore filter buttons (property type filter)
            if (filters.filterType) {
                const filterButtons = document.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filters.filterType);
                });
            }
            
            // Apply ALL saved filters to the service
            this.propertyService.setFilter('type', filters.filterType || 'all');
            this.propertyService.setFilter('category', filters.category || 'all');
            this.propertyService.setFilter('location', filters.location || '');
            
            console.log('Filters restored:', this.propertyService.filters);
            
        } catch (e) {
            console.error('Filter restore hatası:', e);
        }
    }

    /**
     * Load and display properties
     * @private
     */
    _loadProperties() {
        // Show loading spinner
        this._showLoading();

        // Simulate async data loading
        setTimeout(() => {
            const properties = this.propertyService.getFilteredProperties();
            this._renderProperties(properties);
            this._hideLoading();
        }, 300);
    }

    /**
     * Render properties to grid
     * @private
     */
    _renderProperties(properties) {
        if (!this.propertiesGrid) return;

        // Clear existing properties
        this.propertiesGrid.innerHTML = '';

        if (!properties || properties.length === 0) {
            this._showNoResults();
            return;
        }

        // Create property cards
        const fragment = PropertyCard.createMultiple(properties);
        this.propertiesGrid.appendChild(fragment);

        // Animate cards on load
        const cards = this.propertiesGrid.querySelectorAll('.property-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            }, index * 50);
        });
    }

    /**
     * Show no results message
     * @private
     */
    _showNoResults() {
        if (!this.propertiesGrid) return;

        this.propertiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-3xl);">
                <h3 style="color: var(--color-text-light); margin-bottom: var(--spacing-md);">
                    Aradığınız kriterlere uygun ilan bulunamadı
                </h3>
                <p style="color: var(--color-text-light);">
                    Lütfen farklı filtreler deneyin veya bizimle iletişime geçin.
                </p>
            </div>
        `;
    }

    /**
     * Show loading spinner
     * @private
     */
    _showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.add('active');
        }
        if (this.propertiesGrid) {
            this.propertiesGrid.style.opacity = '0.5';
        }
    }

    /**
     * Hide loading spinner
     * @private
     */
    _hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.remove('active');
        }
        if (this.propertiesGrid) {
            this.propertiesGrid.style.opacity = '1';
        }
    }

    /**
     * Initialize scroll animations
     * @private
     */
    _initializeAnimations() {
        // Animate stat counters
        const statNumbers = document.querySelectorAll('.stat-card__number');
        statNumbers.forEach(stat => {
            Animator.observeVisibility(stat, (element) => {
                const target = parseInt(element.dataset.count) || 0;
                Animator.animateCounter(element, target);
            });
        });

        // Animate sections on scroll
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            Animator.observeVisibility(section, (element) => {
                element.classList.add('fade-in');
            });
        });
        
        // Animate properties section
        this._setupScrollAnimations();
    }
    
    /**
     * Setup scroll animations for properties section
     * @private
     */
    _setupScrollAnimations() {
        const propertiesSection = document.querySelector('.properties');
        
        if (!propertiesSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(propertiesSection);
    }

    /**
     * Setup city-district dropdown relationship
     * @private
     */
    _setupCityDistrict() {
        const citySelect = document.getElementById('city');
        const districtSelect = document.getElementById('district');
        
        const districts = {
            antalya: ['Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik'],
            isparta: ['Aksu', 'Atabey', 'Eğirdir', 'Gelendost', 'Gönen', 'Keçiborlu', 'Merkez', 'Senirkent', 'Sütçüler', 'Şarkikaraağaç', 'Uluborlu', 'Yalvaç', 'Yenişarbademli']
        };
        
        citySelect.addEventListener('change', (e) => {
            const selectedCity = e.target.value;
            districtSelect.innerHTML = '<option value="">İlçe</option>';
            
            if (selectedCity && districts[selectedCity]) {
                districts[selectedCity].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.toLowerCase();
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
                districtSelect.disabled = false;
            } else {
                districtSelect.disabled = true;
            }
        });
        
        // Initially disable district select
        districtSelect.disabled = true;
    }
}

// Initialize app when script loads
const app = new App();
app.init();
