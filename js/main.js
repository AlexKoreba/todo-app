const form =  document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse( localStorage.getItem('tasks') );
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

// Добавление задачи:
form.addEventListener('submit', addTask);

// Удаление задачи:
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершённой:
tasksList.addEventListener('click', doneTask);


// Функции:
function addTask(event) {
    event.preventDefault(); // Отменяем отправку формы
    const taskText = taskInput.value; // Достаем текст из поля ввода

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавляем задачу в массив с задачами:
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    // Очищаем поле ввода и возвращаем фокус на него:
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {

    // Находим кнопку "Удалить" и удаляем тег с задачей:
    if ( event.target.dataset.action === 'delete' ) {
        const parentNode = event.target.closest('li'); // Находим тег-родитель (li) кнопки

        const id = +parentNode.id; // Определяем ID задачи
        const index = tasks.findIndex( task => task.id === id); // Находим индекс задачи в массиве
        tasks.splice(index, 1); // Удаляем задачу из массива с задачами

        saveToLocalStorage();

        parentNode.remove(); // Удаляем тег с задачей

        checkEmptyList();
    }
}

function doneTask(event) {

    // Находим кнопку "Выполнено" и отмечаем задачу:
    if ( event.target.dataset.action === 'done' ) {
        const parentNode = event.target.closest('li'); // Находим тег-родитель (li) кнопки

        const id = +parentNode.id; // Определяем ID задачи
        const task = tasks.find( task => task.id === id); // Находим задачу в массиве с задачами 
        task.done = !task.done; // Меняем значение статуса задачи на противоположное

        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('span.task-title'); // Внутри li находим span с классом task-title
        taskTitle.classList.toggle('task-title--done'); // Присваиваем нужный класс, который по нажатию будет и добавляться и убираться (toggle)
    }
}

function checkEmptyList() {

    if (tasks.length === 0) {
        // Формируем и вставляем разметку emptyList:
        const emptyList = document.createElement('li');
        emptyList.classList.add('list-group-item');
        emptyList.classList.add('empty-list');
        emptyList.id = 'emptyList';
        tasksList.prepend(emptyList);

        const emptyListImg = document.createElement('img');
        emptyListImg.classList.add('mt-3');
        emptyListImg.src = './img/leaf.svg';
        emptyListImg.alt = 'Empty';
        emptyListImg.width = '48';
        emptyList.append(emptyListImg);

        const emptyListDiv = document.createElement('div');
        emptyListDiv.classList.add('empty-list__title');
        emptyListDiv.innerText = 'ToDo list is empty';
        emptyList.append(emptyListDiv);
    }

    if (tasks.length > 0) {
        // Удаляем разметку emptyList, если она существует:
        const emptyListEl = document.querySelector('#emptyList');

        if (emptyListEl) {
            emptyListEl.remove();
        }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {

    // Формируем разметку для новой задачи
    // Создаём элементы разметки:
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.classList.add('d-flex');
    listItem.classList.add('justify-content-between');
    listItem.classList.add('task-item');
    listItem.id = task.id;
 
    const taskTitle = document.createElement('span');
    taskTitle.classList.add('task-title');
    
    if (task.done) {
        taskTitle.classList.add('task-title--done');
    }

    taskTitle.innerText = task.text;
 
    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-item__buttons');
 
    const btnDone = document.createElement('button');
    btnDone.classList.add('btn-action');
    btnDone.type = 'button';
    btnDone.dataset.action = 'done';
 
    const btnDoneImg = document.createElement('img');
    btnDoneImg.src = './img/tick.svg';
    btnDoneImg.alt = 'Done';
    btnDoneImg.width = '18';
    btnDoneImg.height = '18';
 
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-action');
    btnDelete.type = 'button';
    btnDelete.dataset.action = 'delete';
 
    const btnDeleteImg = document.createElement('img');
    btnDeleteImg.src = './img/cross.svg';
    btnDeleteImg.alt = 'Done';
    btnDeleteImg.width = '18';
    btnDeleteImg.height = '18';
 
    // Создаём вложенность элементов:
    btnDone.append(btnDoneImg);
    btnDelete.append(btnDeleteImg);
 
    taskButtons.append(btnDone);
    taskButtons.append(btnDelete);
 
    listItem.append(taskTitle);
    listItem.append(taskButtons);
 
    // Добавляем задачу на страницу:
    tasksList.append(listItem);
}