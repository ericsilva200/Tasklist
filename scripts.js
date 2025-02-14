const API_BASE_URL = 'http://localhost:8080';

// Inicializar estado de autenticação
let currentUser = loadCurrentUser();
let isAuthenticated = currentUser !== null;

// // Funções para persistência de dados no Local Storage

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
async function registerUser() {
    const nome = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-password').value;

    if(!nome || !email || !senha){
        alert("Please fill in all fields.")
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!response.ok) throw new Error("Error registering User.");

        alert("Registration successful! You can now login.");
        showLogin();
    } catch (error) {
        console.error(error);
        alert("Error registering User.");
    }
    
}

// Função para autenticar um usuário
async function authenticateUser() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    if(!email || !senha){
        alert("Please fill in all fields.")
        return;
    }

    //Obtém todos os usuários
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Error loading users.");

    const storedUsers = await response.json();

    const user = storedUsers.find(user => user.email === email && user.senha === senha);
    
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

// Função para realizar logout
function logout() {
    isAuthenticated = false;
    currentUser = null;
    localStorage.removeItem('currentUser'); // Remover o usuário atual
    alert('You have been logged out.');
    showLogin();
}

// Obtém todos os funcionários
async function getEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Erro ao obter os funcionários.");
        
        
        return await response.json();
    } catch (error) {
        console.error(error);
    }
  }

// Popula o select de funcionários
async function populateEmployeeSelect() {
    try {   
        const selectElement = document.getElementById("employeeSelect");

        const employees = await getEmployees(); // Aqui substituir por fetch real

        selectElement.innerHTML = ""; // Limpa o select antes de adicionar novas opções

        employees.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent = `Nome: ${employee.name} - Cargo: ${employee.position}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
        selectElement.innerHTML = "<option value=''>Erro ao carregar</option>";
    }
}
// Verificar se o usuário está autenticado na página de tarefas
function initializeTaskManager() {
    currentUser = loadCurrentUser(); // Carregar o usuário atual
    if (!currentUser) {
        alert('No user is logged in.');
        showLogin();
    } else {
        populateEmployeeSelect();
        document.getElementById('user-name').textContent = currentUser.nome;
        loadTasks(); // Carregar as tarefas do usuário
    }
}

// Inicialização automática para a página de tarefas
if (window.location.pathname.includes('tasks.html')) {
    initializeTaskManager();
}

// Verificar se o usuário está autenticado na página de funcionários
function initializeEmployeeManager() {
    currentUser = loadCurrentUser(); // Carregar o usuário atual
    if (!currentUser) {
        alert('No user is logged in.');
        showLogin();
    } else {
        document.getElementById('user-name').textContent = currentUser.nome;
        loadEmployees(); // Carregar as tarefas do usuário
    }
}

// Inicialização automática para a página de funcionários
if (window.location.pathname.includes('employer.html')) {
    initializeEmployeeManager();
}


// Criar uma nova tarefa
async function createTask() {
    const title = document.getElementById('task-title')?.value.trim();
    const description = document.getElementById('task-desc')?.value.trim();
    const employee = document.getElementById('employeeSelect')?.value;

    if (!title || !description || !employee) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, completed: false})
        });

        if (!response.ok) throw new Error("Erro ao criar tarefa.");

        const task = await response.json();
        assignTask(task.id, employee);

        alert("Tarefa criada com sucesso!");
        document.getElementById('task-form')?.reset(); // Limpar formulário
        loadTasks();
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar tarefa.");
    }
}

// Deletar tarefa
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Erro ao deletar tarefa.");

        alert("Tarefa deletada com sucesso!");
        loadTasks();
    } catch (error) {
        console.error(error);
        alert("Erro ao deletar tarefa.");
    }
}

// Completar tarefa
async function completedTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/completed/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error("Erro ao completar tarefa.");

        alert("Tarefa completada com sucesso!");
        loadTasks();
    } catch (error) {
        console.error(error);
        alert("Erro ao completar tarefa.");
    }
}
// Carregar tarefas e exibi-las na lista
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error("Erro ao carregar tarefas.");

        const tasks = await response.json();
        document.getElementById('task-count').textContent = tasks.length;
        const taskList = document.getElementById('task-list');
        if (!taskList) return;
		
        taskList.innerHTML = '';
		
        tasks.forEach(task => {
            const taskElement = document.createElement('tr');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <td><strong>${task.title}</strong></td>
                <td>${task.description}</td>
                <td>${task.employee.name}</td>
				<td>${task.completed === true ? "Concluida" : "Em andamento"}</td>
            `;

            const divButton = document.createElement('td');
            //divButton.classList.add('div-button-task');
            const deleteButton = document.createElement('button');
            deleteButton.className = "button-task";
            deleteButton.id = "delete-button";
            deleteButton.textContent = 'Deletar';
            deleteButton.style.marginLeft = '10px';
            deleteButton.onclick = function () {
                deleteTask(task.id)
                loadTasks();
            };

            if(task.completed === false){
                const completedButton = document.createElement('button');
                completedButton.className = "button-task";
                completedButton.id = "completed-button";
                completedButton.textContent = 'Concluir';
                completedButton.style.marginLeft = '10px';
                completedButton.onclick = function () {
                    completedTask(task.id)
                    loadTasks();
                };

                divButton.appendChild(completedButton);
            }
            
            
            divButton.appendChild(deleteButton);
            taskElement.appendChild(divButton);
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar tarefas.");
    }
}

// Criar funcionário
async function createEmployee() {
    const name = document.getElementById('employee-name')?.value.trim();
    const position = document.getElementById('employee-position')?.value.trim();

    if (!name || !position) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, position })
        });

        if (!response.ok) throw new Error("Erro ao criar funcionário.");

        alert("Funcionário criado com sucesso!");
        document.getElementById('employee-form')?.reset(); // Limpar formulário
        loadEmployees();
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar funcionário.");
    }
}

// Carregar funcionários e exibi-los na lista
async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (!response.ok) throw new Error("Erro ao carregar funcionários.");

        const employees = await response.json();
        document.getElementById('employee-count').textContent = employees.length;
        const employeeList = document.getElementById('employee-list');
        if (!employeeList) return;

        employeeList.innerHTML = '';

        employees.forEach(employee => {
            const employeeElement = document.createElement('div');
            employeeElement.classList.add('employee');
            employeeElement.innerHTML = `<strong>${employee.name}</strong> (${employee.position})`;
            employeeList.appendChild(employeeElement);
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar funcionários.");
    }
}

// Vincular uma tarefa a um funcionário
async function assignTask(taskId, employeeId) {

    if (!employeeId || isNaN(employeeId)) {
        alert("ID inválido!");
        return;
    }
 
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign-employee/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
 
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao vincular: ${errorText}`);
        }
 
        loadTasks();
    } catch (error) {
        console.error(error);
    }
 }



