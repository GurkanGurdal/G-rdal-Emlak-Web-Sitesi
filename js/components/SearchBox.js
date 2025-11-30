// SearchBox Component - Single Responsibility: Handle Property Search
class SearchBox {
    constructor(searchBtnSelector, propertyService) {
        this.searchBtn = document.querySelector(searchBtnSelector);
        this.resetBtn = document.getElementById('resetBtn');
        this.propertyTypeSelect = document.getElementById('propertyType');
        this.propertyCategorySelect = document.getElementById('propertyCategory');
        this.citySelect = document.getElementById('city');
        this.districtSelect = document.getElementById('district');
        this.propertyService = propertyService;

        this._init();
    }

    /**
     * Initialize search box
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
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this._handleSearch());
        }
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this._handleReset());
        }

        // Allow Enter key to trigger search
        [this.propertyTypeSelect, this.propertyCategorySelect, this.citySelect, this.districtSelect].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this._handleSearch();
                    }
                });
            }
        });
    }

    /**
     * Handle search action
     * @private
     */
    _handleSearch() {
        const filters = this._getFilters();
        
        // Update service filters
        this.propertyService.setFilter('type', filters.type);
        this.propertyService.setFilter('category', filters.category);
        this.propertyService.setFilter('location', filters.location);

        // Dispatch custom event for search
        const event = new CustomEvent('searchProperties', {
            detail: { filters },
            bubbles: true
        });
        document.dispatchEvent(event);

        // Scroll to properties section
        const propertiesSection = document.getElementById('ilanlar');
        if (propertiesSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            Animator.scrollTo(propertiesSection, headerHeight);
        }
    }

    /**
     * Handle reset action
     * @private
     */
    _handleReset() {
        this.reset();
        
        // Clear localStorage
        localStorage.removeItem('gurdalEmlakFilters');
        
        // Dispatch custom event for reset
        const event = new CustomEvent('searchProperties', {
            detail: { filters: { type: 'all', category: 'all', location: '' } },
            bubbles: true
        });
        document.dispatchEvent(event);
        
        // Scroll to properties section
        const propertiesSection = document.getElementById('ilanlar');
        if (propertiesSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            Animator.scrollTo(propertiesSection, headerHeight);
        }
    }

    /**
     * Get current filter values
     * @private
     * @returns {Object}
     */
    _getFilters() {
        let location = '';
        
        // Build location from city and district
        const city = this.citySelect?.value || '';
        const district = this.districtSelect?.value || '';
        
        if (district) {
            location = district;
        } else if (city) {
            location = city;
        }
        
        return {
            type: this.propertyTypeSelect?.value || 'all',
            category: this.propertyCategorySelect?.value || 'all',
            location: location
        };
    }

    /**
     * Reset search filters
     */
    reset() {
        if (this.propertyTypeSelect) this.propertyTypeSelect.value = '';
        if (this.propertyCategorySelect) this.propertyCategorySelect.value = '';
        if (this.citySelect) this.citySelect.value = '';
        if (this.districtSelect) {
            this.districtSelect.value = '';
            this.districtSelect.disabled = true;
        }

        this.propertyService.resetFilters();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchBox;
}
