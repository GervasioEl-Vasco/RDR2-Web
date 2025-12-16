// js/api.js - API Client untuk komunikasi dengan backend

const API = {
    baseURL: 'api',
    
    // Generic request handler
    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}/${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Untuk session cookies
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            console.error('URL was:', url);
            throw error;
        }
    },
    
    // --- Authentication Methods ---
    async login(usernameOrEmail, password) {
        return this.request('auth.php?action=login', 'POST', {
            username_email: usernameOrEmail,
            password
        });
    },

    async register(username, email, password) {
        return this.request('auth.php?action=register', 'POST', {
            username,
            email,
            password
        });
    },

    async logout() {
        return this.request('auth.php?action=logout', 'POST');
    },

    async checkAuth() {
        return this.request('auth.php?action=check', 'GET');
    },

    // --- Comments Methods ---
    async getComments(character = '') {
        const endpoint = character 
            ? `comments.php?character=${encodeURIComponent(character)}`
            : 'comments.php';
        return this.request(endpoint, 'GET');
    },

    async addComment(characterName, comment, rating) {
        return this.request('comments.php', 'POST', {
            character_name: characterName,
            comment,
            rating
        });
    },

    async updateComment(commentId, comment, rating) {
        return this.request('comments.php', 'PUT', {
            id: commentId,
            comment,
            rating
        });
    },

    async deleteComment(commentId) {
        return this.request(`comments.php?id=${commentId}`, 'DELETE');
    },

    // --- Quiz Methods ---
    async getQuizzes() {
        return this.request('quiz.php', 'GET');
    },

    async getQuiz(id) {
        return this.request(`quiz.php?id=${id}`, 'GET');
    },

    async createQuiz(payload) {
        return this.request('quiz.php', 'POST', payload);
    },

    async updateQuiz(id, payload) {
        payload.id = id;
        return this.request('quiz.php', 'PUT', payload);
    },

    async deleteQuiz(id) {
        return this.request(`quiz.php?id=${id}`, 'DELETE');
    },

    // --- Quiz Attempts ---
    async recordAttempt(payload) {
        return this.request('quiz_attempt.php', 'POST', payload);
    },

    async getAttempts(params = {}) {
        let endpoint = 'quiz_attempt.php';
        const qs = new URLSearchParams(params).toString();
        if (qs) endpoint += `?${qs}`;
        return this.request(endpoint, 'GET');
    }
};

// Export global API instance
window.API = API;