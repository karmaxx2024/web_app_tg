from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database
import logging

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с других доменов
db = Database()

# Фиксированный user_id для демо (в реальном приложении это будет из авторизации)
DEMO_USER_ID = 1

@app.route('/api/words', methods=['GET'])
def get_words():
    """Получить все слова пользователя"""
    try:
        words = db.get_user_words(DEMO_USER_ID)
        result = []
        for word in words:
            result.append({
                'english': word[0],
                'russian': word[1],
                'example': word[2],
                'date': word[3],
                'created_at': word[4]
            })
        return jsonify({'success': True, 'words': result})
    except Exception as e:
        logging.error(f"Ошибка при получении слов: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/words', methods=['POST'])
def add_word():
    """Добавить новое слово"""
    try:
        data = request.json
        eng = data.get('english')
        rus = data.get('russian')
        example = data.get('example', '')
        date = data.get('date', '')
        
        if not eng or not rus:
            return jsonify({'success': False, 'error': 'Не заполнены обязательные поля'}), 400
        
        word_id = db.save_word(DEMO_USER_ID, eng, rus, example, date)
        return jsonify({'success': True, 'word_id': word_id})
    except Exception as e:
        logging.error(f"Ошибка при сохранении слова: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/words/<word_english>', methods=['DELETE'])
def delete_word(word_english):
    """Удалить конкретное слово"""
    try:
        success = db.delete_word(DEMO_USER_ID, word_english)
        if success:
            return jsonify({'success': True, 'message': f'Слово "{word_english}" удалено'})
        else:
            return jsonify({'success': False, 'error': 'Слово не найдено'}), 404
    except Exception as e:
        logging.error(f"Ошибка при удалении слова: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/words', methods=['DELETE'])
def delete_all_words():
    """Удалить все слова пользователя"""
    try:
        deleted_count = db.delete_all_words(DEMO_USER_ID)
        return jsonify({'success': True, 'deleted_count': deleted_count})
    except Exception as e:
        logging.error(f"Ошибка при удалении всех слов: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/search/<search_term>', methods=['GET'])
def search_words(search_term):
    """Поиск слов"""
    try:
        words = db.get_user_words(DEMO_USER_ID)
        result = []
        for word in words:
            if search_term.lower() in word[0].lower() or search_term.lower() in word[1].lower():
                result.append({
                    'english': word[0],
                    'russian': word[1],
                    'example': word[2],
                    'date': word[3],
                    'created_at': word[4]
                })
        return jsonify({'success': True, 'words': result})
    except Exception as e:
        logging.error(f"Ошибка при поиске слов: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)