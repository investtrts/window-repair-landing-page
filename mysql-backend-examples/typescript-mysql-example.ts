/**
 * Пример подключения к MySQL из TypeScript backend функции
 * Используйте mysql2 пакет
 */

import mysql from 'mysql2/promise';

interface CloudFunctionEvent {
    httpMethod: string;
    headers: Record<string, string>;
    queryStringParameters?: Record<string, string>;
    body?: string;
    isBase64Encoded: boolean;
}

interface CloudFunctionContext {
    requestId: string;
    functionName: string;
    functionVersion: string;
    memoryLimitInMB: number;
}

/**
 * Business: Пример работы с MySQL из TypeScript
 * Args: event с httpMethod, body, queryStringParameters; context с requestId
 * Returns: HTTP response с statusCode, headers, body
 */
export const handler = async (event: CloudFunctionEvent, context: CloudFunctionContext): Promise<any> => {
    const { httpMethod, body, queryStringParameters } = event;
    
    // CORS для OPTIONS
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            body: ''
        };
    }
    
    // Подключение к MySQL
    // ВАЖНО: Сохраните эти параметры в секретах или переменных окружения
    const connection = await mysql.createConnection({
        host: 'your-mysql-host.com',  // или IP адрес
        port: 3306,
        user: 'your_username',
        password: 'your_password',
        database: 'your_database',
        charset: 'utf8mb4'
    });
    
    try {
        if (httpMethod === 'GET') {
            // Пример SELECT запроса
            const [rows] = await connection.execute(
                'SELECT * FROM services WHERE is_active = ? ORDER BY display_order',
                [1]
            );
            
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                isBase64Encoded: false,
                body: JSON.stringify(rows)
            };
        }
        
        if (httpMethod === 'POST') {
            // Пример INSERT запроса
            const data = JSON.parse(body || '{}');
            
            const [result] = await connection.execute(
                `INSERT INTO services (title, description, price, icon, is_active)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    data.title,
                    data.description,
                    data.price,
                    data.icon || 'Settings',
                    true
                ]
            );
            
            return {
                statusCode: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                isBase64Encoded: false,
                body: JSON.stringify({
                    success: true,
                    id: (result as any).insertId
                })
            };
        }
        
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            isBase64Encoded: false,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
        
    } finally {
        await connection.end();
    }
};

// package.json должен содержать:
// {
//   "dependencies": {
//     "mysql2": "^3.6.0"
//   }
// }
