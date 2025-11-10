// Получаем элементы
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const screen4 = document.getElementById('screen4');
const nameInput = document.getElementById('nameInput');
const continueBtn = document.getElementById('continueBtn');
const readyBtn = document.getElementById('readyBtn');
const backToFirstBtn = document.getElementById('backToFirstBtn');
const backToSecondBtn = document.getElementById('backToSecondBtn');
const backToThirdBtn = document.getElementById('backToThirdBtn');
const newWordBtn = document.getElementById('newWordBtn');
const studyWordsBtn = document.getElementById('studyWordsBtn');
const translatorBtn = document.getElementById('translatorBtn');
const userNameSpan = document.getElementById('userNameSpan');
const userNameSpan3 = document.getElementById('userNameSpan3');

// Элементы переводчика
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const swapLangs = document.getElementById('swapLangs');
const sourceText = document.getElementById('sourceText');
const translateBtn = document.getElementById('translateBtn');
const translationResult = document.getElementById('translationResult');

let userName = '';

// Функция для переключения экранов
function showScreen(screenToShow) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    screenToShow.classList.add('active');
}

// ПРИ ЗАГРУЗКЕ ПРОВЕРЯЕМ НОВЫЙ ПОЛЬЗОВАТЕЛЬ ИЛИ СТАРЫЙ
document.addEventListener('DOMContentLoaded', function() {
    const savedName = localStorage.getItem('userName');
    
    if (savedName) {
        // СТАРЫЙ ПОЛЬЗОВАТЕЛЬ - сразу показываем экран выбора режима
        userName = savedName;
        userNameSpan3.textContent = userName;
        showScreen(screen3); // сразу на экран с выбором режима
    } else {
        // НОВЫЙ ПОЛЬЗОВАТЕЛЬ - показываем экран ввода имени
        showScreen(screen1);
        nameInput.focus(); // фокус на поле ввода
    }
});

// Обработчики событий для навигации
continueBtn.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (userName) {
        // Сохраняем имя для будущих посещений
        localStorage.setItem('userName', userName);
        userNameSpan.textContent = userName;
        showScreen(screen2); // переходим к описанию приложения
    } else {
        alert('Пожалуйста, введите ваше имя');
    }
});

readyBtn.addEventListener('click', () => {
    userNameSpan3.textContent = userName;
    showScreen(screen3); // переходим к выбору режима
});

backToFirstBtn.addEventListener('click', () => {
    showScreen(screen1);
});

backToSecondBtn.addEventListener('click', () => {
    showScreen(screen2);
});

backToThirdBtn.addEventListener('click', () => {
    showScreen(screen3);
});

// Обработчики для кнопок третьего экрана
newWordBtn.addEventListener('click', () => {
    alert('Функция "Новое слово" будет реализована позже');
});

studyWordsBtn.addEventListener('click', () => {
    alert('Функция "Изучение слова" будет реализована позже');
});

translatorBtn.addEventListener('click', () => {
    showScreen(screen4);
});

// Логика переводчика
swapLangs.addEventListener('click', () => {
    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;
});

translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    const fromLang = sourceLang.value;
    const toLang = targetLang.value;

    if (!text) {
        translationResult.innerHTML = '<p>Пожалуйста, введите текст для перевода</p>';
        return;
    }

    // Показываем загрузку
    translationResult.innerHTML = '<p>Переводим...</p>';

    try {
        const translatedText = await translateText(text, fromLang, toLang);
        translationResult.innerHTML = `<p><strong>Перевод:</strong><br>${translatedText}</p>`;
    } catch (error) {
        console.error('Ошибка перевода:', error);
        translationResult.innerHTML = '<p>Ошибка перевода. Попробуйте еще раз.</p>';
    }
});

// Улучшенная функция для перевода текста
async function translateText(text, sourceLang, targetLang) {
    // Используем LibreTranslate - бесплатный и открытый API
    const apiUrl = 'https://libretranslate.de/translate';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        
        const data = await response.json();
        return data.translatedText || text;
        
    } catch (error) {
        console.log('Пробуем запасной вариант перевода...');
        // Запасной вариант через MyMemory API
        return await fallbackTranslate(text, sourceLang, targetLang);
    }
}

// Запасной вариант перевода
async function fallbackTranslate(text, sourceLang, targetLang) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        // Если все API не работают, показываем демо-перевод
        return getDemoTranslation(text, sourceLang, targetLang);
    }
}

// Демо-переводы для тестирования
function getDemoTranslation(text, sourceLang, targetLang) {
    const demoTranslations = {
        'привет': {
            'en': 'hello', 'es': 'hola', 'fr': 'bonjour', 'de': 'hallo', 'zh': '你好', 'ja': 'こんにちは'
        },
        'спасибо': {
            'en': 'thank you', 'es': 'gracias', 'fr': 'merci', 'de': 'danke', 'zh': '谢谢', 'ja': 'ありがとう'
        },
        'да': {
            'en': 'yes', 'es': 'sí', 'fr': 'oui', 'de': 'ja', 'zh': '是', 'ja': 'はい'
        },
        'нет': {
            'en': 'no', 'es': 'no', 'fr': 'non', 'de': 'nein', 'zh': '不', 'ja': 'いいえ'
        }
    };
    
    const lowerText = text.toLowerCase();
    if (demoTranslations[lowerText] && demoTranslations[lowerText][targetLang]) {
        return demoTranslations[lowerText][targetLang];
    }
    
    return `[Демо] Перевод "${text}" с ${sourceLang} на ${targetLang}`;
}

// Enter на первом экране
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        continueBtn.click();
    }
});

// Enter в поле ввода переводчика (Ctrl+Enter для перевода)
sourceText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        translateBtn.click();
    }
});
