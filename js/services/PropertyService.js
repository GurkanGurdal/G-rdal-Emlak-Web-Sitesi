// PropertyService - Single Responsibility: Property Data Management
// Interface Segregation & Dependency Inversion: Depends on abstractions
class PropertyService {
    constructor() {
        this.properties = this._getMockProperties();
        this.filters = {
            type: 'all',
            category: 'all',
            location: ''
        };
    }

    /**
     * Get all properties
     * @returns {Array} Array of property objects
     */
    getAllProperties() {
        return [...this.properties];
    }

    /**
     * Get filtered properties
     * @returns {Array} Filtered property array
     */
    getFilteredProperties() {
        return this.properties.filter(property => {
            const matchesType = this.filters.type === 'all' || property.type === this.filters.type;
            const matchesCategory = this.filters.category === 'all' || property.category === this.filters.category;
            const matchesLocation = !this.filters.location || 
                property.location.toLowerCase().includes(this.filters.location.toLowerCase());

            return matchesType && matchesCategory && matchesLocation;
        });
    }

    /**
     * Set filter
     * @param {string} filterType - Type of filter (type, category, location)
     * @param {string} value - Filter value
     */
    setFilter(filterType, value) {
        if (this.filters.hasOwnProperty(filterType)) {
            this.filters[filterType] = value;
        }
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        this.filters = {
            type: 'all',
            category: 'all',
            location: ''
        };
    }

    /**
     * Get property by ID
     * @param {number} id - Property ID
     * @returns {Object|null}
     */
    getPropertyById(id) {
        return this.properties.find(prop => prop.id === id) || null;
    }

    /**
     * Mock property data - In production, this would fetch from API
     * @private
     */
    _getMockProperties() {
        return [
            {
                id: 1,
                title: '3+1 Lüks Daire',
                type: 'satilik',
                category: 'konut',
                location: 'Muratpaşa, Antalya',
                price: '3.500.000 ₺',
                rooms: 3,
                bathrooms: 2,
                area: 120,
                images: [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 2,
                title: 'Merkezi Ofis',
                type: 'kiralik',
                category: 'isyeri',
                location: 'Merkez, Isparta',
                price: '15.000 ₺/ay',
                rooms: 5,
                bathrooms: 2,
                area: 200,
                images: [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 3,
                title: 'Deniz Manzaralı Villa',
                type: 'satilik',
                category: 'konut',
                location: 'Konyaaltı, Antalya',
                price: '8.750.000 ₺',
                rooms: 5,
                bathrooms: 4,
                area: 350,
                images: [
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1566908829550-e6551b00979b?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 4,
                title: 'Yatırımlık Arsa',
                type: 'satilik',
                category: 'arsa',
                location: 'Aksu, Isparta',
                price: '1.250.000 ₺',
                rooms: 0,
                bathrooms: 0,
                area: 500,
                images: [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 5,
                title: '2+1 Kiralık Daire',
                type: 'kiralik',
                category: 'konut',
                location: 'Alanya, Antalya',
                price: '18.000 ₺/ay',
                rooms: 2,
                bathrooms: 1,
                area: 95,
                images: [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 6,
                title: 'Cadde Üzeri Dükkan',
                type: 'kiralik',
                category: 'isyeri',
                location: 'Eğirdir, Isparta',
                price: '12.000 ₺/ay',
                rooms: 1,
                bathrooms: 1,
                area: 80,
                images: [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 7,
                title: 'Bahçeli Müstakil Ev',
                type: 'satilik',
                category: 'konut',
                location: 'Kepez, Antalya',
                price: '4.500.000 ₺',
                rooms: 4,
                bathrooms: 3,
                area: 280,
                images: [
                    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 8,
                title: 'İmarlı Arsa',
                type: 'satilik',
                category: 'arsa',
                location: 'Yalvaç, Isparta',
                price: '950.000 ₺',
                rooms: 0,
                bathrooms: 0,
                area: 1000,
                images: [
                    'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop'
                ]
            },
            {
                id: 9,
                title: 'Havuzlu Sitede 4+1',
                type: 'kiralik',
                category: 'konut',
                location: 'Manavgat, Antalya',
                price: '25.000 ₺/ay',
                rooms: 4,
                bathrooms: 2,
                area: 165,
                images: [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop'
                ]
            }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PropertyService;
}
