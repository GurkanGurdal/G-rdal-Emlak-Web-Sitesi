// Property Detail Page Script
class PropertyDetail {
    constructor() {
        this.propertyService = new PropertyService();
        this.currentImageIndex = 0;
        this.images = [];
        this.propertyId = this._getPropertyIdFromUrl();
        this.property = null;
        
        this._init();
    }

    /**
     * Initialize property detail page
     * @private
     */
    _init() {
        if (!this.propertyId) {
            window.location.href = 'index.html';
            return;
        }

        this.property = this.propertyService.getPropertyById(this.propertyId);
        
        if (!this.property) {
            window.location.href = 'index.html';
            return;
        }

        this.images = this.property.images || [];
        this._loadPropertyData();
        this._setupGallery();
        this._setupNavigation();
    }

    /**
     * Get property ID from URL
     * @private
     * @returns {number|null}
     */
    _getPropertyIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        return id ? parseInt(id) : null;
    }

    /**
     * Load property data into page
     * @private
     */
    _loadPropertyData() {
        // Update page title
        document.title = `${this.property.title} - Gürdal Emlak`;
        
        // Update breadcrumb
        document.getElementById('breadcrumbTitle').textContent = this.property.title;
        
        // Update badge
        const badge = document.getElementById('propertyBadge');
        badge.textContent = this.property.type === 'satilik' ? 'Satılık' : 'Kiralık';
        
        // Update title and location
        document.getElementById('propertyTitle').textContent = this.property.title;
        document.getElementById('propertyLocation').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z" fill="currentColor"/>
                <path d="M8 1C5.23858 1 3 3.23858 3 6C3 9.25 8 15 8 15C8 15 13 9.25 13 6C13 3.23858 10.7614 1 8 1Z" fill="currentColor"/>
            </svg>
            ${this.property.location}
        `;
        
        // Update price
        document.getElementById('propertyPrice').textContent = this.property.price;
        
        // Update features
        document.getElementById('propertyRooms').textContent = this.property.rooms || '-';
        document.getElementById('propertyBathrooms').textContent = this.property.bathrooms || '-';
        document.getElementById('propertyArea').textContent = this.property.area || '-';
    }

    /**
     * Setup image gallery
     * @private
     */
    _setupGallery() {
        if (this.images.length === 0) return;
        
        // Set main image
        this._updateMainImage(0);
        
        // Setup fullscreen on main image click
        const mainImage = document.getElementById('mainImage');
        mainImage.addEventListener('click', () => this._openFullscreen());
        
        // Create thumbnails
        const thumbsContainer = document.getElementById('galleryThumbs');
        thumbsContainer.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery__thumb';
            if (index === 0) thumb.classList.add('active');
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `${this.property.title} - Görsel ${index + 1}`;
            
            thumb.appendChild(img);
            thumb.addEventListener('click', () => this._updateMainImage(index));
            thumbsContainer.appendChild(thumb);
        });
        
        // Setup navigation buttons
        document.getElementById('prevImage').addEventListener('click', () => this._navigateImage(-1));
        document.getElementById('nextImage').addEventListener('click', () => this._navigateImage(1));
        
        // Setup fullscreen modal
        this._setupFullscreenModal();
    }

    /**
     * Update main image
     * @private
     * @param {number} index
     */
    _updateMainImage(index) {
        this.currentImageIndex = index;
        const mainImage = document.getElementById('mainImage');
        mainImage.src = this.images[index];
        mainImage.alt = `${this.property.title} - Görsel ${index + 1}`;
        
        // Update active thumbnail
        const thumbs = document.querySelectorAll('.gallery__thumb');
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    /**
     * Navigate through images
     * @private
     * @param {number} direction - -1 for previous, 1 for next
     */
    _navigateImage(direction) {
        let newIndex = this.currentImageIndex + direction;
        
        if (newIndex < 0) {
            newIndex = this.images.length - 1;
        } else if (newIndex >= this.images.length) {
            newIndex = 0;
        }
        
        this._updateMainImage(newIndex);
    }

    /**
     * Setup navigation
     * @private
     */
    _setupNavigation() {
        new Navigation('#navToggle', '#navMenu');
    }
    
    /**
     * Setup fullscreen modal
     * @private
     */
    _setupFullscreenModal() {
        const modal = document.getElementById('fullscreenModal');
        const closeBtn = document.getElementById('closeFullscreen');
        const fullscreenImage = document.getElementById('fullscreenImage');
        const prevBtn = document.getElementById('fullscreenPrevImage');
        const nextBtn = document.getElementById('fullscreenNextImage');
        
        this.isZoomed = false;
        this.scale = 1;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        
        // Close on button click
        closeBtn.addEventListener('click', () => this._closeFullscreen());
        
        // Navigate images in fullscreen
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._navigateFullscreenImage(-1);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._navigateFullscreenImage(1);
        });
        
        // Close on background click (only when not zoomed)
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !this.isZoomed) {
                this._closeFullscreen();
            }
        });
        
        // Toggle zoom on image click
        fullscreenImage.addEventListener('click', (e) => {
            if (this.isDragging || this.hasDragged) {
                this.hasDragged = false;
                return;
            }
            e.stopPropagation();
            this._toggleZoom();
        });
        
        // Wheel zoom
        fullscreenImage.addEventListener('wheel', (e) => {
            if (!this.isZoomed) return;
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.scale = Math.min(Math.max(1, this.scale + delta), 5);
            
            if (this.scale === 1) {
                this._resetZoom();
            } else {
                this._applyTransform();
            }
        });
        
        // Drag to pan when zoomed
        fullscreenImage.addEventListener('mousedown', (e) => {
            if (!this.isZoomed || e.button !== 0) return;
            e.preventDefault();
            this.isDragging = true;
            this.hasDragged = false;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
            fullscreenImage.style.cursor = 'grabbing';
        });
        
        fullscreenImage.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            
            const deltaX = Math.abs(e.clientX - this.dragStartX);
            const deltaY = Math.abs(e.clientY - this.dragStartY);
            
            if (deltaX > 5 || deltaY > 5) {
                this.hasDragged = true;
            }
            
            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this._applyTransform();
        });
        
        fullscreenImage.addEventListener('mouseup', (e) => {
            if (this.isDragging && e.button === 0) {
                this.isDragging = false;
                if (this.isZoomed) {
                    fullscreenImage.style.cursor = 'grab';
                }
            }
        });
        
        fullscreenImage.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                if (this.isZoomed) {
                    fullscreenImage.style.cursor = 'grab';
                }
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this._closeFullscreen();
            }
        });
    }
    
    /**
     * Open fullscreen image
     * @private
     */
    _openFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        const fullscreenImage = document.getElementById('fullscreenImage');
        const mainImage = document.getElementById('mainImage');
        const hint = document.getElementById('zoomHint');
        
        fullscreenImage.src = mainImage.src;
        fullscreenImage.alt = mainImage.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Show hint animation
        hint.style.animation = 'none';
        setTimeout(() => {
            hint.style.animation = 'fadeInOut 4s ease-in-out';
        }, 10);
        
        // Reset zoom
        this._resetZoom();
    }
    
    /**
     * Close fullscreen image
     * @private
     */
    _closeFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this._resetZoom();
    }
    
    /**
     * Toggle zoom
     * @private
     */
    _toggleZoom() {
        const fullscreenImage = document.getElementById('fullscreenImage');
        
        if (!this.isZoomed) {
            this.isZoomed = true;
            this.scale = 2;
            fullscreenImage.classList.add('zoomed');
            this._applyTransform();
        } else {
            this._resetZoom();
        }
    }
    
    /**
     * Reset zoom
     * @private
     */
    _resetZoom() {
        const fullscreenImage = document.getElementById('fullscreenImage');
        this.isZoomed = false;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        fullscreenImage.classList.remove('zoomed');
        fullscreenImage.style.transform = '';
        fullscreenImage.style.cursor = 'zoom-in';
    }
    
    /**
     * Apply transform
     * @private
     */
    _applyTransform() {
        const fullscreenImage = document.getElementById('fullscreenImage');
        fullscreenImage.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }
    
    /**
     * Navigate fullscreen image
     * @private
     * @param {number} direction - 1 for next, -1 for previous
     */
    _navigateFullscreenImage(direction) {
        if (this.images.length <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length;
        
        const fullscreenImage = document.getElementById('fullscreenImage');
        fullscreenImage.src = this.images[this.currentImageIndex];
        fullscreenImage.alt = `${this.property.title} - Görsel ${this.currentImageIndex + 1}`;
        
        // Update main gallery as well
        this._updateMainImage(this.currentImageIndex);
        
        // Reset zoom when changing images
        this._resetZoom();
    }
}

// Initialize property detail page
document.addEventListener('DOMContentLoaded', () => {
    new PropertyDetail();
});
