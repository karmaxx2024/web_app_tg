// Получаем элементы
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const screen4 = document.getElementById('screen4');
const screen5 = document.getElementById('screen5');
const screen6 = document.getElementById('screen6');
const screen7 = document.getElementById('screen7');

const nameInput = document.getElementById('nameInput');
const continueBtn1 = document.getElementById('continueBtn1');
const continueBtn5 = document.getElementById('continueBtn5');
const readyBtn = document.getElementById('readyBtn');
const backToFirstBtn = document.getElementById('backToFirstBtn');
const backToSecondBtn = document.getElementById('backToSecondBtn');
const backToThirdBtn = document.getElementById('backToThirdBtn');
const backToThirdFrom5 = document.getElementById('backToThirdFrom5');
const backToFifthBtn = document.getElementById('backToFifthBtn');
const backToSixthBtn = document.getElementById('backToSixthBtn');

const newWordBtn = document.getElementById('newWordBtn');
const studyWordsBtn = document.getElementById('studyWordsBtn');
const translatorBtn = document.getElementById('translatorBtn');
const userNameSpan = document.getElementById('userNameSpan');
const userNameSpan3 = document.getElementById('userNameSpan3');

// Элементы для новых слов
const englishWordInput = document.getElementById('englishWordInput');
const russianWordInput = document.getElementById('russianWordInput');
const toExampleBtn = document.getElementById('toExampleBtn');
const currentEnglishWord = document.getElementById('currentEnglishWord');
const currentWordDisplay = document.getElementById('currentWordDisplay');
const currentTranslationDisplay = document.getElementById('currentTranslationDisplay');
const exampleInput = document.getElementById('exampleInput');
const saveWordBtn = document.getElementById('saveWordBtn');

// Элементы переводчика
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const swapLangs = document.getElementById('swapLangs');
const sourceText = document.getElementById('sourceText');
const translateBtn = document.getElementById('translateBtn');
const translationResult = document.getElementById('translationResult');

let userName = '';
let currentEnglishWordValue = '';
let currentRussianWordValue = '';

// Функция для переключения экранов
function showScreen(screenToShow) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    screenToShow.classList.add('active');
}

// Обработчики событий для навигации
continueBtn1.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (userName) {
        userNameSpan.textContent = userName;
        showScreen(screen2);
    } else {
        alert('Пожалуйста, введите ваше имя');
    }
});

readyBtn.addEventListener('click', () => {
    userNameSpan3.textContent = userName;
    showScreen(screen3);
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
    showScreen(screen5);
    englishWordInput.value = ''; // Очищаем поле при каждом входе
});

studyWordsBtn.addEventListener('click', () => {
    alert('Функция "Изучение слова" будет реализована позже');
});

translatorBtn.addEventListener('click', () => {
    showScreen(screen4);
});

// Обработчики для экранов 5-6-7
continueBtn5.addEventListener('click', () => {
    currentEnglishWordValue = englishWordInput.value.trim();
    if (currentEnglishWordValue) {
        currentEnglishWord.textContent = currentEnglishWordValue;
        showScreen(screen6);
        russianWordInput.value = ''; // Очищаем поле перевода
    } else {
        alert('Пожалуйста, введите слово на английском');
    }
});

toExampleBtn.addEventListener('click', () => {
    currentRussianWordValue = russianWordInput.value.trim();
    if (currentRussianWordValue) {
        currentWordDisplay.textContent = currentEnglishWordValue;
        currentTranslationDisplay.textContent = currentRussianWordValue;
        showScreen(screen7);
        exampleInput.value = ''; // Очищаем поле примера
    } else {
        alert('Пожалуйста, введите перевод слова');
    }
});

saveWordBtn.addEventListener('click', () => {
    const example = exampleInput.value.trim();
    
    // Создаем объект слова
    const wordData = {
        english: currentEnglishWordValue,
        russian: currentRussianWordValue,
        example: example || 'Пример не добавлен',
        date: new Date().toLocaleDateString()
    };
    
    // Сохраняем в localStorage
    saveWordToStorage(wordData);
    
    alert(`Слово "${currentEnglishWordValue}" успешно сохранено!`);
    
    // Возвращаемся на экран 3
    showScreen(screen3);
});

// Навигация назад между экранами 5-6-7
backToThirdFrom5.addEventListener('click', () => {
    showScreen(screen3);
});

backToFifthBtn.addEventListener('click', () => {
    showScreen(screen5);
});

backToSixthBtn.addEventListener('click', () => {
    showScreen(screen6);
});

// Функция для сохранения слова в localStorage
function saveWordToStorage(wordData) {
    let words = JSON.parse(localStorage.getItem('userWords') || '[]');
    words.push(wordData);
    localStorage.setItem('userWords', JSON.stringify(words));
    console.log('Слово сохранено:', wordData);
    console.log('Все слова:', words);
}

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

// Обработчики клавиши Enter
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        continueBtn1.click();
    }
});

englishWordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        continueBtn5.click();
    }
});

russianWordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        toExampleBtn.click();
    }
});

exampleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveWordBtn.click();
    }
});

// Enter в поле ввода переводчика (Ctrl+Enter для перевода)
sourceText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        translateBtn.click();
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение загружено!');
    // Можно добавить загрузку сохраненных слов при необходимости
    const savedWords = JSON.parse(localStorage.getItem('userWords') || '[]');
    console.log('Сохраненные слова:', savedWords);
});
