// Получаем элементы
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const screen4 = document.getElementById('screen4');
const screen5 = document.getElementById('screen5');
const screen6 = document.getElementById('screen6');
const screen7 = document.getElementById('screen7');
const screen8 = document.getElementById('screen8');
const screen9 = document.getElementById('screen9');

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
const backToThirdFrom8 = document.getElementById('backToThirdFrom8');
const backToThirdFrom9 = document.getElementById('backToThirdFrom9');

const newWordBtn = document.getElementById('newWordBtn');
const studyWordsBtn = document.getElementById('studyWordsBtn');
const translatorBtn = document.getElementById('translatorBtn');
const gameBtn = document.getElementById('gameBtn');
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

// Элементы для изученных слов
const wordSearch = document.getElementById('wordSearch');
const wordsList = document.getElementById('wordsList');
const emptyState = document.getElementById('emptyState');
const addFirstWord = document.getElementById('addFirstWord');

// Элементы игры
const currentQuestionNumber = document.getElementById('currentQuestionNumber');
const currentScore = document.getElementById('currentScore');
const questionText = document.getElementById('questionText');
const timerElement = document.getElementById('timer');
const optionsContainer = document.getElementById('optionsContainer');
const inputAnswerContainer = document.getElementById('inputAnswerContainer');
const inputAnswer = document.getElementById('inputAnswer');
const submitAnswer = document.getElementById('submitAnswer');
const resultElement = document.getElementById('result');
const nextQuestionBtn = document.getElementById('nextQuestion');
const restartGameBtn = document.getElementById('restartGame');

// Конфетти
const confettiCanvas = document.getElementById('confettiCanvas');

let userName = '';
let currentEnglishWordValue = '';
let currentRussianWordValue = '';

// Переменные игры
let gameState = {
    currentQuestion: {},
    timer: null,
    timeLeft: 0,
    score: 0,
    questionsAnswered: 0,
    totalQuestions: 5,
    isGameActive: false
};

// ==================== ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ ====================

// Инициализация конфетти
function initConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

// Функция для запуска конфетти
function launchConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    const particles = [];
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 10 + 5,
            speed: Math.random() * 3 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        let particlesAlive = false;
        
        particles.forEach(particle => {
            particle.y += particle.speed;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.y < confettiCanvas.height) {
                particlesAlive = true;
            }
            
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
        });
        
        if (particlesAlive) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Улучшенная функция для переключения экранов с анимацией
function showScreen(screenToShow) {
    const currentScreen = document.querySelector('.screen.active');
    
    if (currentScreen) {
        // Анимация исчезновения текущего экрана
        currentScreen.style.animation = 'screenSlideOut 0.4s ease-in forwards';
        
        setTimeout(() => {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Анимация появления нового экрана
            screenToShow.classList.add('active');
            screenToShow.style.animation = 'screenSlideIn 0.6s ease-out';
            
        }, 400);
    } else {
        screenToShow.classList.add('active');
    }
}

// Добавляем CSS для анимации исчезновения
const style = document.createElement('style');
style.textContent = `
    @keyframes screenSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
        }
    }
`;
document.head.appendChild(style);

// Обработчики событий для навигации
continueBtn1.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (userName) {
        userNameSpan.textContent = userName;
        showScreen(screen2);
    } else {
        // Анимация shake для пустого поля
        nameInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => nameInput.style.animation = '', 500);
        
        // Добавляем CSS для shake анимации
        if (!document.querySelector('#shake-animation')) {
            const shakeStyle = document.createElement('style');
            shakeStyle.id = 'shake-animation';
            shakeStyle.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(shakeStyle);
        }
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
    englishWordInput.value = '';
});

studyWordsBtn.addEventListener('click', () => {
    loadStudiedWords();
    showScreen(screen8);
});

translatorBtn.addEventListener('click', () => {
    showScreen(screen4);
});

gameBtn.addEventListener('click', () => {
    startGame();
    showScreen(screen9);
});

// Обработчики для экранов 5-6-7
continueBtn5.addEventListener('click', () => {
    currentEnglishWordValue = englishWordInput.value.trim();
    if (currentEnglishWordValue) {
        currentEnglishWord.textContent = currentEnglishWordValue;
        showScreen(screen6);
        russianWordInput.value = '';
    } else {
        englishWordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => englishWordInput.style.animation = '', 500);
    }
});

toExampleBtn.addEventListener('click', () => {
    currentRussianWordValue = russianWordInput.value.trim();
    if (currentRussianWordValue) {
        currentWordDisplay.textContent = currentEnglishWordValue;
        currentTranslationDisplay.textContent = currentRussianWordValue;
        showScreen(screen7);
        exampleInput.value = '';
    } else {
        russianWordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => russianWordInput.style.animation = '', 500);
    }
});

saveWordBtn.addEventListener('click', () => {
    const example = exampleInput.value.trim();
    
    const wordData = {
        english: currentEnglishWordValue,
        russian: currentRussianWordValue,
        example: example || 'Пример не добавлен',
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    saveWordToStorage(wordData);
    
    // Запускаем конфетти при успешном сохранении
    launchConfetti();
    
    // Показываем анимированное сообщение
    showAnimatedMessage(`Слово "${currentEnglishWordValue}" успешно сохранено!`, 'success');
    
    setTimeout(() => {
        showScreen(screen3);
    }, 2000);
});

// Функция для показа анимированных сообщений
function showAnimatedMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #ff6b6b, #ee5a52)'};
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: 600;
        z-index: 1001;
        animation: messagePop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.remove();
    }, 2000);
}

// Добавляем CSS для анимации сообщений
const messageStyle = document.createElement('style');
messageStyle.textContent = `
    @keyframes messagePop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        70% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(messageStyle);

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
}

// ==================== ЛОГИКА ПЕРЕВОДЧИКА ====================

// Логика переводчика
swapLangs.addEventListener('click', () => {
    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;
    
    // Анимация для кнопки swap
    swapLangs.style.transform = 'rotate(180deg) scale(1.1)';
    setTimeout(() => {
        swapLangs.style.transform = '';
    }, 400);
});

translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    const fromLang = sourceLang.value;
    const toLang = targetLang.value;

    if (!text) {
        translationResult.innerHTML = '<p style="color: #ff6b6b;">Пожалуйста, введите текст для перевода</p>';
        sourceText.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => sourceText.style.animation = '', 500);
        return;
    }

    // Анимация загрузки
    translationResult.innerHTML = `
        <div class="loading-animation">
            <div class="spinner"></div>
            <p>Переводим...</p>
        </div>
    `;

    // Добавляем стили для спиннера
    if (!document.querySelector('#spinner-style')) {
        const spinnerStyle = document.createElement('style');
        spinnerStyle.id = 'spinner-style';
        spinnerStyle.textContent = `
            .loading-animation {
                text-align: center;
            }
            .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #667eea;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);
    }

    try {
        const translatedText = await translateText(text, fromLang, toLang);
        translationResult.innerHTML = `
            <div class="translation-success">
                <span style="font-size: 24px; margin-bottom: 10px; display: block;">✅</span>
                <p><strong>Перевод:</strong><br>${translatedText}</p>
            </div>
        `;
    } catch (error) {
        console.error('Ошибка перевода:', error);
        translationResult.innerHTML = `
            <div class="translation-error">
                <span style="font-size: 24px; margin-bottom: 10px; display: block;">❌</span>
                <p>Ошибка перевода. Попробуйте еще раз.</p>
            </div>
        `;
    }
});

// Функция перевода
async function translateText(text, sourceLang, targetLang) {
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
        return await fallbackTranslate(text, sourceLang, targetLang);
    }
}

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
        return getDemoTranslation(text, sourceLang, targetLang);
    }
}

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

// ==================== ЛОГИКА ИЗУЧЕННЫХ СЛОВ ====================

// Обработчик для кнопки назад из изученных слов
backToThirdFrom8.addEventListener('click', () => {
    showScreen(screen3);
});

// Обработчик для кнопки "Добавить первое слово"
addFirstWord.addEventListener('click', () => {
    showScreen(screen5);
});

// Функция загрузки изученных слов
function loadStudiedWords(filter = '') {
    const savedWords = JSON.parse(localStorage.getItem('userWords') || '[]');
    
    if (savedWords.length === 0) {
        wordsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    wordsList.style.display = 'block';
    
    // Очищаем список
    wordsList.innerHTML = '';
    
    // Фильтруем слова если есть поисковый запрос
    const filteredWords = savedWords.filter(word => 
        word.english.toLowerCase().includes(filter.toLowerCase()) ||
        word.russian.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredWords.length === 0) {
        wordsList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔍</span>
                <p>Слова по запросу "${filter}" не найдены</p>
            </div>
        `;
        return;
    }
    
    // Добавляем слова в список с анимацией
    filteredWords.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.style.animationDelay = `${index * 0.1}s`;
        
        // Подсветка совпадений при поиске
        const highlightEnglish = filter ? 
            word.english.replace(new RegExp(filter, 'gi'), match => 
                `<span class="search-highlight">${match}</span>`) : 
            word.english;
            
        const highlightRussian = filter ? 
            word.russian.replace(new RegExp(filter, 'gi'), match => 
                `<span class="search-highlight">${match}</span>`) : 
            word.russian;
        
        wordItem.innerHTML = `
            <div class="word-item-header">
                <div class="word-pair">
                    <span class="word-english">${highlightEnglish}</span> - 
                    <span class="word-translation">${highlightRussian}</span>
                </div>
                <button class="delete-word-btn" data-word="${word.english}" title="Удалить слово">
                    🗑️
                </button>
            </div>
            <div class="word-example">
                📝 ${word.example}
            </div>
            <div class="word-date">
                Добавлено: ${word.date}
            </div>
        `;
        
        // Добавляем анимацию при клике на слово
        wordItem.addEventListener('click', function(e) {
            // Игнорируем клики по кнопке удаления
            if (e.target.classList.contains('delete-word-btn')) {
                return;
            }
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'wordItemAppear 0.3s ease-out';
            }, 10);
        });
        
        wordsList.appendChild(wordItem);
        
        // Обработчик для кнопки удаления
        const deleteBtn = wordItem.querySelector('.delete-word-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            const englishWord = this.getAttribute('data-word');
            const russianWord = word.russian;
            
            if (confirm(`Вы уверены, что хотите удалить слово "${englishWord}" (${russianWord})?`)) {
                deleteWord(englishWord);
            }
        });
    });
}

// Функция для удаления отдельного слова
function deleteWord(englishWord) {
    let words = JSON.parse(localStorage.getItem('userWords') || '[]');
    
    // Фильтруем массив, исключая удаляемое слово
    const filteredWords = words.filter(word => word.english !== englishWord);
    
    // Сохраняем обновленный массив
    localStorage.setItem('userWords', JSON.stringify(filteredWords));
    
    // Показываем уведомление
    showAnimatedMessage(`Слово "${englishWord}" удалено`, 'success');
    
    // Перезагружаем список слов с текущим поисковым запросом
    const currentSearch = wordSearch.value.trim();
    loadStudiedWords(currentSearch);
    
    console.log(`Слово "${englishWord}" удалено из хранилища`);
}

// Обработчик поиска
wordSearch.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    loadStudiedWords(searchTerm);
    
    // Анимация для иконки поиска
    const searchIcon = this.parentNode.querySelector('.search-icon');
    if (searchTerm) {
        searchIcon.style.animation = 'bounce 0.5s ease-in-out';
        setTimeout(() => {
            searchIcon.style.animation = '';
        }, 500);
    }
});

// Обработчик Enter в поиске
wordSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        this.blur(); // Убираем фокус при нажатии Enter
    }
});

// Получаем кнопку удаления всех слов
const deleteAllWordsBtn = document.getElementById('ButtonDelet')?.querySelector('button');

// Обработчик нажатия на корзину (удаление всех слов)
if (deleteAllWordsBtn) {
    deleteAllWordsBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите удалить все изученные слова?')) {
            localStorage.removeItem('userWords');
            loadStudiedWords(); // Перезагружаем список
            showAnimatedMessage('Все слова удалены', 'success');
        }
    });
}

// ==================== ЛОГИКА ИГРЫ ====================

// Обработчики элементов игры
submitAnswer.addEventListener('click', checkInputAnswer);
nextQuestionBtn.addEventListener('click', getNextQuestion);
restartGameBtn.addEventListener('click', startGame);

// Обработчик возврата из игры
backToThirdFrom9.addEventListener('click', () => {
    stopGame();
    showScreen(screen3);
});

// Обработчик Enter в поле ввода игры
inputAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkInputAnswer();
    }
});

function startGame() {
    gameState = {
        currentQuestion: {},
        timer: null,
        timeLeft: 0,
        score: 0,
        questionsAnswered: 0,
        totalQuestions: 5,
        isGameActive: true
    };
    
    updateGameStats();
    resetGameUI();
    getNextQuestion();
}

function stopGame() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    gameState.isGameActive = false;
}

function updateGameStats() {
    currentQuestionNumber.textContent = `${gameState.questionsAnswered + 1}/${gameState.totalQuestions}`;
    currentScore.textContent = gameState.score;
}

function resetGameUI() {
    // Сбрасываем UI
    optionsContainer.style.display = 'block';
    inputAnswerContainer.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    restartGameBtn.style.display = 'none';
    resultElement.textContent = '';
    resultElement.className = 'result';
    timerElement.style.display = 'block';
    timerElement.classList.remove('shake');
    
    // Очищаем варианты ответов
    optionsContainer.innerHTML = '';
    
    // Сбрасываем поле ввода
    inputAnswer.value = '';
}

async function getNextQuestion() {
    if (!gameState.isGameActive) return;
    
    resetGameUI();
    gameState.questionsAnswered++;
    updateGameStats();
    
    try {
        // Получаем вопрос из изученных слов или используем демо-вопросы
        const question = await getQuestionFromLearnedWords();
        gameState.currentQuestion = question;
        
        if (question.type === 'multiple_choice') {
            showMultipleChoiceQuestion();
        } else {
            showInputQuestion();
        }
        
        startTimer();
    } catch (error) {
        console.error('Error getting question:', error);
        // Используем демо-вопрос при ошибке
        getDemoQuestion();
    }
}

function getQuestionFromLearnedWords() {
    return new Promise((resolve) => {
        const savedWords = JSON.parse(localStorage.getItem('userWords') || '[]');
        
        if (savedWords.length === 0) {
            // Если нет изученных слов, используем демо-вопрос
            resolve(getDemoQuestion());
            return;
        }
        
        // Выбираем случайное слово из изученных
        const randomWord = savedWords[Math.floor(Math.random() * savedWords.length)];
        
        // Случайно выбираем тип вопроса
        const questionType = Math.random() > 0.5 ? 'multiple_choice' : 'input';
        
        if (questionType === 'multiple_choice') {
            // Создаем варианты ответов
            const wrongOptions = getWrongOptions(savedWords, randomWord.russian);
            const options = [...wrongOptions, randomWord.russian].sort(() => Math.random() - 0.5);
            
            resolve({
                type: 'multiple_choice',
                question: `Какой перевод имеет слово "${randomWord.english}"?`,
                correct_answer: randomWord.russian,
                options: options
            });
        } else {
            resolve({
                type: 'input',
                question: `Напишите перевод слова "${randomWord.english}"`,
                correct_answer: randomWord.russian
            });
        }
    });
}

function getWrongOptions(words, correctAnswer) {
    const wrongOptions = [];
    const usedIndices = new Set();
    
    while (wrongOptions.length < 3 && usedIndices.size < words.length) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            const word = words[randomIndex];
            if (word.russian !== correctAnswer && !wrongOptions.includes(word.russian)) {
                wrongOptions.push(word.russian);
            }
        }
    }
    
    // Если недостаточно неправильных вариантов, добавляем базовые
    const basicWrong = ['дом', 'машина', 'дерево', 'солнце', 'вода'];
    while (wrongOptions.length < 3) {
        const randomWrong = basicWrong[Math.floor(Math.random() * basicWrong.length)];
        if (!wrongOptions.includes(randomWrong) && randomWrong !== correctAnswer) {
            wrongOptions.push(randomWrong);
        }
    }
    
    return wrongOptions.slice(0, 3);
}

function getDemoQuestion() {
    const demoQuestions = [
        {
            type: 'multiple_choice',
            question: 'Какой перевод имеет слово "cat"?',
            correct_answer: 'кошка',
            options: ['кошка', 'собака', 'шар', 'дом']
        },
        {
            type: 'multiple_choice',
            question: 'Какой перевод имеет слова "book"?',
            correct_answer: 'книга',
            options: ['ручка', 'книга', 'стол', 'окно']
        },
        {
            type: 'input',
            question: 'Напишите перевод слова "dog"',
            correct_answer: 'собака'
        },
        {
            type: 'input',
            question: 'Напишите перевод слова "house"',
            correct_answer: 'дом'
        }
    ];
    
    return demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
}

function showMultipleChoiceQuestion() {
    questionText.textContent = gameState.currentQuestion.question;
    
    gameState.currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
}

function showInputQuestion() {
    questionText.textContent = gameState.currentQuestion.question;
    optionsContainer.style.display = 'none';
    inputAnswerContainer.style.display = 'block';
    inputAnswer.value = '';
    inputAnswer.focus();
}

function startTimer() {
    gameState.timeLeft = 5;
    timerElement.textContent = `⏰ Время: ${gameState.timeLeft}с`;
    timerElement.style.color = '#dc3545';
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerElement.textContent = `⏰ Время: ${gameState.timeLeft}с`;
        
        if (gameState.timeLeft <= 3) {
            timerElement.style.color = '#ff6b6b';
            timerElement.classList.add('shake');
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            handleTimeOut();
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
    if (!gameState.isGameActive) return;
    
    clearInterval(gameState.timer);
    timerElement.classList.remove('shake');
    
    const isCorrect = selectedAnswer === gameState.currentQuestion.correct_answer;
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    
    // Показываем правильные/неправильные ответы
    optionButtons.forEach(button => {
        const buttonText = button.textContent.slice(3); // Убираем букву варианта
        button.disabled = true;
        
        if (buttonText === gameState.currentQuestion.correct_answer) {
            button.classList.add('correct');
        } else if (buttonText === selectedAnswer && !isCorrect) {
            button.classList.add('incorrect');
        }
    });
    
    showResult(isCorrect);
}

function checkInputAnswer() {
    if (!gameState.isGameActive) return;
    
    clearInterval(gameState.timer);
    timerElement.classList.remove('shake');
    
    const userAnswer = inputAnswer.value.trim().toLowerCase();
    const correctAnswer = gameState.currentQuestion.correct_answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    showResult(isCorrect);
}

function handleTimeOut() {
    timerElement.classList.remove('shake');
    
    if (gameState.currentQuestion.type === 'multiple_choice') {
        const optionButtons = optionsContainer.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            const buttonText = button.textContent.slice(3);
            button.disabled = true;
            if (buttonText === gameState.currentQuestion.correct_answer) {
                button.classList.add('correct');
            }
        });
    }
    
    showResult(false, true);
}

function showResult(isCorrect, isTimeout = false) {
    if (isTimeout) {
        resultElement.textContent = `⏰ Время вышло! Правильный ответ: ${gameState.currentQuestion.correct_answer}`;
        resultElement.className = 'result timeout';
    } else if (isCorrect) {
        gameState.score++;
        currentScore.textContent = gameState.score;
        resultElement.textContent = '✅ Правильно! Отличная работа!';
        resultElement.className = 'result correct';
        launchConfetti();
    } else {
        resultElement.textContent = `❌ Неправильно! Правильный ответ: ${gameState.currentQuestion.correct_answer}`;
        resultElement.className = 'result incorrect';
    }
    
    showNextButton();
}

function showNextButton() {
    if (gameState.questionsAnswered < gameState.totalQuestions) {
        nextQuestionBtn.style.display = 'block';
        nextQuestionBtn.textContent = 'Следующий вопрос';
    } else {
        showGameResults();
    }
}

function showGameResults() {
    questionText.textContent = 'Игра завершена!';
    timerElement.style.display = 'none';
    optionsContainer.style.display = 'none';
    inputAnswerContainer.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    
    const percentage = (gameState.score / gameState.totalQuestions) * 100;
    let message = '';
    
    if (percentage >= 80) {
        message = '🎉 Отличный результат! Вы настоящий эксперт!';
    } else if (percentage >= 60) {
        message = '👍 Хорошая работа! Продолжайте в том же духе!';
    } else {
        message = '💪 Не сдавайтесь! Практика ведет к совершенству!';
    }
    
    resultElement.innerHTML = `
        <div style="text-align: center;">
            <h3>Ваш результат: ${gameState.score} из ${gameState.totalQuestions}</h3>
            <p>${message}</p>
        </div>
    `;
    resultElement.className = 'result';
    
    restartGameBtn.style.display = 'block';
    
    // Запускаем конфетти для хороших результатов
    if (percentage >= 60) {
        launchConfetti();
    }
}

// ==================== ОБЩИЕ ОБРАБОТЧИКИ ====================

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

sourceText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        translateBtn.click();
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение загружено!');
    initConfetti();
    
    const savedWords = JSON.parse(localStorage.getItem('userWords') || '[]');
    console.log('Сохраненные слова:', savedWords);
    
    // Автофокус на первом поле
    nameInput.focus();
});

// Обработка изменения размера окна
window.addEventListener('resize', initConfetti);
