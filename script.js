// Данные о кафе для каждого города
let cafesData = {};
let citiesData = {};

// Функция для загрузки данных из localStorage
function loadCafesData() {
    const stored = localStorage.getItem('caaafeCafes');
    if (stored) {
        cafesData = JSON.parse(stored);
    } else {
        // Fallback данные, если localStorage пуст
        cafesData = {
            'sao-paulo': [
                {
                    id: 1,
                    name: 'Café do Centro',
                    description: 'Um café tradicional no coração de São Paulo, conhecido por seus pães artesanais e café de qualidade.',
                    shortDescription: 'Café tradicional com pães artesanais',
                    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
                    gallery: [
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop'
                    ],
                    hours: {
                        'Segunda a Sexta': '7:00 - 20:00',
                        'Sábado': '8:00 - 18:00',
                        'Domingo': '8:00 - 16:00'
                    }
                }
            ],
            'rio-de-janeiro': [],
            'brasilia': []
        };
    }
}

// Функция для загрузки городов из localStorage
function loadCitiesData() {
    const stored = localStorage.getItem('caaafeCities');
    if (stored) {
        citiesData = JSON.parse(stored);
    } else {
        // Fallback города, если localStorage пуст
        citiesData = {
            'sao-paulo': 'São Paulo',
            'rio-de-janeiro': 'Rio de Janeiro',
            'brasilia': 'Brasília'
        };
    }
}

// Функция для обновления выпадающего списка городов
function updateCityDropdown() {
    const citySelect = document.getElementById('citySelect');
    if (!citySelect) return;
    
    // Очищаем существующие опции
    citySelect.innerHTML = '';
    
    // Добавляем города
    Object.entries(citiesData).forEach(([cityKey, cityName]) => {
        const option = document.createElement('option');
        option.value = cityKey;
        option.textContent = cityName;
        citySelect.appendChild(option);
    });
}

// Элементы DOM
const citySelect = document.getElementById('citySelect');
const cafesContainer = document.getElementById('cafesContainer');
const cafeModal = document.getElementById('cafeModal');
const cafeDetails = document.getElementById('cafeDetails');
const closeBtn = document.querySelector('.close');

// Переменные для мобильных жестов
let startY = 0;
let currentY = 0;
let isDragging = false;

// Функция для отображения кафе
function displayCafes(city) {
    const cafes = cafesData[city] || [];
    cafesContainer.innerHTML = '';
    
    cafes.forEach(cafe => {
        const cafeCard = document.createElement('div');
        cafeCard.className = 'cafe-card';
        cafeCard.onclick = () => showCafeDetails(cafe);
        
        cafeCard.innerHTML = `
            <img src="${cafe.image}" alt="${cafe.name}" class="cafe-image">
            <div class="cafe-info">
                <h3 class="cafe-name">${cafe.name}</h3>
                <p class="cafe-description">${cafe.shortDescription}</p>
            </div>
        `;
        
        cafesContainer.appendChild(cafeCard);
    });
}

// Функция для показа деталей кафе
function showCafeDetails(cafe) {
    const hoursHTML = Object.entries(cafe.hours)
        .map(([day, time]) => `<p><strong>${day}:</strong> ${time}</p>`)
        .join('');
    
    const galleryHTML = cafe.gallery
        .map(img => `<img src="${img}" alt="${cafe.name}">`)
        .join('');
    
    cafeDetails.innerHTML = `
        <div class="cafe-details">
            <h2>${cafe.name}</h2>
            <img src="${cafe.image}" alt="${cafe.name}">
            <div class="description">
                <p>${cafe.description}</p>
            </div>
            <div class="hours">
                <h3>Horário de Funcionamento</h3>
                ${hoursHTML}
            </div>
            <div class="gallery">
                <h3>Galeria de Fotos</h3>
                ${galleryHTML}
            </div>
        </div>
    `;
    
    cafeModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем скролл
}

// Функция для закрытия модального окна
function closeModal() {
    cafeModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем скролл
}

// Мобильные жесты для закрытия модального окна
function initMobileGestures() {
    const modalContent = document.querySelector('.modal-content');
    
    // Touch события
    modalContent.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    modalContent.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 50) {
            modalContent.style.transform = `translateY(${deltaY}px)`;
        }
    });
    
    modalContent.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const deltaY = currentY - startY;
        
        if (deltaY > 100) {
            closeModal();
        } else {
            modalContent.style.transform = 'translateY(0)';
        }
        
        isDragging = false;
    });
}

// Предотвращение зума на мобильных устройствах
function preventZoom() {
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', (e) => {
        e.preventDefault();
    });
}

// Функция для обновления данных в реальном времени
function refreshData() {
    loadCafesData();
    loadCitiesData();
    updateCityDropdown();
    const currentCity = citySelect.value;
    displayCafes(currentCity);
}

// Обработчики событий
citySelect.addEventListener('change', (e) => {
    displayCafes(e.target.value);
});

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === cafeModal) {
        closeModal();
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCafesData();
    loadCitiesData();
    updateCityDropdown();
    displayCafes('sao-paulo'); // По умолчанию показываем Сан-Паулу
    initMobileGestures();
    preventZoom();
    
    // Добавляем haptic feedback для мобильных устройств
    if ('vibrate' in navigator) {
        document.querySelectorAll('.cafe-card').forEach(card => {
            card.addEventListener('click', () => {
                navigator.vibrate(50);
            });
        });
    }
    
    // Обновляем данные каждые 5 секунд для синхронизации с админ панелью
    setInterval(refreshData, 5000);
});
