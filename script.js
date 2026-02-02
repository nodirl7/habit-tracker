:root {
    --bg-color: #f2f2f7;
    --card-bg: #ffffff;
    --text-color: #000000;
    --accent: #007aff; /* iOS Blue */
    --danger: #ff3b30;
    
    /* Цвета приоритетов */
    --p-high: #ff3b30;
    --p-medium: #ffcc00;
    --p-low: #34c759;
    --p-none: #8e8e93;
}

/* Темная тема (True Black для OLED экранов iPhone) */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #000000;
        --card-bg: #1c1c1e;
        --text-color: #ffffff;
    }
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    /* Учет челки iPhone */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    height: 100vh;
    overflow: hidden; /* Скроллим только список */
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

header {
    padding: 10px 20px;
    background-color: var(--bg-color);
}

.date-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

/* Стили статистики */
.stats-container {
    margin-bottom: 10px;
}

.progress-bar {
    height: 6px;
    background-color: var(--card-bg); /* Или чуть светлее фона в темной теме */
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 5px;
    border: 1px solid rgba(128,128,128, 0.2);
}

.progress-fill {
    height: 100%;
    width: 0%;
    background-color: var(--accent);
    transition: width 0.3s ease;
}

.stats-text {
    font-size: 12px;
    color: var(--p-none);
    text-align: right;
    margin: 0;
}

/* Список задач */
.task-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px 80px 20px; /* Отступ снизу для кнопки */
}

.task-card {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
    border-left: 5px solid transparent; /* Место для цвета приоритета */
}

/* Индикаторы приоритета */
.task-card[data-priority="high"] { border-left-color: var(--p-high); }
.task-card[data-priority="medium"] { border-left-color: var(--p-medium); }
.task-card[data-priority="low"] { border-left-color: var(--p-low); }
.task-card[data-priority="none"] { border-left-color: transparent; }

.task-content {
    flex: 1;
    margin-left: 10px;
}

.task-title {
    font-size: 17px;
    font-weight: 500;
    margin: 0;
}

.task-desc {
    font-size: 13px;
    color: var(--p-none);
    margin-top: 4px;
    display: none; /* Скрыто по умолчанию */
}

.task-desc.visible {
    display: block;
}

/* Чекбокс в стиле iOS */
.custom-checkbox {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--p-none);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.task-card.completed .custom-checkbox {
    background-color: var(--accent);
    border-color: var(--accent);
}

.task-card.completed .task-title {
    text-decoration: line-through;
    color: var(--p-none);
}

/* FAB кнопка */
.fab {
    position: absolute;
    bottom: calc(20px + env(safe-area-inset-bottom));
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: var(--accent);
    color: white;
    font-size: 30px;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor: pointer;
}

/* Модалка */
.modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.hidden { display: none; }
.modal-content {
    background: var(--card-bg);
    padding: 20px;
    border-radius: 14px;
    width: 80%;
    max-width: 320px;
}
input, textarea, select {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: var(--bg-color);
    color: var(--text-color);
    box-sizing: border-box;
}
.modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
