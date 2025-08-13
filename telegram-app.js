// Telegram Web App для Caaafe
class CaaafeTelegramApp {
    constructor() {
        this.cafesData = {};
        this.citiesData = {
            'sao-paulo': 'São Paulo',
            'rio-de-janeiro': 'Rio de Janeiro',
            'brasilia': 'Brasília'
        };
        this.currentCity = 'sao-paulo';
        this.init();
    }
    
    init() {
        this.loadData();
        this.updateCityDropdown();
        this.displayCafes();
        this.setupEventListeners();
        this.setupTelegramIntegration();
        
        // Auto-refresh data every 5 seconds
        setInterval(() => this.refreshData(), 5000);
    }
    
    loadData() {
        // Load cafes from localStorage
        const storedCafes = localStorage.getItem('cafesData');
        if (storedCafes) {
            try {
                this.cafesData = JSON.parse(storedCafes);
            } catch (e) {
                console.error('Error parsing cafes data:', e);
                this.cafesData = {};
            }
        }
        
        // Load cities from localStorage
        const storedCities = localStorage.getItem('citiesData');
        if (storedCities) {
            try {
                const additionalCities = JSON.parse(storedCities);
                this.citiesData = { ...this.citiesData, ...additionalCities };
            } catch (e) {
                console.error('Error parsing cities data:', e);
            }
        }
    }
    
    refreshData() {
        this.loadData();
        this.updateCityDropdown();
        this.displayCafes();
    }
    
    updateCityDropdown() {
        const citySelect = document.getElementById('citySelect');
        if (!citySelect) return;
        
        citySelect.innerHTML = '';
        Object.entries(this.citiesData).forEach(([cityKey, cityName]) => {
            const option = document.createElement('option');
            option.value = cityKey;
            option.textContent = cityName;
            citySelect.appendChild(option);
        });
        citySelect.value = this.currentCity;
    }
    
    displayCafes() {
        const container = document.getElementById('cafesContainer');
        if (!container) return;
        
        const cityCafes = this.cafesData[this.currentCity] || [];
        
        if (cityCafes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum café encontrado</h3>
                    <p>Não há cafés cadastrados em ${this.citiesData[this.currentCity]} ainda.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = cityCafes.map(cafe => this.createCafeElement(cafe)).join('');
    }
    
    createCafeElement(cafe) {
        const rating = cafe.rating || '4.5';
        const ratingStars = '⭐'.repeat(Math.floor(rating));
        
        return `
            <div class="cafe-card" onclick="window.caaafeApp.showCafeDetails('${cafe.id}')">
                <h3>${cafe.name}</h3>
                <p>${cafe.description || 'Descrição não disponível'}</p>
                <div class="rating">
                    ${ratingStars} ${rating}
                </div>
            </div>
        `;
    }
    
    showCafeDetails(cafeId) {
        const cafe = this.findCafeById(cafeId);
        if (!cafe) return;
        
        // Haptic feedback
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        
        const modal = document.getElementById('cafeModal');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalContent) return;
        
        // Populate modal content
        modalContent.innerHTML = `
            <div class="modal-header">
                <button class="back-button" onclick="window.caaafeApp.closeModal()">← Voltar</button>
                <h3 class="modal-title">${cafe.name}</h3>
                <button class="close-button" onclick="window.caaafeApp.closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="cafe-details">
                    <h2>${cafe.name}</h2>
                    <p class="description">${cafe.description || 'Descrição não disponível'}</p>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <h4>Cidade</h4>
                            <p>${this.citiesData[cafe.city] || cafe.cityName || 'N/A'}</p>
                        </div>
                        <div class="info-item">
                            <h4>Horário</h4>
                            <p>${cafe.hours || 'Horário não disponível'}</p>
                        </div>
                        <div class="info-item">
                            <h4>Avaliação</h4>
                            <p>${cafe.rating || '4.5'} ⭐</p>
                        </div>
                        <div class="info-item">
                            <h4>Endereço</h4>
                            <p>${cafe.address || 'Endereço não disponível'}</p>
                        </div>
                    </div>
                    
                    <div class="cafe-photos">
                        <h3>Fotos</h3>
                        <div class="photo-grid">
                            <div class="photo-item">📸 Foto 1</div>
                            <div class="photo-item">📸 Foto 2</div>
                            <div class="photo-item">📸 Foto 3</div>
                            <div class="photo-item">📸 Foto 4</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Setup Telegram BackButton
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => this.closeModal());
        }
    }
    
    findCafeById(cafeId) {
        for (const cityCafes of Object.values(this.cafesData)) {
            const cafe = cityCafes.find(c => c.id === cafeId);
            if (cafe) return cafe;
        }
        return null;
    }
    
    closeModal() {
        const modal = document.getElementById('cafeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Hide Telegram BackButton
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.BackButton) {
            window.Telegram.WebApp.BackButton.hide();
        }
        
        // Haptic feedback
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
    
    setupEventListeners() {
        const citySelect = document.getElementById('citySelect');
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                this.currentCity = e.target.value;
                this.displayCafes();
                
                // Haptic feedback
                if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.selectionChanged();
                }
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('cafeModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    setupTelegramIntegration() {
        if (window.Telegram && window.Telegram.WebApp) {
            // Set up MainButton
            if (window.Telegram.WebApp.MainButton) {
                window.Telegram.WebApp.MainButton.text = 'Fechar App';
                window.Telegram.WebApp.MainButton.onClick(() => {
                    window.Telegram.WebApp.close();
                });
            }
            
            console.log('Telegram WebApp integration setup complete');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.caaafeApp = new CaaafeTelegramApp();
});
