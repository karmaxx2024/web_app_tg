import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo
import asyncio

API_TOKEN = '8473552598:AAHWg8HSnnPTbgtVxkKC4WCiVMh_BRf4kK8'

bot = Bot(token=API_TOKEN)
dp = Dispatcher()


WEBAPP_URL = "https://your-app.loca.lt"

kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="Открыть WebApp", web_app=WebAppInfo(url="https://localhost:5001"))]
])

@dp.message(Command("start"))
async def start_command(message: types.Message):
    await message.answer("Привет! Я твой бот", reply_markup=kb)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())