// Note Management
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Convert old format notes to new format
notes = notes.map((note, index) => {
    if (typeof note === 'string') {
        return {
            id: Date.now() + index,
            title: `Note ${index + 1}`,
            content: note,
            created: Date.now(),
            lastModified: Date.now()
        };
    }
    return note;
});

// Display all notes
function displayNotes(filteredNotes = null) {
    const notesGrid = document.getElementById('notes-grid');
    const notesToDisplay = filteredNotes || notes;
    notesGrid.innerHTML = '';

    notesToDisplay.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';

        const title = document.createElement('h2');
        title.className = 'note-title';
        title.textContent = note.title;

        const meta = document.createElement('div');
        meta.className = 'note-meta';
        meta.textContent = `Last modified: ${new Date(note.lastModified).toLocaleString()}`;

        const actions = document.createElement('div');
        actions.className = 'note-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => window.location.href = `/note?id=${note.id}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => confirmRemoveNote(note.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        noteCard.appendChild(title);
        noteCard.appendChild(meta);
        noteCard.appendChild(actions);
        notesGrid.appendChild(noteCard);
    });

    document.getElementById('note-count').textContent = notes.length;
}

// Add a new note
function addNewNote() {
    const newNote = {
        id: Date.now(),
        title: `Note ${notes.length + 1}`,
        content: '[]',
        created: Date.now(),
        lastModified: Date.now()
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

// Remove a note
function confirmRemoveNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        removeNote(id);
    }
}

function removeNote(id) {
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

// Filter notes
function filterNotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm)
    );
    displayNotes(filteredNotes);
}

// Sort notes
function sortNotes(method) {
    document.querySelectorAll('.sort-options button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    if (method === 'date') {
        notes.sort((a, b) => b.lastModified - a.lastModified);
    } else if (method === 'title') {
        notes.sort((a, b) => a.title.localeCompare(b.title));
    }
    displayNotes();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayNotes();
    
    // Add event listeners
    document.getElementById('search-input').addEventListener('input', filterNotes);
    document.getElementById('add-note-btn').addEventListener('click', addNewNote);
}); 