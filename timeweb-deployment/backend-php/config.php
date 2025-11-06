<?php
/**
 * Конфигурация подключения к MySQL на Timeweb
 * 
 * ВАЖНО: Замените эти значения на ваши из панели управления Timeweb!
 */

// Креды MySQL из панели Timeweb
define('DB_HOST', 'localhost');  // Обычно localhost на Timeweb
define('DB_NAME', 'your_database_name');  // Имя базы данных из панели
define('DB_USER', 'your_username');  // Пользователь из панели
define('DB_PASS', 'your_password');  // Пароль из панели
define('DB_CHARSET', 'utf8mb4');

/**
 * Создание подключения к MySQL
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed',
            'message' => $e->getMessage()
        ]);
        exit;
    }
}

/**
 * Установка CORS заголовков
 */
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');
    
    // Обработка preflight запроса
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Логирование ошибок (для отладки)
 */
function logError($message) {
    $logFile = __DIR__ . '/error.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

/**
 * Отправка JSON ответа
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Отправка ошибки
 */
function sendError($message, $statusCode = 400) {
    sendJsonResponse(['error' => $message], $statusCode);
}
