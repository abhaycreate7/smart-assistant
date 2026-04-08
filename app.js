// Smart Productivity Assistant - app.js
const GEMINI_API_KEY = "AIzaSyDemo1234567890"; // placeholder
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

let tasks = [];

async function processTask() {
  const input = document.getElementById("taskInput");
  const responseBox = document.getElementById("responseBox");
  const userText = input.value.trim();

  if (!userText) {
    responseBox.textContent = "⚠️ Please enter a task first.";
    return;
  }

  responseBox.textContent = "🤖 Thinking...";

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a smart productivity assistant. 
                   Analyze this task and give a short helpful response 
                   with priority and suggested time: "${userText}"`
          }]
        }]
      })
    });

    const data = await response.json();
    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text 
                    || "Task added! Stay focused.";

    responseBox.textContent = "🧠 " + aiReply;
    addTaskToList(userText);
    input.value = "";

  } catch (error) {
    responseBox.textContent = "✅ Task added successfully!";
    addTaskToList(userText);
    input.value = "";
  }
}

function addTaskToList(taskText) {
  tasks.push({ id: Date.now(), text: taskText, done: false });
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = "<li style='border:none;color:#aaa'>No tasks yet. Add one above!</li>";
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})" 
              aria-label="Delete task">🗑 Delete</button>
    `;
    list.appendChild(li);
  });
}

// Initialize
renderTasks();
