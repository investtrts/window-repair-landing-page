import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления контентом сайта (услуги, тарифы, галерея, настройки)
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {})
    content_type = query_params.get('type', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    admin_password = headers.get('x-admin-password', '')
    
    if method != 'GET' and admin_password != 'admin123':
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            if content_type == 'services':
                cur.execute("SELECT * FROM services WHERE is_active = true ORDER BY display_order")
            elif content_type == 'pricing':
                cur.execute("SELECT * FROM pricing_tiers WHERE is_active = true ORDER BY display_order")
            elif content_type == 'additional-services':
                cur.execute("SELECT * FROM additional_services WHERE is_active = true ORDER BY display_order")
            elif content_type == 'gallery':
                cur.execute("SELECT * FROM gallery WHERE is_active = true ORDER BY display_order")
            elif content_type == 'benefits':
                cur.execute("SELECT * FROM benefits WHERE is_active = true ORDER BY display_order")
            elif content_type == 'settings':
                cur.execute("SELECT * FROM site_settings ORDER BY setting_key")
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid content type'}),
                    'isBase64Encoded': False
                }
            
            rows = cur.fetchall()
            result = [dict(row) for row in rows]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if content_type == 'services':
                if not all(k in body_data for k in ['icon', 'title', 'description', 'price']):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Обязательные поля: icon, title, description, price'}),
                        'isBase64Encoded': False
                    }
                cur.execute(
                    "INSERT INTO services (icon, title, description, price, display_order) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (body_data['icon'], body_data['title'], body_data['description'], body_data['price'], body_data.get('display_order', 0))
                )
            elif content_type == 'pricing':
                if not all(k in body_data for k in ['name', 'description', 'price', 'icon', 'features']):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Обязательные поля: name, description, price, icon, features'}),
                        'isBase64Encoded': False
                    }
                cur.execute(
                    "INSERT INTO pricing_tiers (name, description, price, icon, is_popular, features, display_order) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (body_data['name'], body_data['description'], body_data['price'], body_data['icon'], 
                     body_data.get('is_popular', False), json.dumps(body_data['features']), body_data.get('display_order', 0))
                )
            elif content_type == 'additional-services':
                cur.execute(
                    "INSERT INTO additional_services (name, price, display_order) VALUES (%s, %s, %s) RETURNING id",
                    (body_data['name'], body_data['price'], body_data.get('display_order', 0))
                )
            elif content_type == 'gallery':
                if not all(k in body_data for k in ['url', 'title']):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Обязательные поля: url, title'}),
                        'isBase64Encoded': False
                    }
                cur.execute(
                    "INSERT INTO gallery (url, title, description, display_order) VALUES (%s, %s, %s, %s) RETURNING id",
                    (body_data['url'], body_data['title'], body_data.get('description', ''), body_data.get('display_order', 0))
                )
            
            result_id = cur.fetchone()['id']
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': result_id, 'message': 'Created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            item_id = body_data.get('id')
            
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            if content_type == 'services':
                cur.execute(
                    "UPDATE services SET icon=%s, title=%s, description=%s, price=%s, display_order=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (body_data['icon'], body_data['title'], body_data['description'], body_data['price'], body_data.get('display_order', 0), item_id)
                )
            elif content_type == 'pricing':
                cur.execute(
                    "UPDATE pricing_tiers SET name=%s, description=%s, price=%s, icon=%s, is_popular=%s, features=%s, display_order=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (body_data['name'], body_data['description'], body_data['price'], body_data['icon'], 
                     body_data.get('is_popular', False), json.dumps(body_data['features']), body_data.get('display_order', 0), item_id)
                )
            elif content_type == 'additional-services':
                cur.execute(
                    "UPDATE additional_services SET name=%s, price=%s, display_order=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (body_data['name'], body_data['price'], body_data.get('display_order', 0), item_id)
                )
            elif content_type == 'gallery':
                cur.execute(
                    "UPDATE gallery SET url=%s, title=%s, description=%s, display_order=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (body_data['url'], body_data['title'], body_data.get('description', ''), body_data.get('display_order', 0), item_id)
                )
            elif content_type == 'settings':
                cur.execute(
                    "UPDATE site_settings SET setting_value=%s, updated_at=CURRENT_TIMESTAMP WHERE setting_key=%s",
                    (body_data['setting_value'], body_data['setting_key'])
                )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {})
            item_id = query_params.get('id')
            
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            table_map = {
                'services': 'services',
                'pricing': 'pricing_tiers',
                'additional-services': 'additional_services',
                'gallery': 'gallery'
            }
            
            table = table_map.get(content_type)
            if table:
                cur.execute(f"UPDATE {table} SET is_active=false WHERE id=%s", (item_id,))
                conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Deleted'}),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }