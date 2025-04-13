let currentNote = null;
let tasks = [];

// Get note ID from URL
const urlParams = new URLSearchParams(window.location.search);
const noteId = parseInt(urlParams.get('id'));

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Find the current note
currentNote = notes.find(note => note.id === noteId);

if (!currentNote) {
    alert('Note not found!');
    window.location.href = 'index.html';
}

// Initialize tasks from note content
try {
    tasks = JSON.parse(currentNote.content);
} catch (e) {
    tasks = [];
}

// Set initial values
document.getElementById('note-title').value = currentNote.title;
document.getElementById('note-meta').textContent = `Last modified: ${new Date(currentNote.lastModified).toLocaleString()}`;

// Display tasks
function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleTask(index);

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => deleteTask(index);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    saveNote();
}

// Add new task
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (text) {
        tasks.push({
            text: text,
            completed: false
        });
        input.value = '';
        displayTasks();
    }
}

// Toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
}

// Save note
function saveNote() {
    currentNote.content = JSON.stringify(tasks);
    currentNote.lastModified = Date.now();
    currentNote.title = document.getElementById('note-title').value;

    // Update note in notes array
    const noteIndex = notes.findIndex(note => note.id === noteId);
    notes[noteIndex] = currentNote;

    // Save to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayTasks();
    
    // Add event listeners
    document.getElementById('note-title').addEventListener('input', saveNote);
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}); 