// API конфигурация
const API_BASE_URL = 'http://localhost:5000/api';

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

// Элементы для удаления слов
const deleteAllPanel = document.getElementById('deleteAllPanel');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const deleteConfirm = document.getElementById('deleteConfirm');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

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

// ==================== API ФУНКЦИИ ====================

// Функция для загрузки слов с сервера
async function loadWordsFromServer(searchTerm = '') {
    try {
        let url = `${API_BASE_URL}/words`;
        if (searchTerm) {
            url = `${API_BASE_URL}/search/${encodeURIComponent(searchTerm)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.words;
        } else {
            throw new Error(data.error || 'Ошибка загрузки слов');
        }
    } catch (error) {
        console.error('Ошибка при загрузке слов:', error);
        showAnimatedMessage('Ошибка загрузки слов', 'error');
        return [];
    }
}

// Функция для сохранения слова на сервер
async function saveWordToServer(wordData) {
    try {
        const response = await fetch(`${API_BASE_URL}/words`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wordData)
        });
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Ошибка при сохранении слова:', error);
        return false;
    }
}

// Функция для удаления слова с сервера
async function deleteWordFromServer(wordEnglish) {
    try {
        const response = await fetch(`${API_BASE_URL}/words/${encodeURIComponent(wordEnglish)}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Ошибка при удалении слова:', error);
        return false;
    }
}

// Функция для удаления всех слов с сервера
async function deleteAllWordsFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/words`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при удалении всех слов:', error);
        return { success: false, error: error.message };
    }
}

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

// Обработчики событий для навигации
continueBtn1.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (userName) {
        userNameSpan.textContent = userName;
        showScreen(screen2);
    } else {
        nameInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => nameInput.style.animation = '', 500);
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

studyWordsBtn.addEventListener('click', async () => {
    await loadStudiedWords();
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

saveWordBtn.addEventListener('click', async () => {
    const example = exampleInput.value.trim();
    
    const wordData = {
        english: currentEnglishWordValue,
        russian: currentRussianWordValue,
        example: example || 'Пример не добавлен',
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    // Сохраняем на сервере
    const saved = await saveWordToServer(wordData);
    
    if (saved) {
        // Запускаем конфетти при успешном сохранении
        launchConfetti();
        
        // Показываем анимированное сообщение
        showAnimatedMessage(`Слово "${currentEnglishWordValue}" успешно сохранено!`, 'success');
        
        setTimeout(() => {
            showScreen(screen3);
        }, 2000);
    } else {
        showAnimatedMessage('Ошибка сохранения слова', 'error');
    }
});

// Функция для показа анимированных сообщений
function showAnimatedMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 
                     type === 'warning' ? 'linear-gradient(135deg, #ff9800, #f57c00)' :
                     'linear-gradient(135deg, #ff6b6b, #ee5a52)'};
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

// Обработчик для кнопки "Добавить первое слово"
addFirstWord.addEventListener('click', () => {
    showScreen(screen5);
});

// ==================== ЛОГИКА ИЗУЧЕННЫХ СЛОВ (С API) ====================

// Обработчик для кнопки назад из изученных слов
backToThirdFrom8.addEventListener('click', () => {
    showScreen(screen3);
});

// Функция загрузки изученных слов с сервера
async function loadStudiedWords(searchTerm = '') {
    try {
        const words = await loadWordsFromServer(searchTerm);
        
        if (words.length === 0) {
            wordsList.style.display = 'none';
            emptyState.style.display = 'block';
            deleteAllPanel.style.display = 'none';
            return;
        }
        
        emptyState.style.display = 'none';
        wordsList.style.display = 'block';
        deleteAllPanel.style.display = 'block';
        
        // Очищаем список
        wordsList.innerHTML = '';
        
        // Добавляем слова в список с анимацией
        words.forEach((word, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.style.animationDelay = `${index * 0.1}s`;
            wordItem.dataset.wordEnglish = word.english;
            
            // Подсветка совпадений при поиске
            const highlightEnglish = searchTerm ? 
                word.english.replace(new RegExp(searchTerm, 'gi'), match => 
                    `<span class="search-highlight">${match}</span>`) : 
                word.english;
                
            const highlightRussian = searchTerm ? 
                word.russian.replace(new RegExp(searchTerm, 'gi'), match => 
                    `<span class="search-highlight">${match}</span>`) : 
                word.russian;
            
            wordItem.innerHTML = `
                <button class="word-delete-btn" data-word="${word.english}">🗑️</button>
                <div class="word-pair">
                    <span class="word-english">${highlightEnglish}</span> - 
                    <span class="word-translation">${highlightRussian}</span>
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
                if (!e.target.classList.contains('word-delete-btn')) {
                    this.style.animation = 'none';
                    setTimeout(() => {
                        this.style.animation = 'wordItemAppear 0.3s ease-out';
                    }, 10);
                }
            });
            
            wordsList.appendChild(wordItem);
        });
        
        // Добавляем обработчики для кнопок удаления отдельных слов
        setTimeout(() => {
            document.querySelectorAll('.word-delete-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const wordToDelete = this.dataset.word;
                    deleteSingleWord(wordToDelete, this.closest('.word-item'));
                });
            });
        }, 100);
        
    } catch (error) {
        console.error('Ошибка загрузки слов:', error);
        wordsList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">⚠️</span>
                <p>Ошибка загрузки слов</p>
                <button onclick="loadStudiedWords()" class="btn-primary">Попробовать снова</button>
            </div>
        `;
        deleteAllPanel.style.display = 'none';
    }
}

// Удаление отдельного слова
async function deleteSingleWord(wordEnglish, wordElement) {
    // Анимация подтверждения
    const deleteBtn = wordElement.querySelector('.word-delete-btn');
    deleteBtn.classList.add('confirm-pulse');
    deleteBtn.textContent = '❓';
    deleteBtn.style.background = 'rgba(255, 193, 7, 0.2)';
    
    // Восстанавливаем кнопку через 2 секунды если не подтверждено
    const timeoutId = setTimeout(() => {
        deleteBtn.classList.remove('confirm-pulse');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.background = '';
    }, 2000);
    
    // При повторном клике подтверждаем удаление
    const confirmDeleteHandler = async (e) => {
        e.stopPropagation();
        clearTimeout(timeoutId);
        
        // Анимация удаления
        wordElement.classList.add('deleting');
        
        // Удаляем с сервера
        const success = await deleteWordFromServer(wordEnglish);
        
        if (success) {
            // Показываем уведомление
            showDeleteNotification(`Слово "${wordEnglish}" удалено`);
            
            // Обновляем список после анимации
            setTimeout(() => {
                loadStudiedWords(wordSearch.value.trim());
            }, 400);
        } else {
            // В случае ошибки возвращаем элемент
            wordElement.classList.remove('deleting');
            deleteBtn.classList.remove('confirm-pulse');
            deleteBtn.textContent = '🗑️';
            deleteBtn.style.background = '';
            showAnimatedMessage('Ошибка удаления слова', 'error');
        }
    };
    
    // Заменяем обработчик
    deleteBtn.replaceWith(deleteBtn.cloneNode(true));
    const newDeleteBtn = wordElement.querySelector('.word-delete-btn');
    newDeleteBtn.addEventListener('click', confirmDeleteHandler);
}

// Удаление всех слов
async function deleteAllWords() {
    // Показываем панель подтверждения
    deleteConfirm.style.display = 'block';
    deleteConfirm.classList.add('confirm-pulse');
    
    // Анимация для кнопки удаления всех
    deleteAllBtn.style.background = 'linear-gradient(135deg, #ff5252 0%, #e53935 100%)';
    deleteAllBtn.disabled = true;
    
    // Автоматическое скрытие подтверждения через 5 секунд
    const cancelTimeout = setTimeout(() => {
        cancelDelete.click();
    }, 5000);
    
    // Обработчик подтверждения удаления
    const confirmHandler = async () => {
        clearTimeout(cancelTimeout);
        
        // Удаляем все слова с сервера
        const result = await deleteAllWordsFromServer();
        
        if (result.success) {
            // Показываем уведомление
            showDeleteNotification(`Удалено ${result.deleted_count || 'всех'} слов`);
            
            // Обновляем интерфейс
            setTimeout(() => {
                loadStudiedWords();
                deleteConfirm.style.display = 'none';
                deleteAllBtn.style.background = '';
                deleteAllBtn.disabled = false;
                deleteConfirm.classList.remove('confirm-pulse');
            }, 300);
        } else {
            // В случае ошибки
            deleteConfirm.style.display = 'none';
            deleteAllBtn.style.background = '';
            deleteAllBtn.disabled = false;
            deleteConfirm.classList.remove('confirm-pulse');
            showAnimatedMessage(`Ошибка удаления: ${result.error}`, 'error');
        }
    };
    
    // Обработчик отмены
    const cancelHandler = () => {
        clearTimeout(cancelTimeout);
        deleteConfirm.style.display = 'none';
        deleteAllBtn.style.background = '';
        deleteAllBtn.disabled = false;
        deleteConfirm.classList.remove('confirm-pulse');
    };
    
    // Обновляем обработчики
    confirmDelete.onclick = confirmHandler;
    cancelDelete.onclick = cancelHandler;
}

// Функция показа уведомления об удалении
function showDeleteNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'delete-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Обработчики для кнопок удаления
deleteAllBtn.addEventListener('click', deleteAllWords);

// Обработчик поиска
wordSearch.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    loadStudiedWords(searchTerm);
});

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

async function startGame() {
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
    await getNextQuestion();
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
    optionsContainer.style.display = 'block';
    inputAnswerContainer.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    restartGameBtn.style.display = 'none';
    resultElement.textContent = '';
    resultElement.className = 'result';
    timerElement.style.display = 'block';
    timerElement.classList.remove('shake');
    optionsContainer.innerHTML = '';
    inputAnswer.value = '';
}

async function getNextQuestion() {
    if (!gameState.isGameActive) return;
    
    resetGameUI();
    gameState.questionsAnswered++;
    updateGameStats();
    
    try {
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
        getDemoQuestion();
    }
}

async function getQuestionFromLearnedWords() {
    const words = await loadWordsFromServer();
    
    if (words.length === 0) {
        return getDemoQuestion();
    }
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const questionType = Math.random() > 0.5 ? 'multiple_choice' : 'input';
    
    if (questionType === 'multiple_choice') {
        const wrongOptions = getWrongOptions(words, randomWord.russian);
        const options = [...wrongOptions, randomWord.russian].sort(() => Math.random() - 0.5);
        
        return {
            type: 'multiple_choice',
            question: `Какой перевод имеет слово "${randomWord.english}"?`,
            correct_answer: randomWord.russian,
            options: options
        };
    } else {
        return {
            type: 'input',
            question: `Напишите перевод слова "${randomWord.english}"`,
            correct_answer: randomWord.russian
        };
    }
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
    
    optionButtons.forEach(button => {
        const buttonText = button.textContent.slice(3);
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
    nameInput.focus();
});

// Обработка изменения размера окна
window.addEventListener('resize', initConfetti);
