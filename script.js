document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const nameInput = document.getElementById('nameInput');
    const continueBtn = document.getElementById('continueBtn');
    const readyBtn = document.getElementById('readyBtn');
    const backToFirstBtn = document.getElementById('backToFirstBtn');
    const greetingText = document.getElementById('greetingText');
    const userNameSpan = document.getElementById('userNameSpan');

    // Обработчик кнопки "продолжить"
    continueBtn.addEventListener('click', function() {
        const userName = nameInput.value.trim();
        
        // Проверяем, что имя не пустое
        if (userName === '') {
            alert('Пожалуйста, введите ваше имя!');
            nameInput.focus();
            return;
        }

        // Обновляем текст приветствия
        userNameSpan.textContent = userName;
        
        // Переключаем экраны
        screen1.classList.remove('active');
        screen2.classList.add('active');
    });

    // Обработчик кнопки "я готов!!!"
    readyBtn.addEventListener('click', function() {
        const userName = nameInput.value.trim();
        alert(`Отлично, ${userName}! Давайте начнем изучение слов!`);
        // Здесь можно добавить переход к следующему функционалу приложения
    });

    // Обработчик кнопки "вернуться назад"
    backToFirstBtn.addEventListener('click', function() {
        // Переключаем экраны
        screen2.classList.remove('active');
        screen1.classList.add('active');
        
        // Возвращаем фокус на поле ввода
        nameInput.focus();
    });

    // Разрешаем нажимать кнопку "продолжить" по нажатию Enter
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            continueBtn.click();
        }
    });

    // Фокус на поле ввода при загрузке страницы
    nameInput.focus();
});