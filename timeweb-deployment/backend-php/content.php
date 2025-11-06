<?php
/**
 * API эндпоинт для получения контента (услуги, преимущества, галерея)
 * 
 * URL: https://вашдомен.ru/api/content.php
 * 
 * Параметры:
 * - type: services | benefits | gallery (обязательный)
 * 
 * Примеры:
 * - /api/content.php?type=services
 * - /api/content.php?type=benefits
 * - /api/content.php?type=gallery
 */

require_once 'config.php';

// Установка CORS заголовков
setCorsHeaders();

try {
    // Получение параметра type
    $type = $_GET['type'] ?? '';
    
    if (empty($type)) {
        sendError('Parameter "type" is required', 400);
    }
    
    // Подключение к БД
    $pdo = getDBConnection();
    
    // Обработка различных типов контента
    switch ($type) {
        case 'services':
            $stmt = $pdo->prepare("
                SELECT id, title, description, price, icon, display_order, is_active
                FROM services
                WHERE is_active = 1
                ORDER BY display_order ASC
            ");
            $stmt->execute();
            $data = $stmt->fetchAll();
            sendJsonResponse($data);
            break;
            
        case 'benefits':
            $stmt = $pdo->prepare("
                SELECT id, title, description, icon, display_order, is_active
                FROM benefits
                WHERE is_active = 1
                ORDER BY display_order ASC
            ");
            $stmt->execute();
            $data = $stmt->fetchAll();
            sendJsonResponse($data);
            break;
            
        case 'gallery':
            $stmt = $pdo->prepare("
                SELECT id, title, image_url as url, display_order, is_active
                FROM gallery_items
                WHERE is_active = 1
                ORDER BY display_order ASC
            ");
            $stmt->execute();
            $data = $stmt->fetchAll();
            sendJsonResponse($data);
            break;
            
        default:
            sendError('Invalid type. Allowed values: services, benefits, gallery', 400);
    }
    
} catch (PDOException $e) {
    logError("Database error in content.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
} catch (Exception $e) {
    logError("Error in content.php: " . $e->getMessage());
    sendError('An error occurred', 500);
}
