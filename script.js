// Получаем элементы
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const nameInput = document.getElementById('nameInput');
const continueBtn = document.getElementById('continueBtn');
const readyBtn = document.getElementById('readyBtn');
const backToFirstBtn = document.getElementById('backToFirstBtn');
const backToSecondBtn = document.getElementById('backToSecondBtn');
const newWordBtn = document.getElementById('newWordBtn');
const studyWordsBtn = document.getElementById('studyWordsBtn');
const userNameSpan = document.getElementById('userNameSpan');
const userNameSpan3 = document.getElementById('userNameSpan3');

let userName = '';

// Функция для переключения экранов
function showScreen(screenToShow) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    screenToShow.classList.add('active');
}

// Обработчики событий для первых двух экранов
continueBtn.addEventListener('click', () => {
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

// Обработчики для кнопок третьего экрана
newWordBtn.addEventListener('click', () => {
    alert('Функция "Новое слово" будет реализована позже');
});

studyWordsBtn.addEventListener('click', () => {
    alert('Функция "Изучение слова" будет реализована позже');
});

// Enter на первом экране
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        continueBtn.click();
    }
});
