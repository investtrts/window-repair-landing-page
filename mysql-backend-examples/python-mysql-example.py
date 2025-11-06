"""
Пример подключения к MySQL из Python backend функции
Используйте pymysql или mysql-connector-python
"""

import json
import pymysql
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Пример работы с MySQL из Python
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # CORS для OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Подключение к MySQL
    # ВАЖНО: Сохраните эти параметры в секретах или переменных окружения
    connection = pymysql.connect(
        host='your-mysql-host.com',  # или IP адрес
        port=3306,
        user='your_username',
        password='your_password',
        database='your_database',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            if method == 'GET':
                # Пример SELECT запроса
                query = "SELECT * FROM services WHERE is_active = 1 ORDER BY display_order"
                cursor.execute(query)
                results = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(results, ensure_ascii=False)
                }
            
            elif method == 'POST':
                # Пример INSERT запроса
                body_data = json.loads(event.get('body', '{}'))
                
                query = """
                    INSERT INTO services (title, description, price, icon, is_active)
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(query, (
                    body_data['title'],
                    body_data['description'],
                    body_data['price'],
                    body_data.get('icon', 'Settings'),
                    True
                ))
                connection.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'id': cursor.lastrowid
                    })
                }
    
    finally:
        connection.close()
    
    return {
        'statusCode': 405,
        'body': json.dumps({'error': 'Method not allowed'})
    }


# requirements.txt должен содержать:
# pymysql==1.1.0
# или
# mysql-connector-python==8.2.0
