# Инструкция по размещению сайта на Timeweb с MySQL

## Шаг 1: Подготовка хостинга Timeweb

### 1.1. Заказ услуг
1. Зайдите на https://timeweb.com
2. Закажите **Виртуальный хостинг** (тариф "Начальный" или выше)
3. При заказе выберите **MySQL базу данных**

### 1.2. Получение доступов
После активации хостинга вы получите:
- **FTP доступ**: host, login, password
- **MySQL доступ**: host, database name, username, password
- **Панель управления**: https://hosting.timeweb.ru

## Шаг 2: Настройка MySQL базы данных

### 2.1. Вход в phpMyAdmin
1. Откройте панель управления Timeweb
2. Перейдите в раздел "Базы данных" → "MySQL"
3. Нажмите "Открыть phpMyAdmin"

### 2.2. Создание структуры БД
1. Выберите вашу базу данных в левом меню
2. Перейдите на вкладку "SQL"
3. Скопируйте содержимое файла `mysql-schema.sql` (из корня проекта)
4. Вставьте в поле SQL и нажмите "Вперед"

### 2.3. Заполнение тестовыми данными
1. Снова перейдите на вкладку "SQL"
2. Скопируйте содержимое файла `mysql-seed-data.sql`
3. Вставьте и выполните

**Готово!** Структура и данные созданы.

## Шаг 3: Загрузка файлов на хостинг

### 3.1. Подключение по FTP
Используйте любой FTP-клиент (FileZilla, WinSCP, Total Commander):
- **Host**: ftp.вашдомен.ru
- **Username**: ваш FTP логин
- **Password**: ваш FTP пароль
- **Port**: 21

### 3.2. Загрузка билда
1. Откройте папку `dist/` в вашем проекте
2. Загрузите **все файлы** из `dist/` в корневую папку хостинга (`public_html/` или `www/`)
3. Структура должна быть:
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── vite.svg
```

### 3.3. Создание .htaccess для SPA
В папке `public_html/` создайте файл `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Кэширование
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Шаг 4: Размещение Backend функций

### 4.1. Структура Backend на Timeweb
Создайте папку `api/` в `public_html/`:
```
public_html/
├── index.html
├── assets/
├── api/
│   ├── content.php
│   ├── reviews.php
│   └── config.php
```

### 4.2. Конфигурация подключения (config.php)
Файл уже создан: `timeweb-deployment/backend-php/config.php`

**ВАЖНО:** Замените креды на ваши из панели Timeweb!

### 4.3. Загрузка Backend файлов
1. Откройте папку `timeweb-deployment/backend-php/`
2. Загрузите **все файлы** в папку `public_html/api/` на хостинге

## Шаг 5: Обновление Frontend для работы с новым API

### 5.1. Замена URL API в коде
Откройте файл `src/pages/Index.tsx` и замените:

```typescript
// Старые URL (Cloud Functions)
const CONTENT_API = 'https://functions.poehali.dev/0834ee0a-3d60-4224-ab11-b39d167e2371';
const REVIEWS_API = 'https://functions.poehali.dev/afe6fe8d-2c7e-4d6c-8f95-7f955f5bfb7e';

// Новые URL (Timeweb)
const CONTENT_API = 'https://вашдомен.ru/api/content.php';
const REVIEWS_API = 'https://вашдомен.ru/api/reviews.php';
```

### 5.2. Пересборка проекта
```bash
npm run build
```

### 5.3. Повторная загрузка
Загрузите обновленные файлы из `dist/` на хостинг.

## Шаг 6: Проверка работоспособности

### 6.1. Проверка сайта
Откройте https://вашдомен.ru в браузере

### 6.2. Проверка API
- https://вашдомен.ru/api/content.php?type=services
- https://вашдомен.ru/api/reviews.php

Должны вернуться JSON данные.

### 6.3. Проверка базы данных
В phpMyAdmin проверьте наличие данных в таблицах:
- `services`
- `benefits`
- `gallery_items`
- `reviews`

## Шаг 7: Настройка домена (если нужен свой)

### 7.1. Если домен куплен на Timeweb
Домен подключится автоматически.

### 7.2. Если домен на другом регистраторе
1. В панели регистратора домена измените NS-серверы:
   - `ns1.timeweb.ru`
   - `ns2.timeweb.ru`
   - `ns3.timeweb.org`
   - `ns4.timeweb.org`

2. Подождите 24-48 часов для обновления DNS

### 7.3. SSL сертификат
Timeweb автоматически выпустит бесплатный SSL от Let's Encrypt через 1-2 часа.

## Частые проблемы и решения

### Проблема: 500 Internal Server Error
**Решение:** 
- Проверьте права на файлы (должны быть 644)
- Проверьте логи ошибок в панели Timeweb

### Проблема: API возвращает пустой ответ
**Решение:**
- Проверьте креды MySQL в `config.php`
- Убедитесь, что база данных заполнена данными

### Проблема: Страницы не открываются (404)
**Решение:**
- Проверьте наличие `.htaccess` файла
- Убедитесь, что `mod_rewrite` включен (обычно включен на Timeweb)

### Проблема: CORS ошибки
**Решение:**
- Убедитесь, что в PHP файлах есть заголовки CORS
- Проверьте, что домен в запросах совпадает с доменом сайта

## Контакты поддержки Timeweb

- **Телефон**: 8 (800) 100-80-80
- **Email**: support@timeweb.ru
- **Онлайн-чат**: в личном кабинете

## Чек-лист перед запуском

- [ ] MySQL база создана и заполнена данными
- [ ] Файлы билда загружены в `public_html/`
- [ ] `.htaccess` создан и настроен
- [ ] Backend PHP файлы загружены в `api/`
- [ ] Креды MySQL обновлены в `config.php`
- [ ] URL API обновлены в `Index.tsx`
- [ ] Проект пересобран и загружен
- [ ] Сайт открывается без ошибок
- [ ] API возвращает данные
- [ ] SSL сертификат активирован

**Готово! Ваш сайт работает на Timeweb! 🚀**
