let tasks = [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filterCategory = document.getElementById('filter-category');
const sortTasks = document.getElementById('sort-tasks');
const emptyMessage = document.getElementById('empty-message');
const countPending = document.getElementById('count-pending');
const countCompleted = document.getElementById('count-completed');
const themeToggle = document.getElementById('toggle-theme');

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('task-name').value;
    const category = document.getElementById('task-category').value;
    const priority = document.getElementById('task-priority').value;
    const date = document.getElementById('task-date').value;

    if (!name || !category || !priority || !date) {
        alert("Preencha todos os campos!");
        return;
    }

    const newTask = {
        id: Date.now(),
        name,
        category,
        priority,
        date,
        completed: false
    };

    tasks.push(newTask);
    taskForm.reset();
    renderTasks();
});

filterCategory.addEventListener('change', renderTasks);
sortTasks.addEventListener('change', renderTasks);

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function renderTasks() {
    taskList.innerHTML = '';

    const selectedCategory = filterCategory.value;
    let filteredTasks = tasks.filter(task => 
        selectedCategory === 'Todas' ? true : task.category === selectedCategory
    );

    const sortType = sortTasks.value;
    filteredTasks.sort((a, b) => {
        if (sortType === 'date-asc') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortType === 'date-desc') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortType === 'priority') {
            const priorityWeight = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
            return priorityWeight[a.priority] - priorityWeight[b.priority];
        }
    });

    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.length - completedCount;
    countCompleted.innerText = `Concluídas: ${completedCount}`;
    countPending.innerText = `Pendentes: ${pendingCount}`;

    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
    }

    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        
        card.innerHTML = `
            <div>
                <h3>${task.name}</h3>
                <p><strong>Categoria:</strong> ${task.category}</p>
                <p><strong>Prioridade:</strong> ${task.priority}</p>
                <p><strong>Prazo:</strong> ${formatDate(task.date)}</p>
            </div>
            <div class="card-actions">
                <button class="btn-complete" onclick="toggleComplete(${task.id})">
                    ${task.completed ? 'Desfazer' : 'Concluir'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        `;
        taskList.appendChild(card);
    });
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerText = 'Light Mode';
    } else {
        themeToggle.innerText = 'Dark Mode';
    }
});