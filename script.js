// Состояние приложения
let currentDate = new Date();
let tasks = JSON.parse(localStorage.getItem('habitTasks')) || [];

// Веса приоритетов для сортировки
const priorityWeights = {
    'high': 3,
    'medium': 2,
    'low': 1,
    'none': 0
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateDateDisplay();
    renderTasks();
    setupEventListeners();
});

function setupEventListeners() {
    // Навигация по датам
    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));

    // Модальное окно
    const modal = document.getElementById('modal');
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        // Сброс полей
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDesc').value = '';
        document.getElementById('taskPriority').value = 'none';
        modal.classList.remove('hidden');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => modal.classList.add('hidden'));
    
    document.getElementById('saveBtn').addEventListener('click', saveTask);
}

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDateDisplay();
    renderTasks();
}

function updateDateDisplay() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    // Для русского языка, чтобы было "Понедельник, 2 февраля"
    document.getElementById('currentDateDisplay').textContent = currentDate.toLocaleDateString('ru-RU', options);
}

// === ГЛАВНАЯ ЛОГИКА ===

function getTasksForCurrentDate() {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    return tasks.filter(task => {
        if (task.type === 'daily') return true; // Показываем всегда
        return task.date === dateStr; // Или если совпадает дата
    });
}

function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const priority = document.getElementById('taskPriority').value;
    const type = document.getElementById('taskType').value;

    if (!title) return alert('Введите название!');

    const newTask = {
        id: Date.now(),
        title,
        desc,
        priority,
        type,
        completed: false, // Для разовых задач
        completedDates: [], // Для ежедневных привычек (массив дат в формате YYYY-MM-DD)
        date: currentDate.toISOString().split('T')[0] // Дата создания/выполнения
    };

    tasks.push(newTask);
    saveToStorage();
    document.getElementById('modal').classList.add('hidden');
    renderTasks();
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    const dateStr = currentDate.toISOString().split('T')[0];

    if (task.type === 'daily') {
        // Логика для привычек: проверяем наличие даты в массиве
        if (task.completedDates.includes(dateStr)) {
            task.completedDates = task.completedDates.filter(d => d !== dateStr);
        } else {
            task.completedDates.push(dateStr);
        }
    } else {
        // Логика для разовых задач
        task.completed = !task.completed;
    }

    saveToStorage();
    renderTasks(); // Перерисовка обновит сортировку и статистику
}

function isTaskCompleted(task) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (task.type === 'daily') {
        return task.completedDates && task.completedDates.includes(dateStr);
    }
    return task.completed;
}

// === СОРТИРОВКА И РЕНДЕР ===

function renderTasks() {
    const taskListEl = document.getElementById('taskList');
    taskListEl.innerHTML = '';

    let currentTasks = getTasksForCurrentDate();

    // 1. Сортировка
    currentTasks.sort((a, b) => {
        const aCompleted = isTaskCompleted(a);
        const bCompleted = isTaskCompleted(b);

        // Сначала невыполненные, потом выполненные
        if (aCompleted !== bCompleted) {
            return aCompleted ? 1 : -1;
        }

        // Если статус выполнения одинаковый, сортируем по приоритету (High -> Low)
        const weightA = priorityWeights[a.priority];
        const weightB = priorityWeights[b.priority];
        
        return weightB - weightA;
    });

    // 2. Статистика
    updateStats(currentTasks);

    // 3. Генерация HTML
    currentTasks.forEach(task => {
        const completed = isTaskCompleted(task);
        
        const card = document.createElement('div');
        card.className = `task-card ${completed ? 'completed' : ''}`;
        card.dataset.priority = task.priority; // Для CSS стилизации цвета

        // Чекбокс (визуальный)
        const checkbox = document.createElement('div');
        checkbox.className = 'custom-checkbox';
        checkbox.innerHTML = completed ? '✓' : '';
        checkbox.onclick = (e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
        };

        // Текстовый блок
        const content = document.createElement('div');
        content.className = 'task-content';
        
        const titleEl = document.createElement('h4');
        titleEl.className = 'task-title';
        titleEl.textContent = task.title;
        
        const descEl = document.createElement('p');
        descEl.className = 'task-desc';
        descEl.textContent = task.desc;

        content.appendChild(titleEl);
        if (task.desc) content.appendChild(descEl);

        // Клик по карточке раскрывает описание
        content.onclick = () => {
            descEl.classList.toggle('visible');
        };

        card.appendChild(checkbox);
        card.appendChild(content);
        taskListEl.appendChild(card);
    });
}

function updateStats(currentTasks) {
    const total = currentTasks.length;
    if (total === 0) {
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('statsText').textContent = 'Нет задач на сегодня';
        return;
    }

    const completedCount = currentTasks.filter(t => isTaskCompleted(t)).length;
    const percent = Math.round((completedCount / total) * 100);

    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('statsText').textContent = `${percent}% выполнено`;
}

function saveToStorage() {
    localStorage.setItem('habitTasks', JSON.stringify(tasks));
}
