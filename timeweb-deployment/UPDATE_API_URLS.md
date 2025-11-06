# Инструкция: Обновление API URL для Timeweb

После размещения сайта на Timeweb нужно обновить URL API в коде.

## Что нужно изменить

### Файл: `src/pages/Index.tsx`

Найдите строки 21-22:
```typescript
const CONTENT_API = 'https://functions.poehali.dev/0834ee0a-3d60-4224-ab11-b39d167e2371';
const REVIEWS_API = 'https://functions.poehali.dev/afe6fe8d-2c7e-4d6c-8f95-7f955f5bfb7e';
```

Замените на:
```typescript
const CONTENT_API = 'https://вашдомен.ru/api/content.php';
const REVIEWS_API = 'https://вашдомен.ru/api/reviews.php';
```

**Важно:** Замените `вашдомен.ru` на ваш реальный домен!

### Файл: `src/pages/Index.tsx` (обработчики форм)

Также нужно обновить обработчики отправки форм для сохранения заявок в базу данных.

Найдите функцию `handleSubmit` (строка ~91):
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
  setFormData({ name: "", phone: "", message: "" });
};
```

Замените на:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://вашдомен.ru/api/submit-lead.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        source: 'contact_form'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
      setFormData({ name: "", phone: "", message: "" });
    } else {
      alert("Произошла ошибка. Пожалуйста, позвоните нам напрямую.");
    }
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    alert("Произошла ошибка. Пожалуйста, позвоните нам напрямую.");
  }
};
```

Найдите функцию `handlePopupSubmit` (строка ~97):
```typescript
const handlePopupSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  alert("Отлично! Ваша скидка 30% активирована. Мы перезвоним в течение 5 минут!");
  setPopupFormData({ name: "", phone: "" });
  setShowPopup(false);
};
```

Замените на:
```typescript
const handlePopupSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://вашдомен.ru/api/submit-lead.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: popupFormData.name,
        phone: popupFormData.phone,
        message: 'Заявка со скидкой 30%',
        source: 'popup_form'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert("Отлично! Ваша скидка 30% активирована. Мы перезвоним в течение 5 минут!");
      setPopupFormData({ name: "", phone: "" });
      setShowPopup(false);
    } else {
      alert("Произошла ошибка. Пожалуйста, позвоните нам напрямую.");
    }
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    alert("Произошла ошибка. Пожалуйста, позвоните нам напрямую.");
  }
};
```

## После изменений

1. Сохраните файл `src/pages/Index.tsx`
2. Пересоберите проект:
   ```bash
   npm run build
   ```
3. Загрузите обновленные файлы из `dist/` на хостинг Timeweb

## Проверка работы

После загрузки проверьте:

1. **API работает:**
   - https://вашдомен.ru/api/content.php?type=services
   - https://вашдомен.ru/api/reviews.php
   - Должны возвращать JSON данные

2. **Сайт загружает данные:**
   - Откройте https://вашдомен.ru
   - В разделе "Наши услуги" должны показываться услуги из БД
   - В разделе "Отзывы" должны быть отзывы из БД

3. **Формы работают:**
   - Заполните форму на сайте
   - Проверьте в phpMyAdmin таблицу `leads`
   - Должна появиться новая запись

## Готово!

Теперь ваш сайт полностью работает с MySQL базой данных на Timeweb! 🎉

## Опционально: Настройка уведомлений

Если хотите получать уведомления о новых заявках:

1. Откройте файл `api/submit-lead.php` на хостинге
2. Раскомментируйте функцию `sendEmailNotification` или `sendTelegramNotification`
3. Настройте параметры (email адрес или Telegram bot token)
4. Сохраните изменения

Теперь при каждой заявке вы будете получать уведомление!
