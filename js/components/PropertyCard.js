// PropertyCard Component - Single Responsibility: Render Property Cards
// Open/Closed Principle: Open for extension, closed for modification
class PropertyCard {
    /**
     * Create a property card HTML element
     * @param {Object} property - Property data object
     * @returns {HTMLElement} Property card element
     */
    static create(property) {
        if (!property) return null;

        const card = document.createElement('div');
        card.className = 'property-card fade-in';
        card.dataset.propertyId = property.id;
        card.dataset.type = property.type;
        card.dataset.category = property.category;

        // Use images array or fallback to single image
        const images = property.images || [property.image];
        const currentImageIndex = 0;

        card.innerHTML = `
            <div class="property-card__image">
                <img src="${this._escapeHTML(images[currentImageIndex])}" 
                     alt="${this._escapeHTML(property.title)}" 
                     loading="lazy"
                     class="property-card__main-image">
                <span class="property-card__badge">${this._getBadgeText(property.type)}</span>
                ${images.length > 1 ? `
                    <button class="property-card__nav property-card__nav--prev" aria-label="Önceki Resim">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="property-card__nav property-card__nav--next" aria-label="Sonraki Resim">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="property-card__indicators">
                        ${images.map((_, index) => `
                            <span class="property-card__indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="property-card__content">
                <h3 class="property-card__title">${this._escapeHTML(property.title)}</h3>
                <div class="property-card__location">
                    <span>📍</span>
                    <span>${this._escapeHTML(property.location)}</span>
                </div>
                ${this._renderDetails(property)}
                <div class="property-card__price">${this._escapeHTML(property.price)}</div>
            </div>
        `;

        // Add image navigation functionality
        if (images.length > 1) {
            this._setupImageNavigation(card, images);
        }

        // Add click event
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking navigation buttons
            if (!e.target.closest('.property-card__nav') && !e.target.closest('.property-card__indicator')) {
                this._handleClick(property);
            }
        });

        return card;
    }

    /**
     * Setup image navigation
     * @private
     */
    static _setupImageNavigation(card, images) {
        const img = card.querySelector('.property-card__main-image');
        const prevBtn = card.querySelector('.property-card__nav--prev');
        const nextBtn = card.querySelector('.property-card__nav--next');
        const indicators = card.querySelectorAll('.property-card__indicator');
        let currentIndex = 0;

        const updateImage = (index) => {
            currentIndex = index;
            img.src = images[index];
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        };

        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            updateImage(newIndex);
        });

        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            updateImage(newIndex);
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                updateImage(index);
            });
        });
    }

    /**
     * Render property details
     * @private
     */
    static _renderDetails(property) {
        const details = [];

        if (property.rooms > 0) {
            details.push(`
                <div class="property-card__detail">
                    <span>🛏️</span>
                    <span>${property.rooms} Oda</span>
                </div>
            `);
        }

        if (property.bathrooms > 0) {
            details.push(`
                <div class="property-card__detail">
                    <span>🚿</span>
                    <span>${property.bathrooms} Banyo</span>
                </div>
            `);
        }

        if (property.area > 0) {
            details.push(`
                <div class="property-card__detail">
                    <span>📏</span>
                    <span>${property.area} m²</span>
                </div>
            `);
        }

        return details.length > 0 
            ? `<div class="property-card__details">${details.join('')}</div>`
            : '';
    }

    /**
     * Get badge text based on property type
     * @private
     */
    static _getBadgeText(type) {
        const badges = {
            'satilik': 'Satılık',
            'kiralik': 'Kiralık'
        };
        return badges[type] || type;
    }

    /**
     * Handle card click
     * @private
     */
    static _handleClick(property) {
        // Mark that we're navigating to detail page
        sessionStorage.setItem('navigatingToDetail', 'true');
        // Navigate to property detail page
        window.location.href = `property-detail.html?id=${property.id}`;
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     */
    static _escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Create multiple property cards
     * @param {Array} properties - Array of property objects
     * @returns {DocumentFragment}
     */
    static createMultiple(properties) {
        const fragment = document.createDocumentFragment();
        
        if (!properties || !Array.isArray(properties)) {
            return fragment;
        }

        properties.forEach(property => {
            const card = this.create(property);
            if (card) {
                fragment.appendChild(card);
            }
        });

        return fragment;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PropertyCard;
}
