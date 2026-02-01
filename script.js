const tasksEl = document.getElementById("tasks");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const datePicker = document.getElementById("datePicker");

const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const priorityInput = document.getElementById("priorityInput");
const dailyInput = document.getElementById("dailyInput");

datePicker.valueAsDate = new Date();

let data = JSON.parse(localStorage.getItem("tracker")) || {
  habits: [],
  tasksByDate: {}
};

function save() {
  localStorage.setItem("tracker", JSON.stringify(data));
}

function getTodayKey() {
  return datePicker.value;
}

function render() {
  tasksEl.innerHTML = "";
  const dateKey = getTodayKey();
  const tasks = [
    ...data.habits,
    ...(data.tasksByDate[dateKey] || [])
  ];

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = `task ${task.priority || ""}`;

    div.innerHTML = `
      <div class="task-title">
        <label>
          <input type="checkbox" ${task.done ? "checked" : ""}/>
          ${task.title}
        </label>
      </div>
      <div class="task-desc">${task.desc || ""}</div>
    `;

    // Открытие описания по нажатию на заголовок
    div.querySelector(".task-title").onclick = () =>
      div.classList.toggle("open");

    // Обновление статуса задачи
    div.querySelector("input").onchange = e => {
      task.done = e.target.checked;
      save();
    };

    tasksEl.appendChild(div);
  });
}

// Открыть модальное окно
addBtn.onclick = () => modal.classList.remove("hidden");

// Закрыть по кнопке Отмена
cancelBtn.onclick = () => {
  modal.classList.add("hidden");
  resetForm();
};

// Закрыть по нажатию на тёмный фон
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    resetForm();
  }
};

// Сброс формы
function resetForm() {
  titleInput.value = "";
  descInput.value = "";
  dailyInput.checked = false;
  priorityInput.value = "";
}

// Сохранение новой задачи
saveBtn.onclick = () => {
  const title = titleInput.value.trim();
  if (!title) return;

  const task = {
    title,
    desc: descInput.value,
    priority: priorityInput.value,
    done: false
  };

  if (dailyInput.checked) {
    data.habits.push(task);
  } else {
    const key = getTodayKey();
    data.tasksByDate[key] ??= [];
    data.tasksByDate[key].push(task);
  }

  save();
  modal.classList.add("hidden"); // Закрываем окно
  resetForm();
  render();
};

// Обновление задач при смене даты
datePicker.onchange = render;

// Начальная отрисовка
render();
