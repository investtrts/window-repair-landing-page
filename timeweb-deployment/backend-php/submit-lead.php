<?php
/**
 * API эндпоинт для приема заявок с сайта
 * 
 * URL: https://вашдомен.ru/api/submit-lead.php
 * 
 * Метод: POST
 * 
 * Параметры (JSON):
 * - name: имя клиента (обязательно)
 * - phone: телефон клиента (обязательно)
 * - message: сообщение (опционально)
 * - source: источник заявки (опционально, по умолчанию 'website')
 * 
 * Пример запроса:
 * POST /api/submit-lead.php
 * {
 *   "name": "Иван Иванов",
 *   "phone": "+7 999 123-45-67",
 *   "message": "Нужно отрегулировать окна"
 * }
 */

require_once 'config.php';

// Установка CORS заголовков
setCorsHeaders();

try {
    // Проверка метода запроса
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Only POST method is allowed', 405);
    }
    
    // Получение данных из тела запроса
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('Invalid JSON', 400);
    }
    
    // Валидация обязательных полей
    if (empty($data['name']) || empty($data['phone'])) {
        sendError('Fields "name" and "phone" are required', 400);
    }
    
    // Очистка и валидация данных
    $name = trim($data['name']);
    $phone = trim($data['phone']);
    $message = isset($data['message']) ? trim($data['message']) : null;
    $source = isset($data['source']) ? trim($data['source']) : 'website';
    
    // Дополнительная валидация
    if (strlen($name) < 2 || strlen($name) > 255) {
        sendError('Name must be between 2 and 255 characters', 400);
    }
    
    if (strlen($phone) < 10 || strlen($phone) > 50) {
        sendError('Invalid phone number', 400);
    }
    
    // Подключение к БД
    $pdo = getDBConnection();
    
    // Вставка заявки в базу данных
    $stmt = $pdo->prepare("
        INSERT INTO leads (name, phone, message, source, status)
        VALUES (:name, :phone, :message, :source, 'new')
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':message' => $message,
        ':source' => $source
    ]);
    
    $leadId = $pdo->lastInsertId();
    
    // ОПЦИОНАЛЬНО: Отправка уведомления на email
    // sendEmailNotification($name, $phone, $message);
    
    // ОПЦИОНАЛЬНО: Отправка в Telegram
    // sendTelegramNotification($name, $phone, $message);
    
    // Успешный ответ
    sendJsonResponse([
        'success' => true,
        'lead_id' => $leadId,
        'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
    ], 201);
    
} catch (PDOException $e) {
    logError("Database error in submit-lead.php: " . $e->getMessage());
    sendError('Failed to save lead', 500);
} catch (Exception $e) {
    logError("Error in submit-lead.php: " . $e->getMessage());
    sendError('An error occurred', 500);
}

/**
 * ОПЦИОНАЛЬНАЯ ФУНКЦИЯ: Отправка email уведомления
 * Раскомментируйте и настройте для использования
 */
/*
function sendEmailNotification($name, $phone, $message) {
    $to = 'your-email@example.com';
    $subject = 'Новая заявка с сайта';
    $body = "
        Новая заявка с сайта!
        
        Имя: $name
        Телефон: $phone
        Сообщение: $message
        
        Время: " . date('Y-m-d H:i:s') . "
    ";
    
    $headers = [
        'From: noreply@вашдомен.ru',
        'Reply-To: noreply@вашдомен.ru',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    mail($to, $subject, $body, implode("\r\n", $headers));
}
*/

/**
 * ОПЦИОНАЛЬНАЯ ФУНКЦИЯ: Отправка в Telegram
 * Раскомментируйте и настройте для использования
 */
/*
function sendTelegramNotification($name, $phone, $message) {
    $botToken = 'YOUR_BOT_TOKEN';
    $chatId = 'YOUR_CHAT_ID';
    
    $text = "🔔 Новая заявка!\n\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if ($message) {
        $text .= "💬 Сообщение: $message\n";
    }
    $text .= "\n⏰ " . date('Y-m-d H:i:s');
    
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data)
        ]
    ];
    
    file_get_contents($url, false, stream_context_create($options));
}
*/
