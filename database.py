import logging
import sqlite3
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('users.db')
        self.cursor = self.conn.cursor()

        self.cursor.execute('''
              CREATE TABLE IF NOT EXISTS users (
                  user_id INTEGER PRIMARY KEY,
                  username TEXT,
                  first_name TEXT,
                  created_at INTEGER
              )  
        ''')
        self.conn.commit()
        logging.info("База данных подключена")

        self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS words (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    eng TEXT,
                    rus TEXT,
                    example TEXT,
                    date TEXT,
                    created_at INTEGER)
        ''')
        self.conn.commit()
        logging.info("Слова подключены")

    def save_user(self, user_id, username, first_name):
        self.cursor.execute('''
            INSERT OR REPLACE INTO users
            (user_id, username, first_name, created_at)
            VALUES(?, ?, ?, ?)
        ''', (user_id, username, first_name, datetime.now()))
        self.conn.commit()
        logging.info(f"Пользователь {first_name} сохранен")

    def save_word(self, user_id, eng, rus, example, date):
        self.cursor.execute('''
            INSERT INTO words
            (user_id, eng, rus, example, date, created_at)
            VALUES(?, ?, ?, ?, ?, ?)
        ''', (user_id, eng, rus, example, date, int(datetime.now().timestamp())))
        self.conn.commit()
        logging.info(f"слово {eng} сохраненно для пользователя {user_id}")
        return self.cursor.lastrowid

    def count_users(self):
        self.cursor.execute('SELECT COUNT(*) FROM users')
        count = self.cursor.fetchone()[0]
        logging.info(f"Количество пользователей: {count}")
        return count
    
    # НОВЫЙ МЕТОД: Получить все слова пользователя
    def get_user_words(self, user_id):
        self.cursor.execute('''
            SELECT eng, rus, example, date, created_at 
            FROM words 
            WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        words = self.cursor.fetchall()
        logging.info(f"Получено {len(words)} слов для пользователя {user_id}")
        return words
    
    # НОВЫЙ МЕТОД: Удалить конкретное слово
    def delete_word(self, user_id, eng_word):
        self.cursor.execute('''
            DELETE FROM words 
            WHERE user_id = ? AND eng = ?
        ''', (user_id, eng_word))
        self.conn.commit()
        deleted = self.cursor.rowcount > 0
        logging.info(f"Удаление слова '{eng_word}' для пользователя {user_id}: {'успешно' if deleted else 'слово не найдено'}")
        return deleted
    
    # НОВЫЙ МЕТОД: Удалить все слова пользователя
    def delete_all_words(self, user_id):
        self.cursor.execute('''
            DELETE FROM words 
            WHERE user_id = ?
        ''', (user_id,))
        self.conn.commit()
        deleted_count = self.cursor.rowcount
        logging.info(f"Удалено {deleted_count} слов для пользователя {user_id}")
        return deleted_count
    
    # НОВЫЙ МЕТОД: Найти слово по ID пользователя и английскому слову
    def find_word(self, user_id, eng_word):
        self.cursor.execute('''
            SELECT * FROM words 
            WHERE user_id = ? AND eng = ?
        ''', (user_id, eng_word))
        return self.cursor.fetchone()

db = Database()
