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

// Устанавливаем сегодняшнюю дату
datePicker.valueAsDate = new Date();

// Загружаем данные из localStorage
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
          <input type="checkbox" ${task.done ? "checked" : ""} />
          ${task.title}
        </label>
      </div>
      <div class="task-desc">${task.desc || ""}</div>
    `;

    // Открытие / закрытие описания
    div.querySelector(".task-title").onclick = () => {
      div.classList.toggle("open");
    };

    // Отметка выполнения
    div.querySelector("input").onchange = e => {
      task.done = e.target.checked;
      save();
      render();
    };

    tasksEl.appendChild(div);
  });
}

// Открыть модальное окно
addBtn.onclick = () => {
  modal.classList.remove("hidden");
};

// Закрыть по кнопке "Отмена"
cancelBtn.onclick = () => {
  modal.classList.add("hidden");
  resetForm();
};

// Закрыть по нажатию на фон
modal.onclick = e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    resetForm();
  }
};

// Сброс формы
function resetForm() {
  titleInput.value = "";
  descInput.value = "";
  priorityInput.value = "";
  dailyInput.checked = false;
}

// Сохранение новой задачи
saveBtn.onclick = () => {
  const title = titleInput.value.trim();
  if (!title) return;

  const task = {
    title,
    desc: descInput.value,
    priority: priorityInput.value || null,
    done: false
  };

  if (dailyInput.checked) {
    data.habits.push(task);
  } else {
    const key = getTodayKey();
    data.tasksByDate[key] ||= [];
    data.tasksByDate[key].push(task);
  }

  save();
  modal.classList.add("hidden");
  resetForm();
  render();
};

// Перерисовка при смене даты
datePicker.onchange = render;

// Первая отрисовка
render();
