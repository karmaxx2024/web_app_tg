import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo, MenuButtonWebApp
import asyncio
from database import db
import json
import sqlite3
from datetime import datetime

API_TOKEN = '8473552598:AAHWg8HSnnPTbgtVxkKC4WCiVMh_BRf4kK8'

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

WEBAPP_URL = "https://karmaxx2024.github.io/web_app_tg/"

# Кнопка для меню (слева от поля ввода)
menu_button = MenuButtonWebApp(text="Открыть WebApp", web_app=WebAppInfo(url=WEBAPP_URL))

# Клавиатура для сообщения
kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="🎮 Открыть WordMaster", web_app=WebAppInfo(url=WEBAPP_URL))]
])

# Клавиатура с дополнительными командами
help_kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="🎮 Открыть приложение", web_app=WebAppInfo(url=WEBAPP_URL))],
    [InlineKeyboardButton(text="📊 Моя статистика", callback_data="stats"),
     InlineKeyboardButton(text="🎯 Начать игру", callback_data="game")],
    [InlineKeyboardButton(text="📚 Мои слова", callback_data="words")]
])

class GameManager:
    def __init__(self, db_path='users.db'):
        self.db_path = db_path
    
    def get_user_words(self, user_id):
        """Получить слова пользователя из базы данных"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT english_word, russian_translation, example, created_at 
                FROM user_words 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            ''', (user_id,))
            
            words = cursor.fetchall()
            conn.close()
            
            return [{
                'english': word[0],
                'russian': word[1],
                'example': word[2],
                'date': word[3]
            } for word in words]
            
        except Exception as e:
            logging.error(f"Error getting user words: {e}")
            return []
    
    def save_user_word(self, user_id, english_word, russian_translation, example=""):
        """Сохранить слово пользователя в базу данных"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO user_words (user_id, english_word, russian_translation, example, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, english_word, russian_translation, example, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            logging.error(f"Error saving user word: {e}")
            return False
    
    def get_game_question(self, user_id):
        """Получить вопрос для игры из слов пользователя"""
        try:
            user_words = self.get_user_words(user_id)
            
            if not user_words:
                return self.get_demo_question()
            
            # Выбираем случайное слово
            import random
            word = random.choice(user_words)
            
            # Случайно выбираем тип вопроса
            question_type = random.choice(['multiple_choice', 'input'])
            
            if question_type == 'multiple_choice':
                # Создаем неправильные варианты ответов
                wrong_answers = []
                other_words = [w for w in user_words if w['russian'] != word['russian']]
                
                while len(wrong_answers) < 3 and other_words:
                    wrong_word = random.choice(other_words)
                    if wrong_word['russian'] not in wrong_answers:
                        wrong_answers.append(wrong_word['russian'])
                    other_words.remove(wrong_word)
                
                # Если недостаточно неправильных вариантов, добавляем демо-варианты
                demo_wrong = ['дом', 'машина', 'дерево', 'солнце']
                while len(wrong_answers) < 3:
                    wrong = random.choice(demo_wrong)
                    if wrong not in wrong_answers and wrong != word['russian']:
                        wrong_answers.append(wrong)
                
                options = wrong_answers + [word['russian']]
                random.shuffle(options)
                
                return {
                    'type': 'multiple_choice',
                    'question': f'Какой перевод имеет слово "{word["english"]}"?',
                    'correct_answer': word['russian'],
                    'options': options
                }
            else:
                return {
                    'type': 'input',
                    'question': f'Напишите перевод слова "{word["english"]}"',
                    'correct_answer': word['russian']
                }
                
        except Exception as e:
            logging.error(f"Error getting game question: {e}")
            return self.get_demo_question()
    
    def get_demo_question(self):
        """Демо-вопросы если у пользователя нет слов"""
        demo_questions = [
            {
                'type': 'multiple_choice',
                'question': 'Какой перевод имеет слово "cat"?',
                'correct_answer': 'кошка',
                'options': ['кошка', 'собака', 'шар', 'дом']
            },
            {
                'type': 'multiple_choice',
                'question': 'Какой перевод имеет слово "book"?',
                'correct_answer': 'книга',
                'options': ['ручка', 'книга', 'стол', 'окно']
            },
            {
                'type': 'input',
                'question': 'Напишите перевод слова "dog"',
                'correct_answer': 'собака'
            }
        ]
        
        import random
        return random.choice(demo_questions)
    
    def get_user_stats(self, user_id):
        """Получить статистику пользователя"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Количество слов
            cursor.execute('SELECT COUNT(*) FROM user_words WHERE user_id = ?', (user_id,))
            word_count = cursor.fetchone()[0]
            
            # Последнее добавленное слово
            cursor.execute('''
                SELECT english_word, russian_translation, created_at 
                FROM user_words 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT 1
            ''', (user_id,))
            last_word = cursor.fetchone()
            
            conn.close()
            
            return {
                'word_count': word_count,
                'last_word': last_word
            }
            
        except Exception as e:
            logging.error(f"Error getting user stats: {e}")
            return {'word_count': 0, 'last_word': None}

game_manager = GameManager()

@dp.message(Command("start"))
async def start_command(message: types.Message):
    user = message.from_user

    # Сохраняем пользователя в базу
    db.save_user(
        user_id=user.id,
        username=user.username,
        first_name=user.first_name
    )

    welcome_text = f"""
📚 Привет, {user.first_name}!

Добро пожаловать в <b>WordMaster</b> - твоего помощника в изучении английского языка!

✨ <b>Возможности:</b>
• Добавление новых слов с переводом и примерами
• Повторение изученных слов
• Встроенный переводчик
• Увлекательная игра для проверки знаний

🎮 <b>Как начать:</b>
1. Нажми кнопку ниже чтобы открыть приложение
2. Добавь свои первые слова
3. Начни играть и улучшай свой английский!

Для быстрого доступа к функциям используй команды:
/words - мои слова
/game - начать игру  
/stats - моя статистика
/help - помощь
    """

    await message.answer(welcome_text, reply_markup=help_kb, parse_mode='HTML')

    # Устанавливаем кнопку меню для пользователя
    await bot.set_chat_menu_button(
        chat_id=message.chat.id,
        menu_button=menu_button
    )

@dp.message(Command("help"))
async def help_command(message: types.Message):
    help_text = """
🆘 <b>Помощь по командам:</b>

/start - Главное меню
/help - Эта справка  
/game - Начать игру в чате
/words - Показать мои слова
/stats - Моя статистика
/addword - Добавить новое слово

🎮 <b>Игра в чате:</b>
Используй /game чтобы начать викторину прямо в чате! Я буду задавать вопросы по твоим словам.

📱 <b>WebApp:</b>
Для полного функционала открой WebApp - там тебя ждут:
• Удобный интерфейс для добавления слов
• Переводчик с поддержкой многих языков
• Игра с таймером и разными типами вопросов
• Поиск по твоим словам
    """
    
    await message.answer(help_text, parse_mode='HTML', reply_markup=help_kb)

@dp.message(Command("game"))
async def game_command(message: types.Message):
    """Команда для игры прямо в чате"""
    user_id = message.from_user.id
    
    # Получаем вопрос для игры
    question = game_manager.get_game_question(user_id)
    
    if question['type'] == 'multiple_choice':
        # Создаем клавиатуру с вариантами ответов
        options_kb = InlineKeyboardMarkup(inline_keyboard=[])
        
        for option in question['options']:
            options_kb.inline_keyboard.append([
                InlineKeyboardButton(text=option, callback_data=f"answer_{option}")
            ])
        
        options_kb.inline_keyboard.append([
            InlineKeyboardButton(text="🎮 Открыть полную игру", web_app=WebAppInfo(url=WEBAPP_URL))
        ])
        
        await message.answer(
            f"🎯 <b>Вопрос:</b>\n{question['question']}\n\n"
            f"⏱ У тебя есть 30 секунд чтобы ответить!",
            reply_markup=options_kb,
            parse_mode='HTML'
        )
        
        # Сохраняем правильный ответ в временное хранилище
        if not hasattr(game_command, 'active_questions'):
            game_command.active_questions = {}
        
        game_command.active_questions[message.message_id] = {
            'correct_answer': question['correct_answer'],
            'user_id': user_id
        }
        
        # Удаляем вопрос через 30 секунд
        await asyncio.sleep(30)
        if message.message_id in game_command.active_questions:
            del game_command.active_questions[message.message_id]
            try:
                await message.edit_text("⏰ Время вышло! Правильный ответ: " + question['correct_answer'])
            except:
                pass
                
    else:
        await message.answer(
            f"🎯 <b>Вопрос:</b>\n{question['question']}\n\n"
            f"Напиши ответ текстовым сообщением в течение 30 секунд!\n\n"
            f"Правильный ответ: ||{question['correct_answer']}||",
            parse_mode='HTML'
        )

@dp.message(Command("words"))
async def words_command(message: types.Message):
    """Показать изученные слова пользователя"""
    user_id = message.from_user.id
    user_words = game_manager.get_user_words(user_id)
    
    if not user_words:
        await message.answer(
            "📝 У тебя пока нет сохраненных слов.\n\n"
            "Добавь свои первые слова через WebApp или используй команду /addword",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="📚 Добавить слова", web_app=WebAppInfo(url=WEBAPP_URL))]
            ])
        )
        return
    
    # Показываем последние 5 слов
    recent_words = user_words[:5]
    
    words_text = "📚 <b>Твои последние слова:</b>\n\n"
    for i, word in enumerate(recent_words, 1):
        words_text += f"{i}. <b>{word['english']}</b> - {word['russian']}\n"
        if word['example'] and word['example'] != 'Пример не добавлен':
            words_text += f"   📝 <i>{word['example']}</i>\n"
        words_text += f"   📅 {word['date']}\n\n"
    
    if len(user_words) > 5:
        words_text += f"... и еще {len(user_words) - 5} слов\n\n"
    
    words_text += "Для просмотра всех слов и управления ими открой WebApp 👇"
    
    await message.answer(
        words_text,
        parse_mode='HTML',
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📖 Открыть все слова", web_app=WebAppInfo(url=WEBAPP_URL))],
            [InlineKeyboardButton(text="🎮 Играть со словами", callback_data="game")]
        ])
    )

@dp.message(Command("stats"))
async def stats_command(message: types.Message):
    """Показать статистику пользователя"""
    user_id = message.from_user.id
    stats = game_manager.get_user_stats(user_id)
    
    stats_text = f"""
📊 <b>Твоя статистика:</b>

📝 <b>Всего слов:</b> {stats['word_count']}
    """
    
    if stats['last_word']:
        stats_text += f"""
🎯 <b>Последнее слово:</b> {stats['last_word'][0]} - {stats['last_word'][1]}
📅 <b>Добавлено:</b> {stats['last_word'][2]}
        """
    
    stats_text += f"""
    
🏆 <b>Общая статистика бота:</b>
👥 <b>Пользователей:</b> {db.count_users()}

Продолжай в том же духе! 💪
    """
    
    await message.answer(stats_text, parse_mode='HTML', reply_markup=help_kb)

@dp.message(Command("addword"))
async def add_word_command(message: types.Message):
    """Команда для добавления слова через чат"""
    await message.answer(
        "📝 <b>Добавление нового слова</b>\n\n"
        "Для удобного добавления слов с переводом и примерами используй наше WebApp приложение!\n\n"
        "Там ты можешь:\n"
        "• Быстро добавлять слова\n"
        "• Указывать перевод и примеры\n"
        "• Сразу видеть все свои слова\n"
        "• Играть с добавленными словами",
        parse_mode='HTML',
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="➕ Добавить слово", web_app=WebAppInfo(url=WEBAPP_URL))]
        ])
    )

@dp.callback_query()
async def handle_callbacks(callback: types.CallbackQuery):
    """Обработка callback запросов от inline кнопок"""
    user_id = callback.from_user.id
    
    if callback.data == "stats":
        # Показать статистику
        stats = game_manager.get_user_stats(user_id)
        stats_text = f"📊 <b>Твоя статистика:</b>\n\n📝 Слов: {stats['word_count']}"
        await callback.message.edit_text(stats_text, parse_mode='HTML')
        
    elif callback.data == "game":
        # Начать игру
        question = game_manager.get_game_question(user_id)
        
        if question['type'] == 'multiple_choice':
            options_kb = InlineKeyboardMarkup(inline_keyboard=[])
            
            for option in question['options']:
                options_kb.inline_keyboard.append([
                    InlineKeyboardButton(text=option, callback_data=f"answer_{option}")
                ])
            
            await callback.message.edit_text(
                f"🎯 <b>Вопрос:</b>\n{question['question']}",
                reply_markup=options_kb,
                parse_mode='HTML'
            )
            
            # Сохраняем правильный ответ
            if not hasattr(handle_callbacks, 'active_questions'):
                handle_callbacks.active_questions = {}
            
            handle_callbacks.active_questions[callback.message.message_id] = {
                'correct_answer': question['correct_answer'],
                'user_id': user_id
            }
    
    elif callback.data == "words":
        # Показать слова
        user_words = game_manager.get_user_words(user_id)
        
        if not user_words:
            await callback.message.edit_text(
                "📝 У тебя пока нет сохраненных слов.\n\nДобавь свои первые слова через WebApp!",
                reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="📚 Добавить слова", web_app=WebAppInfo(url=WEBAPP_URL))]
                ])
            )
            return
        
        recent_words = user_words[:3]
        words_text = "📚 <b>Твои последние слова:</b>\n\n"
        for word in recent_words:
            words_text += f"• <b>{word['english']}</b> - {word['russian']}\n"
        
        await callback.message.edit_text(
            words_text,
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="📖 Все слова", web_app=WebAppInfo(url=WEBAPP_URL))],
                [InlineKeyboardButton(text="🎮 Играть", callback_data="game")]
            ])
        )
    
    elif callback.data.startswith("answer_"):
        # Обработка ответа на вопрос
        user_answer = callback.data.replace("answer_", "")
        message_id = callback.message.message_id
        
        # Получаем активный вопрос
        active_questions = getattr(handle_callbacks, 'active_questions', {})
        
        if message_id in active_questions:
            correct_answer = active_questions[message_id]['correct_answer']
            is_correct = user_answer == correct_answer
            
            if is_correct:
                result_text = f"✅ <b>Правильно!</b>\n\nТы отлично справился!"
            else:
                result_text = f"❌ <b>Неправильно!</b>\n\nПравильный ответ: {correct_answer}"
            
            # Удаляем вопрос из активных
            del active_questions[message_id]
            
            await callback.message.edit_text(
                result_text,
                parse_mode='HTML',
                reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="🎮 Следующий вопрос", callback_data="game")],
                    [InlineKeyboardButton(text="📚 Мои слова", callback_data="words")]
                ])
            )
    
    await callback.answer()

@dp.message()
async def handle_web_app_data(message: types.Message):
    """Обработка данных из WebApp и обычных сообщений"""
    
    # Обработка данных из WebApp
    if message.web_app_data:
        try:
            data = json.loads(message.web_app_data.data)
            user_id = message.from_user.id
            
            logging.info(f"Received WebApp data from user {user_id}: {data}")
            
            # Обработка разных типов данных из WebApp
            if data.get('type') == 'save_word':
                # Сохранение нового слова
                english_word = data.get('english')
                russian_translation = data.get('russian')
                example = data.get('example', '')
                
                success = game_manager.save_user_word(user_id, english_word, russian_translation, example)
                
                if success:
                    await message.answer(
                        f"✅ Слово <b>{english_word}</b> успешно сохранено!\n"
                        f"Перевод: {russian_translation}",
                        parse_mode='HTML'
                    )
                else:
                    await message.answer("❌ Произошла ошибка при сохранении слова")
                    
            elif data.get('type') == 'get_words':
                # Запрос слов пользователя
                user_words = game_manager.get_user_words(user_id)
                await message.answer(f"📚 У тебя {len(user_words)} сохраненных слов")
                
            elif data.get('type') == 'game_result':
                # Результат игры из WebApp
                score = data.get('score', 0)
                total = data.get('total', 5)
                
                if score == total:
                    reaction = "🎉 Отличный результат! Ты просто гений! 🎉"
                elif score >= total * 0.7:
                    reaction = "👍 Отлично! Продолжайте в том же духе!"
                elif score >= total * 0.5:
                    reaction = "💪 Хорошо! Есть куда стремиться!"
                else:
                    reaction = "📚 Не сдавайся! Практика ведет к совершенству!"
                
                await message.answer(
                    f"🎮 <b>Результат игры:</b>\n\n"
                    f"🏆 Счет: {score}/{total}\n"
                    f"✨ {reaction}",
                    parse_mode='HTML'
                )
            
        except Exception as e:
            logging.error(f"Error processing WebApp data: {e}")
            await message.answer("❌ Произошла ошибка при обработке данных")
    
    # Обработка обычных текстовых сообщений (простые ответы)
    else:
        text = message.text.lower()
        
        if any(word in text for word in ['привет', 'hello', 'hi', 'start']):
            await message.answer(
                f"👋 Привет, {message.from_user.first_name}!\n"
                f"Используй /help чтобы узнать что я умею!",
                reply_markup=help_kb
            )
        elif any(word in text for word in ['слово', 'word', 'добавить']):
            await message.answer(
                "Чтобы добавить новое слово, используй WebApp приложение 👇",
                reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="➕ Добавить слово", web_app=WebAppInfo(url=WEBAPP_URL))]
                ])
            )
        elif any(word in text for word in ['игра', 'game', 'играть']):
            await game_command(message)
        elif any(word in text for word in ['статистика', 'stats', 'стата']):
            await stats_command(message)
        else:
            # Если сообщение не распознано, предлагаем помощь
            await message.answer(
                "Я не совсем понял что ты имеешь в виду 😊\n"
                "Используй /help чтобы узнать что я умею!",
                reply_markup=help_kb
            )

async def main():
    logging.info("Бот запускается...")
    
    # Создаем таблицу для пользовательских слов если её нет
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                english_word TEXT NOT NULL,
                russian_translation TEXT NOT NULL,
                example TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        logging.info("Таблица user_words готова")
    except Exception as e:
        logging.error(f"Error creating user_words table: {e}")
    
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    asyncio.run(main())
