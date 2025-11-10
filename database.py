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

    def save_user(self, user_id, username, first_name):
        self.cursor.execute('''
            INSERT OR REPLACE INTO users
            (user_id, username, first_name, created_at)
            VALUES(?, ?, ?, ?)
        ''', (user_id, username, first_name, datetime.now()))
        self.conn.commit()
        logging.info(f"Пользователь {first_name} сохранен")

    def count_users(self):
        self.cursor.execute('SELECT COUNT(*) FROM users')
        count = self.cursor.fetchone()[0]
        logging.info(f"Количество пользователей: {count}")
        return count
        
db = Database()