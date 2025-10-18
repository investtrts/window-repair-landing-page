'''
Business: API для управления отзывами клиентов с модерацией администратором
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с JSON данными отзывов
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            show_all = event.get('queryStringParameters', {}).get('all') == 'true'
            admin_token = event.get('headers', {}).get('x-admin-token')
            
            if show_all and admin_token == 'admin123':
                cur.execute("""
                    SELECT id, author_name, rating, review_text, service_type, 
                           created_at, is_approved, admin_comment
                    FROM reviews 
                    ORDER BY created_at DESC
                """)
            else:
                cur.execute("""
                    SELECT id, author_name, rating, review_text, service_type, created_at
                    FROM reviews 
                    WHERE is_approved = true
                    ORDER BY created_at DESC
                """)
            
            reviews = cur.fetchall()
            reviews_list = []
            for r in reviews:
                review_dict = dict(r)
                if 'created_at' in review_dict and review_dict['created_at']:
                    review_dict['created_at'] = review_dict['created_at'].isoformat()
                reviews_list.append(review_dict)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'reviews': reviews_list}, ensure_ascii=False)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            author_name = body_data.get('author_name', '').strip()
            rating = body_data.get('rating', 0)
            review_text = body_data.get('review_text', '').strip()
            service_type = body_data.get('service_type', '').strip()
            
            if not author_name or not review_text or not (1 <= rating <= 5):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid data'}, ensure_ascii=False)
                }
            
            cur.execute("""
                INSERT INTO reviews (author_name, rating, review_text, service_type, is_approved)
                VALUES (%s, %s, %s, %s, false)
                RETURNING id
            """, (author_name, rating, review_text, service_type if service_type else None))
            
            review_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Отзыв отправлен на модерацию',
                    'id': review_id
                }, ensure_ascii=False)
            }
        
        if method == 'PUT':
            admin_token = event.get('headers', {}).get('x-admin-token')
            
            if admin_token != 'admin123':
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Unauthorized'}, ensure_ascii=False)
                }
            
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            is_approved = body_data.get('is_approved')
            admin_comment = body_data.get('admin_comment', '')
            
            if review_id is None or is_approved is None:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid data'}, ensure_ascii=False)
                }
            
            cur.execute("""
                UPDATE reviews 
                SET is_approved = %s, admin_comment = %s
                WHERE id = %s
            """, (is_approved, admin_comment if admin_comment else None, review_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'success': True}, ensure_ascii=False)
            }
        
        if method == 'DELETE':
            admin_token = event.get('headers', {}).get('x-admin-token')
            
            if admin_token != 'admin123':
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Unauthorized'}, ensure_ascii=False)
                }
            
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            
            if review_id is None:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid data'}, ensure_ascii=False)
                }
            
            cur.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'success': True}, ensure_ascii=False)
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
