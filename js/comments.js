// js/comments.js
class CommentsManager {
    constructor() {
        this.currentCharacter = '';
        this.commentsSection = document.getElementById('comments-section');
        this.commentsList = document.getElementById('comments-list');
        this.commentForm = document.getElementById('comment-form');
        this.commentText = document.getElementById('comment-text');
        this.commentRating = document.getElementById('comment-rating');
        this.isLoggedIn = false; // will verify with server
        
        this.init();
    }

    init() {
        // Event listeners
        if (this.commentForm) {
            this.commentForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Verify login status with server
        API.checkAuth().then(res => {
            if (res && res.success) this.isLoggedIn = true;
        }).catch(() => {});

        // React to login/logout events
        window.addEventListener('app:login', () => { this.isLoggedIn = true; });
        window.addEventListener('app:logout', () => { this.isLoggedIn = false; });
    }

    async loadComments(characterName = '') {
        if (!characterName) return;
        
        this.currentCharacter = characterName;
        
        try {
            const result = await API.getComments(characterName);
            
            if (result.success) {
                this.displayComments(result.comments, result.rating_data);
                this.showCommentsSection();
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    displayComments(comments, ratingData) {
        if (!this.commentsList) return;
        
        let html = '';
        
        // Display average rating
        if (ratingData && ratingData.avg_rating) {
            html += `
                <div class="average-rating">
                    <h4>Rating: ${parseFloat(ratingData.avg_rating).toFixed(1)}/5</h4>
                    <p>${ratingData.total_comments} komentar</p>
                </div>
            `;
        }
        
        // Display each comment
        if (comments.length > 0) {
            comments.forEach(comment => {
                const date = new Date(comment.created_at).toLocaleDateString('id-ID');
                const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
                
                html += `
                    <div class="comment-item" data-id="${comment.id}">
                        <div class="comment-header">
                            <strong>${comment.username}</strong>
                            <span class="comment-rating">${stars}</span>
                        </div>
                        <div class="comment-body">
                            <p>${comment.comment}</p>
                        </div>
                        <div class="comment-date">${date}</div>
                    </div>
                `;
            });
        } else {
            html = '<p style="text-align: center; color: #aaa;">Belum ada komentar. Jadilah yang pertama!</p>';
        }
        
        this.commentsList.innerHTML = html;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.isLoggedIn) {
            alert('Anda harus login untuk menambahkan komentar!');
            return;
        }
        
        const comment = this.commentText.value.trim();
        const rating = parseInt(this.commentRating.value);
        
        if (!comment || !this.currentCharacter) {
            alert('Komentar tidak boleh kosong!');
            return;
        }
        
        try {
            const result = await API.addComment(this.currentCharacter, comment, rating);
            
            if (result.success) {
                alert('Komentar berhasil ditambahkan!');
                this.commentForm.reset();
                // Reload comments
                this.loadComments(this.currentCharacter);
            } else {
                alert('Gagal menambahkan komentar: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Terjadi kesalahan saat menambahkan komentar');
        }
    }

    showCommentsSection() {
        if (this.commentsSection) {
            this.commentsSection.style.display = 'block';
        }
    }

    hideCommentsSection() {
        if (this.commentsSection) {
            this.commentsSection.style.display = 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.CommentsManager = new CommentsManager();
});
