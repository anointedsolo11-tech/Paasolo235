const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";
    
    div.innerHTML = `
      <span>${task}</span>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    
    list.appendChild(div);
  });
}

function addTask() {
  const value = input.value.trim();
  if (value === "") return;
  
  tasks.push(value);
  saveTasks();
  renderTasks();
  input.value = "";
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

renderTasks();let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  let installBtn = document.createElement("button");
  installBtn.innerText = "Install App";
  installBtn.style.padding = "10px";
  installBtn.style.marginTop = "10px";
  
  document.body.appendChild(installBtn);
  
  installBtn.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
    });
  });
});