// client/scripts/todos.js

// Get DOM elements
const addTodoForm = document.getElementById('add-todo-form');
const newTodoInput = document.getElementById('new-todo');
const todoList = document.getElementById('todo-list');

// Initialize todos when user logs in
async function initializeTodos() {
    try {
        const response = await api.getTodos();
        
        if (response.status === 'success') {
            renderTodos(response.data);
        }
    } catch (error) {
        console.error('Failed to load todos:', error);
        showEmptyState();
    }
}

// Render all todos
function renderTodos(todos) {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        showEmptyState();
        return;
    }
    
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

// Create a single todo element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodoComplete(todo.id, checkbox.checked));
    
    // Text
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.title;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodoItem(todo.id));
    
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    
    return li;
}

// Add new todo
addTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = newTodoInput.value.trim();
    
    if (!title) {
        showNotification('Please enter a todo title', 'error');
        return;
    }
    
    try {
        const response = await api.createTodo({ title });
        
        if (response.status === 'success') {
            const todoElement = createTodoElement(response.data);
            
            // Remove empty state if it exists
            const emptyState = todoList.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            todoList.prepend(todoElement);
            newTodoInput.value = '';
            showNotification('Todo created successfully!', 'success');
        } else {
            showNotification(response.message || 'Failed to create todo', 'error');
        }
    } catch (error) {
        showNotification('Failed to create todo. Please try again.', 'error');
        console.error('Create todo error:', error);
    }
});

// Toggle todo completion
async function toggleTodoComplete(id, completed) {
    try {
        const response = await api.toggleTodo(id, completed);
        
        if (response.status === 'success') {
            const todoElement = todoList.querySelector(`[data-id="${id}"]`);
            if (completed) {
                todoElement.classList.add('completed');
            } else {
                todoElement.classList.remove('completed');
            }
        } else {
            showNotification('Failed to update todo', 'error');
        }
    } catch (error) {
        showNotification('Failed to update todo. Please try again.', 'error');
        console.error('Toggle todo error:', error);
    }
}

// Delete todo
async function deleteTodoItem(id) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }
    
    try {
        const response = await api.deleteTodo(id);
        
        if (response.status === 'success') {
            const todoElement = todoList.querySelector(`[data-id="${id}"]`);
            todoElement.remove();
            showNotification('Todo deleted successfully!', 'success');
            
            // Show empty state if no todos left
            if (todoList.children.length === 0) {
                showEmptyState();
            }
        } else {
            showNotification('Failed to delete todo', 'error');
        }
    } catch (error) {
        showNotification('Failed to delete todo. Please try again.', 'error');
        console.error('Delete todo error:', error);
    }
}

// Show empty state message
function showEmptyState() {
    todoList.innerHTML = `
        <div class="empty-state">
            <p>No todos yet. Add one above!</p>
        </div>
    `;
}

// Clear todos (called on logout)
function clearTodos() {
    todoList.innerHTML = '';
    newTodoInput.value = '';
}