// client/js/api.js
const API_URL = 'http://localhost:3000/api';

const api = {
    // Auth endpoints
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(credentials)
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Todos endpoints
    async getTodos() {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Get todos error:', error);
            throw error;
        }
    },

    async createTodo(todoData) {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(todoData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create todo error:', error);
            throw error;
        }
    },

    async updateTodo(id, todoData) {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(todoData)
            });
            return await response.json();
        } catch (error) {
            console.error('Update todo error:', error);
            throw error;
        }
    },

    async toggleTodo(id, completed) {
        try {
            const response = await fetch(`${API_URL}/todos/${id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ completed })
            });
            return await response.json();
        } catch (error) {
            console.error('Toggle todo error:', error);
            throw error;
        }
    },

    async deleteTodo(id) {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Delete todo error:', error);
            throw error;
        }
    }
};