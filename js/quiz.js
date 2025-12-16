let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let answers = [];
let isAdmin = false;

function initQuiz() {
    checkAdminStatus();
    loadQuizzes();
    setupEventListeners();
}

function setupEventListeners() {
    // Event listeners
    const createBtn = document.getElementById('create-quiz-btn');
    if (createBtn) createBtn.addEventListener('click', createQuiz);

    const addQuestionBtn = document.getElementById('add-question-btn');
    if (addQuestionBtn) addQuestionBtn.addEventListener('click', addQuestion);

    const quizForm = document.getElementById('quiz-form');
    if (quizForm) quizForm.addEventListener('submit', saveQuiz);

    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) hintBtn.addEventListener('click', showHint);

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);

    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);

    const backToSelectionBtn = document.getElementById('back-to-selection-btn');
    if (backToSelectionBtn) backToSelectionBtn.addEventListener('click', backToSelection);

    // Modal close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', function() {
        document.getElementById('quiz-editor').style.display = 'none';
    });

    // Modal outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('quiz-editor');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Expose QuizManager for SPA loader compatibility
window.QuizManager = {
    init: initQuiz
};

function loadQuizzes() {
    loadAvailableQuizzes();
}

function checkAdminStatus() {
    fetch('api/auth.php?action=check', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        isAdmin = data.success && data.user && data.user.user_type === 'admin';
        if (isAdmin) {
            const adminDiv = document.getElementById('admin-panel');
            if (adminDiv) adminDiv.style.display = 'block';
            loadAdminQuizzes();
        }
    })
    .catch(error => console.error('Error checking admin status:', error));
}

function loadAvailableQuizzes() {
    fetch('api/quiz.php', {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayQuizzes(data.quizzes);
        }
    })
    .catch(error => console.error('Error loading quizzes:', error));
}

function displayQuizzes(quizzes) {
    const container = document.getElementById('quiz-items');
    if (!container) {
        // Prevent infinite retry loop if page is not quiz
        if (window.location.hash !== '#quiz') return;
        console.error('Quiz container not found, retrying in 100ms...');
        setTimeout(() => displayQuizzes(quizzes), 100);
        return;
    }

    container.innerHTML = '';

    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.description || 'No description'}</p>
            <button class="btn-play" data-quiz-id="${quiz.id}">Play Quiz</button>
        `;
        container.appendChild(quizCard);
    });

    // Add event listeners
    document.querySelectorAll('.btn-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = this.getAttribute('data-quiz-id');
            startQuiz(quizId);
        });
    });
}

function startQuiz(quizId) {
    fetch(`api/quiz.php?id=${quizId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentQuiz = data.quiz;
            currentQuestionIndex = 0;
            score = 0;
            streak = 0;
            bestStreak = 0;
            answers = [];

            document.getElementById('quiz-selection').style.display = 'none';
            document.getElementById('quiz-play').style.display = 'block';
            document.getElementById('current-quiz-title').textContent = currentQuiz.title;

            showQuestion();
        }
    })
    .catch(error => console.error('Error starting quiz:', error));
}

function showQuestion() {
    const question = JSON.parse(currentQuiz.questions)[currentQuestionIndex];
    document.getElementById('question-counter').textContent = `Question ${currentQuestionIndex + 1}/${JSON.parse(currentQuiz.questions).length}`;
    document.getElementById('score-display').textContent = `Score: ${score}`;
    document.getElementById('streak-display').textContent = `Streak: ${streak}`;
    document.getElementById('category-badge').textContent = question.category || 'General';
    document.getElementById('question-text').textContent = question.q;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.addEventListener('click', () => selectAnswer(index, question.answer));
        optionsContainer.appendChild(optionBtn);
    });

    document.getElementById('hint-btn').style.display = question.hint ? 'inline-block' : 'none';
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(selectedIndex, correctIndex) {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => btn.disabled = true);

    answers.push(selectedIndex);

    if (selectedIndex === correctIndex) {
        optionBtns[selectedIndex].classList.add('correct');
        score += 10 + (streak * 5); // Bonus for streak
        streak++;
        if (streak > bestStreak) bestStreak = streak;
    } else {
        optionBtns[selectedIndex].classList.add('incorrect');
        optionBtns[correctIndex].classList.add('correct');
        streak = 0;
    }

    document.getElementById('next-btn').style.display = 'inline-block';
}

function showHint() {
    const question = JSON.parse(currentQuiz.questions)[currentQuestionIndex];
    if (question.hint) {
        document.getElementById('hint-text').textContent = question.hint;
        document.getElementById('hint-text').style.display = 'block';
        document.getElementById('hint-btn').style.display = 'none';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    const questions = JSON.parse(currentQuiz.questions);

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById('quiz-play').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';

    const totalQuestions = JSON.parse(currentQuiz.questions).length;
    const accuracy = Math.round((score / (totalQuestions * 10)) * 100);

    document.getElementById('final-score').textContent = score;
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('accuracy').textContent = `${accuracy}%`;

    // Save attempt
    fetch('api/quiz_attempt.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quiz_id: currentQuiz.id,
            score: score,
            total_questions: totalQuestions,
            answers: answers
        })
    })
    .catch(error => console.error('Error saving attempt:', error));
}

function playAgain() {
    document.getElementById('quiz-results').style.display = 'none';
    startQuiz(currentQuiz.id);
}

function backToSelection() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-play').style.display = 'none';
    document.getElementById('quiz-selection').style.display = 'block';
}

// Admin functions
function loadAdminQuizzes() {
    fetch('api/quiz.php', {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayAdminQuizzes(data.quizzes);
        }
    })
    .catch(error => console.error('Error loading admin quizzes:', error));
}

function displayAdminQuizzes(quizzes) {
    const container = document.getElementById('quizzes-list');
    if (!container) {
        console.error('Admin quizzes-list container not found!');
        return;
    }
    container.innerHTML = '';

    quizzes.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.className = 'admin-quiz-item';
        quizItem.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.description || 'No description'}</p>
            <div class="admin-actions">
                <button class="edit-btn" data-quiz-id="${quiz.id}">Edit</button>
                <button class="delete-btn" data-quiz-id="${quiz.id}">Delete</button>
            </div>
        `;
        container.appendChild(quizItem);
    });

    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = this.getAttribute('data-quiz-id');
            editQuiz(quizId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = this.getAttribute('data-quiz-id');
            if (confirm('Are you sure you want to delete this quiz?')) {
                deleteQuiz(quizId);
            }
        });
    });
}

function createQuiz() {
    // Use the existing form in the HTML
    const form = document.getElementById('quiz-form');
    if (form) {
        form.reset();
        const questionsEditor = document.getElementById('questions-container');
        if (questionsEditor) questionsEditor.innerHTML = '';
        // Add one question by default
        addQuestionToForm();
        // Show the modal and set title
        document.getElementById('quiz-editor').style.display = 'block';
        document.getElementById('editor-title').textContent = 'Create Quiz';
    }
}

function editQuiz(quizId) {
    fetch(`api/quiz.php?id=${quizId}`, {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const quiz = data.quiz;
            document.getElementById('quiz-id').value = quiz.id;
            document.getElementById('quiz-title').value = quiz.title;
            document.getElementById('quiz-description').value = quiz.description || '';
            document.getElementById('editor-title').textContent = 'Edit Quiz';
            loadQuestionsForEdit(JSON.parse(quiz.questions));
            document.getElementById('quiz-editor').style.display = 'block';
        }
    })
    .catch(error => console.error('Error loading quiz for edit:', error));
}

function loadQuestionsForEdit(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    questions.forEach((question, index) => {
        addQuestionToForm(question, index);
    });
}

function addQuestion() {
    addQuestionToForm();
}

function addQuestionToForm(question = null, index = null) {
    const container = document.getElementById('questions-container');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <h4>Question ${container.children.length + 1}</h4>
        <input type="text" placeholder="Question text" value="${question ? question.q : ''}" required>
        <input type="text" placeholder="Hint (optional)" value="${question ? (question.hint || '') : ''}">
        <input type="text" placeholder="Category" value="${question ? (question.category || '') : ''}" required>
        <div class="options-container">
            ${question ? question.options.map((opt, i) => `
                <input type="text" placeholder="Option ${i+1}" value="${opt}" required>
                <input type="radio" name="correct-${container.children.length}" value="${i}" ${question.answer == i ? 'checked' : ''}> Correct
            `).join('') : `
                <input type="text" placeholder="Option 1" required>
                <input type="radio" name="correct-${container.children.length}" value="0" checked> Correct
                <input type="text" placeholder="Option 2" required>
                <input type="radio" name="correct-${container.children.length}" value="1"> Correct
                <input type="text" placeholder="Option 3" required>
                <input type="radio" name="correct-${container.children.length}" value="2"> Correct
                <input type="text" placeholder="Option 4" required>
                <input type="radio" name="correct-${container.children.length}" value="3"> Correct
            `}
        </div>
        <button type="button" class="remove-question-btn">Remove Question</button>
    `;
    container.appendChild(questionDiv);

    // Add remove event
    questionDiv.querySelector('.remove-question-btn').addEventListener('click', function() {
        container.removeChild(questionDiv);
    });
}

function saveQuiz(event) {
    event.preventDefault();

    const quizId = document.getElementById('quiz-id').value;
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;

    const questions = [];
    const questionItems = document.querySelectorAll('.question-item');

    questionItems.forEach(item => {
        const inputs = item.querySelectorAll('input[type="text"]');
        const radios = item.querySelectorAll('input[type="radio"]');
        const q = inputs[0].value;
        const hint = inputs[1].value;
        const category = inputs[2].value;
        const options = Array.from(inputs).slice(3).map(inp => inp.value);
        let answer = 0;
        radios.forEach((radio, index) => {
            if (radio.checked) answer = parseInt(radio.value);
        });

        questions.push({ q, options, answer, hint, category });
    });

    const quizData = {
        title,
        description,
        questions: JSON.stringify(questions)
    };

    const method = quizId ? 'PUT' : 'POST';
    const url = quizId ? `api/quiz.php?id=${quizId}` : 'api/quiz.php';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('quiz-editor').style.display = 'none';
            loadAdminQuizzes();
            loadAvailableQuizzes();
        } else {
            alert('Error saving quiz: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error saving quiz:', error);
        alert('Error saving quiz');
    });
}

function deleteQuiz(quizId) {
    fetch(`api/quiz.php?id=${quizId}`, {
        method: 'DELETE',
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadAdminQuizzes();
            loadAvailableQuizzes();
        } else {
            alert('Error deleting quiz: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz');
    });
}

// Event listeners are set up in setupEventListeners()
