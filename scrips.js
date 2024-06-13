document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskStart = document.getElementById('taskStart').value;
    const taskEnd = document.getElementById('taskEnd').value;
    const taskOwner = document.getElementById('taskOwner').value;

    if (new Date(taskEnd) < new Date(taskStart)) {
        alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        start: taskStart,
        end: taskEnd,
        owner: taskOwner,
        completed: false
    };

    addTaskToLocalStorage(task);
    displayTasks();
    this.reset();
});

function addTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item ${task.completed ? 'list-group-item-success' : ''}`;
        li.innerHTML = `
        <div>
          <h5>${task.name}</h5>
          <p>Inicio: ${task.start}, Fin: ${task.end}, Responsable: ${task.owner}</p>
        </div>
        <div>
          ${task.completed ? '<button class="btn btn-warning btn-sm" onclick="unmarkTask(' + task.id + ')">Desmarcar</button>' : ''}
          <button class="btn btn-success btn-sm" onclick="completeTask(${task.id})" ${new Date(task.end) < new Date() ? 'disabled' : ''}>Resolver</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
        </div>
      `;
        taskList.appendChild(li);

        if (new Date(task.end) < new Date() && !task.completed) {
            li.classList.add('list-group-item-danger');
        }
    });
}

function completeTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.id === id ? { ...task, completed: true } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function unmarkTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.id === id ? { ...task, completed: false } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

window.onload = displayTasks;
