// Глобальные переменные
let cafesData = {};
let citiesData = {};
let editingCafeId = null;
let nextId = 1;

// Элементы DOM
const cafeForm = document.getElementById('cafeForm');
const cityForm = document.getElementById('cityForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const deleteBtn = document.getElementById('deleteBtn');
const cafesList = document.getElementById('cafesList');
const citiesList = document.getElementById('citiesList');
const totalCafes = document.getElementById('totalCafes');
const cityFilter = document.getElementById('cityFilter');
const searchFilter = document.getElementById('searchFilter');
const refreshBtn = document.getElementById('refreshBtn');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel loaded');
    loadCafesFromStorage();
    loadCitiesFromStorage();
    setupEventListeners();
    updateTotalCount();
    displayCafesList();
    displayCitiesList();
    updateCityDropdowns();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Форма кафе
    cafeForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    deleteBtn.addEventListener('click', handleDelete);
    
    // Форма городов
    cityForm.addEventListener('submit', handleCityFormSubmit);
    
    // Фильтры
    cityFilter.addEventListener('change', filterCafes);
    searchFilter.addEventListener('input', filterCafes);
    
    // Кнопка обновления
    refreshBtn.addEventListener('click', refreshData);
    
    // Предварительный просмотр изображения
    document.getElementById('cafeImage').addEventListener('input', updateImagePreview);
}

// Загрузка данных о городах из localStorage
function loadCitiesFromStorage() {
    const stored = localStorage.getItem('caaafeCities');
    if (stored) {
        citiesData = JSON.parse(stored);
        console.log('Loaded cities from localStorage:', citiesData);
    } else {
        // Начальные города
        citiesData = {
            'sao-paulo': 'São Paulo',
            'rio-de-janeiro': 'Rio de Janeiro',
            'brasilia': 'Brasília'
        };
        console.log('Using default cities:', citiesData);
        saveCitiesToStorage();
    }
}

// Сохранение данных о городах в localStorage
function saveCitiesToStorage() {
    localStorage.setItem('caaafeCities', JSON.stringify(citiesData));
    console.log('Saved cities to localStorage:', citiesData);
}

// Обработка формы добавления города
function handleCityFormSubmit(e) {
    e.preventDefault();
    
    const cityKey = document.getElementById('cityKey').value.trim().toLowerCase();
    const cityDisplayName = document.getElementById('cityDisplayName').value.trim();
    
    // Валидация
    if (!cityKey || !cityDisplayName) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }
    
    // Проверка формата ключа города
    if (!/^[a-z0-9-]+$/.test(cityKey)) {
        showNotification('Chave da cidade deve conter apenas letras minúsculas, números e hífens!', 'error');
        return;
    }
    
    // Проверка существования города
    if (citiesData[cityKey]) {
        showNotification('Cidade já existe!', 'error');
        return;
    }
    
    // Добавление города
    citiesData[cityKey] = cityDisplayName;
    
    // Создание пустого массива для кафе этого города
    if (!cafesData[cityKey]) {
        cafesData[cityKey] = [];
    }
    
    // Сохранение
    saveCitiesToStorage();
    saveCafesToStorage();
    
    // Обновление UI
    cityForm.reset();
    displayCitiesList();
    updateCityDropdowns();
    
    showNotification('Cidade adicionada com sucesso!', 'success');
}

// Удаление города
function deleteCity(cityKey) {
    if (confirm(`Tem certeza que deseja excluir a cidade "${citiesData[cityKey]}"? Todos os cafés desta cidade também serão excluídos!`)) {
        // Удаляем город
        delete citiesData[cityKey];
        
        // Удаляем все кафе этого города
        delete cafesData[cityKey];
        
        // Сохраняем изменения
        saveCitiesToStorage();
        saveCafesToStorage();
        
        // Обновляем UI
        displayCitiesList();
        updateCityDropdowns();
        updateTotalCount();
        displayCafesList();
        
        showNotification('Cidade excluída com sucesso!', 'success');
    }
}

// Отображение списка городов
function displayCitiesList() {
    citiesList.innerHTML = '';
    
    Object.entries(citiesData).forEach(([cityKey, cityName]) => {
        const cityElement = document.createElement('div');
        cityElement.className = 'city-item';
        
        cityElement.innerHTML = `
            <div class="city-info">
                <span class="city-key">${cityKey}</span>
                <span class="city-name">${cityName}</span>
            </div>
            <div class="city-actions">
                <button class="btn btn-tiny btn-danger" onclick="deleteCity('${cityKey}')">
                    🗑️
                </button>
            </div>
        `;
        
        citiesList.appendChild(cityElement);
    });
}

// Обновление выпадающих списков городов
function updateCityDropdowns() {
    const cafeCitySelect = document.getElementById('cafeCity');
    const cityFilterSelect = document.getElementById('cityFilter');
    
    // Очищаем существующие опции (кроме первой)
    cafeCitySelect.innerHTML = '<option value="">Selecione a cidade</option>';
    cityFilterSelect.innerHTML = '<option value="">Todas as cidades</option>';
    
    // Добавляем города
    Object.entries(citiesData).forEach(([cityKey, cityName]) => {
        // Для формы кафе
        const cafeOption = document.createElement('option');
        cafeOption.value = cityKey;
        cafeOption.textContent = cityName;
        cafeCitySelect.appendChild(cafeOption);
        
        // Для фильтра
        const filterOption = document.createElement('option');
        filterOption.value = cityKey;
        filterOption.textContent = cityName;
        cityFilterSelect.appendChild(filterOption);
    });
}

// Функция обновления данных
function refreshData() {
    console.log('Refreshing data...');
    loadCafesFromStorage();
    loadCitiesFromStorage();
    updateTotalCount();
    displayCafesList();
    displayCitiesList();
    updateCityDropdowns();
    showNotification('Dados atualizados!', 'success');
}

// Загрузка данных из localStorage
function loadCafesFromStorage() {
    const stored = localStorage.getItem('caaafeCafes');
    if (stored) {
        cafesData = JSON.parse(stored);
        console.log('Loaded from localStorage:', cafesData);
        // Находим максимальный ID для генерации новых
        nextId = Math.max(...Object.values(cafesData).flat().map(cafe => cafe.id), 0) + 1;
    } else {
        // Загружаем начальные данные
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
        console.log('Using default data:', cafesData);
        saveCafesToStorage();
    }
}

// Сохранение данных в localStorage
function saveCafesToStorage() {
    localStorage.setItem('caaafeCafes', JSON.stringify(cafesData));
    console.log('Saved to localStorage:', cafesData);
}

// Обработка отправки формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    const cafeData = {
        id: editingCafeId || nextId,
        name: document.getElementById('cafeName').value,
        city: document.getElementById('cafeCity').value,
        description: document.getElementById('cafeDescription').value,
        shortDescription: document.getElementById('cafeShortDescription').value,
        image: document.getElementById('cafeImage').value,
        gallery: document.getElementById('cafeGallery').value
            .split('\n')
            .filter(url => url.trim())
            .map(url => url.trim()),
        hours: {
            'Segunda a Sexta': document.getElementById('hoursMonday').value || 'Fechado',
            'Sábado': document.getElementById('hoursSaturday').value || 'Fechado',
            'Domingo': document.getElementById('hoursSunday').value || 'Fechado'
        }
    };
    
    if (editingCafeId) {
        // Редактирование существующего кафе
        updateCafe(cafeData);
    } else {
        // Добавление нового кафе
        addCafe(cafeData);
        nextId++;
    }
    
    resetForm();
    updateTotalCount();
    displayCafesList();
}

// Добавление нового кафе
function addCafe(cafeData) {
    if (!cafesData[cafeData.city]) {
        cafesData[cafeData.city] = [];
    }
    
    cafesData[cafeData.city].push(cafeData);
    saveCafesToStorage();
    
    showNotification('Café adicionado com sucesso!', 'success');
}

// Обновление существующего кафе
function updateCafe(cafeData) {
    // Удаляем старое кафе
    removeCafeById(editingCafeId);
    // Добавляем обновленное
    addCafe(cafeData);
    
    showNotification('Café atualizado com sucesso!', 'success');
}

// Удаление кафе по ID
function removeCafeById(id) {
    for (const city in cafesData) {
        cafesData[city] = cafesData[city].filter(cafe => cafe.id !== id);
    }
}

// Удаление кафе
function handleDelete() {
    if (!editingCafeId) return;
    
    if (confirm('Tem certeza que deseja excluir este café?')) {
        removeCafeById(editingCafeId);
        saveCafesToStorage();
        resetForm();
        updateTotalCount();
        displayCafesList();
        
        showNotification('Café excluído com sucesso!', 'success');
    }
}

// Редактирование кафе
function editCafe(cafe) {
    editingCafeId = cafe.id;
    
    // Заполняем форму
    document.getElementById('cafeId').value = cafe.id;
    document.getElementById('cafeName').value = cafe.name;
    document.getElementById('cafeCity').value = cafe.city;
    document.getElementById('cafeDescription').value = cafe.description;
    document.getElementById('cafeShortDescription').value = cafe.shortDescription;
    document.getElementById('cafeImage').value = cafe.image;
    document.getElementById('cafeGallery').value = cafe.gallery.join('\n');
    document.getElementById('hoursMonday').value = cafe.hours['Segunda a Sexta'];
    document.getElementById('hoursSaturday').value = cafe.hours['Sábado'];
    document.getElementById('hoursSunday').value = cafe.hours['Domingo'];
    
    // Обновляем UI
    formTitle.textContent = '✏️ Editar Café';
    submitBtn.textContent = 'Atualizar Café';
    cancelBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'inline-block';
    
    // Показываем предварительный просмотр изображения
    updateImagePreview();
    
    // Прокручиваем к форме
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Отмена редактирования
function cancelEdit() {
    resetForm();
}

// Сброс формы
function resetForm() {
    editingCafeId = null;
    cafeForm.reset();
    formTitle.textContent = '➕ Adicionar Novo Café';
    submitBtn.textContent = 'Salvar Café';
    cancelBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    document.getElementById('imagePreview').style.display = 'none';
}

// Обновление предварительного просмотра изображения
function updateImagePreview() {
    const imageUrl = document.getElementById('cafeImage').value;
    const preview = document.getElementById('imagePreview');
    
    if (imageUrl && isValidUrl(imageUrl)) {
        preview.src = imageUrl;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

// Проверка валидности URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Отображение списка кафе
function displayCafesList() {
    console.log('Displaying cafes list...');
    cafesList.innerHTML = '';
    
    const allCafes = getAllCafes();
    console.log('All cafes:', allCafes);
    
    const filteredCafes = filterCafesList(allCafes);
    console.log('Filtered cafes:', filteredCafes);
    
    if (filteredCafes.length === 0) {
        cafesList.innerHTML = '<p class="no-cafes">Nenhum café encontrado</p>';
        return;
    }
    
    filteredCafes.forEach(cafe => {
        const cafeElement = createCafeElement(cafe);
        cafesList.appendChild(cafeElement);
    });
}

// Получение всех кафе
function getAllCafes() {
    const allCafes = [];
    for (const city in cafesData) {
        if (cafesData[city] && Array.isArray(cafesData[city])) {
            cafesData[city].forEach(cafe => {
                allCafes.push({ ...cafe, cityName: citiesData[city] || city });
            });
        }
    }
    return allCafes;
}

// Создание элемента кафе
function createCafeElement(cafe) {
    const cafeDiv = document.createElement('div');
    cafeDiv.className = 'cafe-item';
    
    cafeDiv.innerHTML = `
        <img src="${cafe.image}" alt="${cafe.name}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
        <div class="cafe-info">
            <div class="cafe-name">${cafe.name}</div>
            <div class="cafe-city">${cafe.cityName}</div>
            <div class="cafe-description">${cafe.shortDescription}</div>
        </div>
        <div class="cafe-actions">
            <button class="btn btn-small btn-edit" onclick="editCafeFromList(${JSON.stringify(cafe).replace(/"/g, '&quot;')})">
                ✏️ Editar
            </button>
            <button class="btn btn-small btn-delete" onclick="deleteCafeFromList(${cafe.id})">
                🗑️ Excluir
            </button>
        </div>
    `;
    
    return cafeDiv;
}

// Глобальные функции для вызова из HTML
window.editCafeFromList = editCafe;
window.deleteCafeFromList = function(id) {
    if (confirm('Tem certeza que deseja excluir este café?')) {
        removeCafeById(id);
        saveCafesToStorage();
        updateTotalCount();
        displayCafesList();
        showNotification('Café excluído com sucesso!', 'success');
    }
};

// Фильтрация кафе
function filterCafes() {
    console.log('Filtering cafes...');
    displayCafesList();
}

// Фильтрация списка кафе
function filterCafesList(cafes) {
    let filtered = cafes;
    
    // Фильтр по городу
    const selectedCity = cityFilter.value;
    console.log('Selected city:', selectedCity);
    
    if (selectedCity) {
        filtered = filtered.filter(cafe => cafe.city === selectedCity);
        console.log('After city filter:', filtered);
    }
    
    // Фильтр по поиску
    const searchTerm = searchFilter.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(cafe => 
            cafe.name.toLowerCase().includes(searchTerm) ||
            cafe.description.toLowerCase().includes(searchTerm) ||
            cafe.shortDescription.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

// Обновление общего количества кафе
function updateTotalCount() {
    const total = Object.values(cafesData).reduce((sum, cafes) => sum + (Array.isArray(cafes) ? cafes.length : 0), 0);
    totalCafes.textContent = total;
    console.log('Total cafes:', total);
}

// Уведомления
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Цвета для разных типов
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
