import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo, MenuButtonWebApp
import asyncio

API_TOKEN = '8473552598:AAHWg8HSnnPTbgtVxkKC4WCiVMh_BRf4kK8'

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

WEBAPP_URL = "https://karmaxx2024.github.io/web_app_tg/"

# Кнопка для меню (слева от поля ввода)
menu_button = MenuButtonWebApp(text="Открыть WebApp", web_app=WebAppInfo(url=WEBAPP_URL))

# Клавиатура для сообщения (оставляем на всякий случай)
kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="Открыть WebApp", web_app=WebAppInfo(url=WEBAPP_URL))]
])

@dp.message(Command("start"))
async def start_command(message: types.Message):
    # Устанавливаем кнопку меню для пользователя
    await bot.set_chat_menu_button(
        chat_id=message.chat.id,
        menu_button=menu_button
    )
    await message.answer("Привет! Я твой бот. Теперь слева от поля ввода есть кнопка WebApp!", reply_markup=kb)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
