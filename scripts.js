// Inicializar estado de autenticação
let users = loadUsers();
let currentUser = loadCurrentUser();
let isAuthenticated = currentUser !== null;

// Funções para persistência de dados no Local Storage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsers() {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
}

function saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function loadCurrentUser() {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
}

// Função para alternar para a página de registro
function showRegistration() {
    window.location.href = "register.html";
}

// Função para alternar para a página de login
function showLogin() {
    window.location.href = "index.html";
}

// Função para alternar para a página do gerenciador de tarefas
function showTaskManager() {
    window.location.href = "tasks.html";
}

// Função para registrar um usuário
function registerUser() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if(!name || !email || !password){
        alert("Please fill in all fields.")
        return;
    }
    if (users.find(user => user.email === email)) {
        alert('Email already registered.');
        return;
    }

    users.push({ name, email, password, tasks: [] });
    saveUsers(); // Salvar no Local Storage
    alert('Registration successful! You can now login.');
    showLogin();
}

// Função para autenticar um usuário
function authenticateUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        isAuthenticated = true;
        currentUser = user;
        saveCurrentUser(); // Salvar o usuário atual no Local Storage
        alert('Login successful!');
        showTaskManager();
    } else {
        alert('Invalid email or password.');
    }
}

// Função para adicionar uma tarefa
function addTask() {
    currentUser = loadCurrentUser(); // Atualizar o estado do usuário atual
    isAuthenticated = currentUser !== null; // Atualizar o estado de autenticação

    if (!isAuthenticated) {
        alert('You must be logged in to manage tasks.');
        return;
    }

    const taskInput = document.getElementById('task-input');

    if (taskInput.value.trim() === '') {
        alert('Task cannot be empty.');
        return;
    }

    currentUser.tasks.push(taskInput.value); // Adiciona a tarefa ao usuário atual
    updateUserInUsersArray(currentUser); // Atualiza o usuário no array `users`
    saveUsers(); // Salva o array atualizado no Local Storage
    saveCurrentUser(); // Atualiza o `currentUser` no Local Storage
    loadTasks();

    taskInput.value = '';
}

// Atualizar o array `users` com as mudanças feitas no `currentUser`
function updateUserInUsersArray(updatedUser) {
    users = users.map(user =>
        user.email === updatedUser.email ? updatedUser : user
    );
}

// Função para carregar tarefas do usuário atual
function loadTasks() {
    currentUser = loadCurrentUser(); // Carregar o usuário atual
    if (!currentUser) {
        alert('No user is logged in.');
        showLogin();
        return;
    }

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    document.getElementById('task-count').textContent = currentUser.tasks.length;
    currentUser.tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = task;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.style.marginLeft = '10px';
        deleteButton.onclick = function () {
            currentUser.tasks.splice(index, 1);
            updateUserInUsersArray(currentUser); // Atualiza o usuário no array `users`
            saveUsers(); // Salva o array atualizado no Local Storage
            saveCurrentUser(); // Atualiza o `currentUser` no Local Storage
            loadTasks();
        };

        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

// Função para realizar logout
function logout() {
    isAuthenticated = false;
    currentUser = null;
    localStorage.removeItem('currentUser'); // Remover o usuário atual
    alert('You have been logged out.');
    showLogin();
}

// Verificar se o usuário está autenticado na página de tarefas
function initializeTaskManager() {
    currentUser = loadCurrentUser(); // Carregar o usuário atual
    if (!currentUser) {
        alert('No user is logged in.');
        showLogin();
    } else {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('task-count').textContent = currentUser.tasks.length;
        loadTasks(); // Carregar as tarefas do usuário
    }
}

// Inicialização automática para a página de tarefas
if (window.location.pathname.includes('tasks.html')) {
    initializeTaskManager();
}
let employees = loadEmployees();

// Função para carregar os funcionários do localStorage
function loadEmployees() {
    const storedEmployees = localStorage.getItem('employees');
    return storedEmployees ? JSON.parse(storedEmployees) : [];
}

// Função para salvar os funcionários no localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Função para carregar as tarefas de todos os usuários do Local Storage
function loadAllTasks() {
    let allTasks = [];
    users.forEach(user => {
        allTasks = allTasks.concat(user.tasks);
    });
    return Array.from(new Set(allTasks)); // Remove tarefas duplicadas, se houver
}

// Função para adicionar um novo funcionário
function addEmployee() {
    const name = document.getElementById('employee-name').value;
    const age = document.getElementById('employee-age').value;
    const position = document.getElementById('employee-position').value;
    const selectedTasks = Array.from(document.getElementById('employee-tasks').selectedOptions)
                               .map(option => option.value);

    // Validação dos campos
    if (!name || !age || !position) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Criação do objeto do funcionário
    const newEmployee = {
        name: name,
        age: age,
        position: position,
        tasks: selectedTasks
    };

    // Adiciona o novo funcionário ao array de funcionários
    employees.push(newEmployee);

    // Salva os funcionários no localStorage
    saveEmployees();

    // Limpa o formulário
    document.getElementById('employeeForm').reset();

    // Exibe a lista de funcionários
    renderEmployeeList();
}


// Função para renderizar a lista de funcionários na tela
function renderEmployeeList() {
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';  // Limpa a lista antes de renderizar novamente

    // Cria a lista de funcionários
    employees.forEach(employee => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nome: ${employee.name}, Idade: ${employee.age}, Cargo: ${employee.position}, Tarefas: ${employee.tasks.join(', ')}`;
        employeeList.appendChild(listItem);
    });
}


// Função para carregar as tarefas disponíveis no Local Storage
function renderTaskOptions() {
    const taskSelect = document.getElementById('employee-tasks');
    taskSelect.innerHTML = '';  // Limpa as opções antes de carregar novamente

    // Carrega todas as tarefas dos usuários
    const allTasks = loadAllTasks();

    // Preenche o campo de tarefas com as tarefas disponíveis
    allTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        taskSelect.appendChild(option);
    });
}

// Função para inicializar a página (carregar tarefas e exibir funcionários)
function initializePage() {
    renderTaskOptions();  // Carregar tarefas no select
    renderEmployeeList();  // Exibir funcionários cadastrados
}

// Chama a inicialização da página
initializePage();


