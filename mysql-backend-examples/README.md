# Примеры подключения к MySQL для Backend функций

## Что нужно сделать перед использованием:

### 1. Установить MySQL на вашем сервере
```bash
# Ubuntu/Debian
sudo apt-get install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
```

### 2. Создать базу данных и пользователя
```sql
CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'your_username'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_database.* TO 'your_username'@'%';
FLUSH PRIVILEGES;
```

### 3. Выполнить DDL скрипт (который я создал ранее)
Скопируйте содержимое файла `mysql-schema.sql` и выполните его в вашей MySQL базе данных.

### 4. Настроить доступ к MySQL извне
- Отредактируйте `/etc/mysql/mysql.conf.d/mysqld.cnf`
- Измените `bind-address = 127.0.0.1` на `bind-address = 0.0.0.0`
- Перезапустите MySQL: `sudo systemctl restart mysql`
- Откройте порт 3306 в firewall

### 5. Добавить зависимости в backend функции

#### Для Python (requirements.txt):
```txt
pymysql==1.1.0
```

#### Для TypeScript (package.json):
```json
{
  "dependencies": {
    "mysql2": "^3.6.0"
  }
}
```

## Примеры использования:

### Python с PyMySQL
См. файл `python-mysql-example.py`

**Основные отличия от PostgreSQL:**
- Используем `pymysql` вместо `psycopg2`
- Параметры подключения: `host`, `port`, `user`, `password`, `database`
- Используем `%s` для placeholders (не `$1`, `$2`)
- Метод `cursor.lastrowid` для получения ID вставленной записи

### TypeScript с mysql2
См. файл `typescript-mysql-example.ts`

**Основные отличия от PostgreSQL:**
- Используем `mysql2/promise` вместо `pg`
- Параметры подключения: объект конфигурации
- Используем `?` для placeholders
- Метод `insertId` для получения ID вставленной записи

## Безопасность:

**ВАЖНО:** Никогда не храните креды прямо в коде!

### Вариант 1: Переменные окружения
```python
import os
connection = pymysql.connect(
    host=os.environ.get('MYSQL_HOST'),
    user=os.environ.get('MYSQL_USER'),
    password=os.environ.get('MYSQL_PASSWORD'),
    database=os.environ.get('MYSQL_DATABASE')
)
```

### Вариант 2: Connection String
```python
import os
connection_string = os.environ.get('MYSQL_URL')
# mysql://username:password@host:3306/database
```

## Миграция данных из PostgreSQL в MySQL:

### 1. Экспорт данных из PostgreSQL:
```bash
pg_dump -h your-postgres-host -U username -d database -t table_name --data-only --column-inserts > data.sql
```

### 2. Адаптация для MySQL:
- Замените `TRUE`/`FALSE` на `1`/`0`
- Замените `::jsonb` на ``
- Удалите `RETURNING` clauses

### 3. Импорт в MySQL:
```bash
mysql -h your-mysql-host -u username -p database < data.sql
```

## Пример миграции данных вручную:

```python
import psycopg2
import pymysql

# Подключение к PostgreSQL
pg_conn = psycopg2.connect("postgresql://...")
pg_cur = pg_conn.cursor()

# Подключение к MySQL
mysql_conn = pymysql.connect(host="...", user="...", password="...", database="...")
mysql_cur = mysql_conn.cursor()

# Миграция таблицы services
pg_cur.execute("SELECT id, title, description, price, icon, display_order, is_active, created_at, updated_at FROM services")
services = pg_cur.fetchall()

for service in services:
    mysql_cur.execute(
        "INSERT INTO services (id, title, description, price, icon, display_order, is_active, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        service
    )

mysql_conn.commit()
print(f"Migrated {len(services)} services")
```

## Полезные ссылки:
- PyMySQL документация: https://pymysql.readthedocs.io/
- mysql2 документация: https://github.com/sidorares/node-mysql2
- MySQL официальная документация: https://dev.mysql.com/doc/
