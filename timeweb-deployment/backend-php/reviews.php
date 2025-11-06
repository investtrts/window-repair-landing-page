<?php
/**
 * API эндпоинт для получения отзывов
 * 
 * URL: https://вашдомен.ru/api/reviews.php
 * 
 * Параметры:
 * - limit: количество отзывов (по умолчанию 10)
 * - rating: фильтр по рейтингу (опционально)
 * 
 * Примеры:
 * - /api/reviews.php
 * - /api/reviews.php?limit=5
 * - /api/reviews.php?rating=5
 */

require_once 'config.php';

// Установка CORS заголовков
setCorsHeaders();

try {
    // Получение параметров
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $rating = isset($_GET['rating']) ? (int)$_GET['rating'] : null;
    
    // Валидация лимита
    if ($limit < 1 || $limit > 100) {
        sendError('Limit must be between 1 and 100', 400);
    }
    
    // Подключение к БД
    $pdo = getDBConnection();
    
    // Построение SQL запроса
    $sql = "
        SELECT 
            id,
            author_name,
            review_text,
            rating,
            service_type,
            created_at,
            is_active
        FROM reviews
        WHERE is_active = 1
    ";
    
    $params = [];
    
    // Фильтр по рейтингу
    if ($rating !== null) {
        $sql .= " AND rating = :rating";
        $params[':rating'] = $rating;
    }
    
    $sql .= " ORDER BY created_at DESC LIMIT :limit";
    
    // Подготовка и выполнение запроса
    $stmt = $pdo->prepare($sql);
    
    // Привязка параметров
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_INT);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    
    $stmt->execute();
    $reviews = $stmt->fetchAll();
    
    // Формирование ответа
    $response = [
        'reviews' => $reviews,
        'total' => count($reviews)
    ];
    
    sendJsonResponse($response);
    
} catch (PDOException $e) {
    logError("Database error in reviews.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
} catch (Exception $e) {
    logError("Error in reviews.php: " . $e->getMessage());
    sendError('An error occurred', 500);
}
