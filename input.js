// ================
// GLOBAL VARIABLES
// ================

let deferredPrompt = null;
let tasks = [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const installBtn = document.getElementById("installBtn");

// ====================
// LOAD TASKS FROM STORAGE
// ====================

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

// ====================
// SAVE TASKS TO STORAGE
// ====================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ====================
// RENDER TASKS
// ====================

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';
  
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };
    
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// ====================
// ADD TASK
// ====================

function addTask() {
  if (!taskInput) return;
  if (taskInput.value.trim() === '') return;
  
  tasks.push(taskInput.value.trim());
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

// ====================
// DARK MODE TOGGLE
// ====================

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // Optional: Save preference to localStorage
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// ====================
// CLEAR ALL TASKS
// ====================

function clearTasks() {
  if (confirm('Delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// ====================
// SHOW PAYMENT INFO
// ====================

function showPayment() {
  const paymentBox = document.getElementById('paymentBox');
  if (paymentBox) {
    paymentBox.style.display = paymentBox.style.display === 'none' ? 'block' : 'none';
  }
}

// ====================
// PWA INSTALL
// ====================

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = "block";
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
      }
      deferredPrompt = null;
      installBtn.style.display = "none";
    }
  });
}

// ====================
// LOAD DARK MODE PREFERENCE
// ====================

function loadDarkModePreference() {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
  }
}

// ====================
// SERVICE WORKER
// ====================

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(reg => console.log("Service Worker registered:", reg))
    .catch(err => console.error("Service Worker registration failed:", err));
}

// ====================
// INITIALIZE APP
// ====================

function init() {
  loadTasks();
  renderTasks();
  loadDarkModePreference();
  
  // Add event listeners
  if (addBtn) addBtn.addEventListener("click", addTask);
  if (taskInput) taskInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  // Button event listeners
  const darkModeBtn = document.getElementById('darkModeBtn');
  const clearTasksBtn = document.getElementById('clearTasksBtn');
  const supportBtn = document.getElementById('supportBtn');
  
  if (darkModeBtn) darkModeBtn.addEventListener('click', toggleDarkMode);
  if (clearTasksBtn) clearTasksBtn.addEventListener('click', clearTasks);
  if (supportBtn) supportBtn.addEventListener('click', showPayment);
}

// Start the app
init();