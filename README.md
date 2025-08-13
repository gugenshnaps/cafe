# ☕ Caaafe - Telegram Web App

**Caaafe** - это веб-приложение для Telegram, которое помогает пользователям находить лучшие кафе в городах Бразилии.

## 🌟 Особенности

- **🌍 Множество городов** - Сан-Паулу, Рио-де-Жанейро, Бразилиа и возможность добавления новых
- **☕ Подробная информация** - описание, время работы, галерея фотографий
- **📱 Telegram интеграция** - нативная поддержка Telegram Web App
- **🔐 Админ панель** - управление кафе и городами в реальном времени
- **🎨 Адаптивный дизайн** - оптимизировано для мобильных устройств

## 🚀 Быстрый старт

### Требования
- Node.js (версия 14 или выше)
- Git

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/gugenshnaps/cafe.git
cd cafe
```

2. **Установите зависимости** (если есть)
```bash
npm install
```

3. **Запустите сервер**
```bash
node server.js
```

4. **Откройте приложение**
- **Основное приложение**: `http://localhost:7000`
- **Админ панель**: `http://localhost:7000/admin`
- **Telegram версия**: `http://localhost:7000/telegram`

## 📱 Telegram Web App

### Особенности Telegram версии
- **Нативная интеграция** с Telegram
- **Haptic feedback** для мобильных устройств
- **Кнопки Telegram** (MainButton, BackButton)
- **Автоматическая тема** (светлая/темная)
- **Оптимизированный UI** для Telegram

### Использование в Telegram
1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Настройте Web App с URL вашего сервера
3. Пользователи смогут открывать приложение прямо в Telegram

## 🔐 Админ панель

### Функциональность
- **➕ Добавление кафе** - название, описание, фото, время работы
- **🌍 Управление городами** - добавление и удаление городов
- **✏️ Редактирование** существующих кафе
- **🗑️ Удаление** кафе и городов
- **🔍 Поиск и фильтрация** по городу и названию

### Доступ
- **URL**: `http://localhost:7000/admin`
- **Безопасность**: В продакшене рекомендуется добавить аутентификацию

## 🏗️ Архитектура

### Структура проекта
```
cafe/
├── index.html          # Основное приложение
├── admin.html          # Админ панель
├── telegram.html       # Telegram версия
├── styles.css          # Основные стили
├── admin.css           # Стили админ панели
├── telegram-styles.css # Стили Telegram версии
├── script.js           # Основная логика
├── admin.js            # Логика админ панели
├── telegram-app.js     # Telegram интеграция
├── telegram-config.js  # Конфигурация Telegram
├── .github/workflows/deploy.yml # GitHub Actions
├── server.js           # HTTP сервер
└── README.md           # Документация
```

### Технологии
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js (простой HTTP сервер)
- **Хранение**: localStorage (в продакшене рекомендуется база данных)
- **Telegram**: Telegram Web App API
- **Deploy**: GitHub Actions + GitHub Pages

## 🌐 Развертывание

### Локальная разработка
```bash
node server.js
```

### Продакшен
1. **Хостинг**: GitHub Pages (автоматически)
2. **База данных**: localStorage (в продакшене рекомендуется база данных)
3. **Аутентификация**: JWT токены или OAuth
4. **SSL**: Автоматически через GitHub Pages

### Переменные окружения
```bash
PORT=7000
NODE_ENV=production
```

## 📊 API Endpoints

### Основные
- `GET /` - Основное приложение
- `GET /admin` - Админ панель
- `GET /telegram` - Telegram версия

### Статические файлы
- `GET /styles.css` - Основные стили
- `GET /admin.css` - Стили админ панели
- `GET /telegram-styles.css` - Стили Telegram
- `GET /script.js` - Основная логика
- `GET /admin.js` - Логика админ панели
- `GET /telegram-app.js` - Telegram интеграция

## 🔧 Настройка

### Добавление новых городов
1. Откройте админ панель
2. Введите ключ города (например: `salvador`)
3. Введите название для отображения (например: `Salvador`)
4. Нажмите "Adicionar Cidade"

### Добавление новых кафе
1. Выберите город в админ панели
2. Заполните все обязательные поля
3. Добавьте URL изображений
4. Укажите время работы
5. Нажмите "Salvar Café"

## 🚨 Безопасность

### Текущие ограничения
- Админ панель доступна всем, кто знает URL
- Данные хранятся только в localStorage
- Нет аутентификации пользователей

### Рекомендации для продакшена
- Добавить систему аутентификации
- Использовать HTTPS
- Реализовать API с валидацией
- Добавить rate limiting
- Использовать базу данных

## 🤝 Вклад в проект

### Как помочь
1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

### Что можно улучшить
- [ ] Добавить аутентификацию
- [ ] Интеграция с базой данных
- [ ] API для мобильных приложений
- [ ] Геолокация пользователей
- [ ] Отзывы и рейтинги
- [ ] Онлайн-бронирование

## 📞 Поддержка

### Связь
- **Issues**: [GitHub Issues](https://github.com/gugenshnaps/cafe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gugenshnaps/cafe/discussions)

### Документация
- [Telegram Web App API](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 🙏 Благодарности

- [Telegram](https://telegram.org/) за отличную платформу
- [Unsplash](https://unsplash.com/) за красивые изображения
- Сообщество разработчиков за вдохновение

---

**Caaafe** - Encontre os melhores cafés do Brasil! ☕🇧🇷

*Сделано с ❤️ для любителей кофе*
