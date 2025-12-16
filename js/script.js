// Data Konten Halaman (HTML Strings)
const pageContent = {
    home: `
        <div id="home" class="page-content">
            <div class="home-image"></div>
        </div>
    `,
    
    about: `
        <div id="about" class="page-content">
             <ul class="character-tabs">
                <li><a href="#" data-char="arthur" class="char-tab-link active">ARTHUR</a></li>
                <li><a href="#" data-char="dutch" class="char-tab-link">DUTCH</a></li>
                <li><a href="#" data-char="micah" class="char-tab-link">MICAH</a></li>
                <li><a href="#" data-char="john" class="char-tab-link">JOHN</a></li>
            </ul>
            
            <div class="about-flex-container">
                <div class="about-left"><div id="char-name-desc"></div></div>
                <div class="about-center"><div id="char-image-container"></div></div>
                <div class="about-right"><h2>SYNOPSIS</h2><div id="char-synopsis"></div></div>
            </div>
        </div>
    `,

    character: `
        <div id="character" class="page-content">
            <div class="character-card" data-char="arthur">
                <div class="card-image"><img src="media/arthur.png" alt="Arthur Morgan"></div>
                <div class="card-info">
                    <h3>THE MAN</h3>
                    <p>One of the oldest and most influential members of the gang. He is known as a loyal, tough guy, but also begins to doubt his path as time goes on.</p>
                </div>
            </div>
            <div class="character-card" data-char="dutch">
                <div class="card-image"><img src="media/Dutch.png" alt="Dutch van der Linde"></div>
                <div class="card-info">
                    <h3>THE PLAN</h3>
                    <p>He believed that they could create a better world outside the law, but over time, his ambition turned into obsession.</p>
                </div>
            </div>
            <div class="character-card" data-char="micah">
                <div class="card-image"><img src="media/Micah.png" alt="Micah Bell"></div>
                <div class="card-info">
                    <h3>THE RAT</h3>
                    <p>He was just an ordinary member of the Van Der Linde gang, but with his intelligence in manipulating people, he managed to secure Dutch's.</p>
                </div>
            </div>
            <div class="character-card" data-char="john">
                <div class="card-image"><img src="media/john.png" alt="John Marston"></div>
                <div class="card-info">
                    <h3>THE LAST</h3>
                    <p>Unlike Arthur, who has become Dutch's right-hand man, John is often looked down upon by the other gang members because of his stubborn.</p>
                </div>
            </div>
        </div>
    `,

    game: `
        <div id="game" class="page-content">
            <div class="game-content-wrapper">
                <div class="game-info">
                    <div class="game-image-rdr2"></div>
                </div>
                <div class="platform-links">
                    <a href="https://store.epicgames.com/en-US/p/red-dead-redemption-2" target="_blank">
                        <img src="media/epic.png" alt="Epic Games">
                    </a>
                    <a href="https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/" target="_blank">
                        <img src="media/steam.png" alt="Steam">
                    </a>
                    <a href="https://www.playstation.com/en-id/games/red-dead-redemption-2/" target="_blank">
                        <img src="media/ps.png" alt="PlayStation">
                    </a>
                    <a href="https://www.xbox.com/en-US/games/red-dead-redemption-2" target="_blank">
                        <img src="media/xbox.png" alt="Xbox">
                    </a>
                </div>
            </div>
        </div>
    `,

    quiz: `
    <div id="quiz" class="page-content">
        <div class="quiz-wrapper">
            <!-- Quiz Selection -->
            <div id="quiz-selection" class="quiz-list">
                <h2><span class="accent"></span> QUIZ LIST</h2>
                <div id="quiz-items">
                    <!-- Quizzes will be loaded here -->
                </div>
                <div class="quiz-actions">
                    <button id="refresh-quizzes" class="btn-small">
                        <span class="icon"></span> Refresh List
                    </button>
                </div>
            </div>

            <!-- Quiz Play -->
            <div id="quiz-play" class="quiz-play" style="display: none;">
                <div class="quiz-header">
                    <h2 id="current-quiz-title"></h2>
                    <div class="quiz-stats">
                        <span id="question-counter">Question 1/10</span>
                        <span id="score-display">Score: 0</span>
                        <span id="streak-display">Streak: 0</span>
                    </div>
                </div>

                <div class="question-card">
                    <div class="category-badge" id="category-badge"></div>
                    <p id="question-text"></p>
                    <div class="options" id="options"></div>
                    <button id="hint-btn" class="hint-btn">Show Hint</button>
                    <div id="hint-text" class="hint-text" style="display: none;"></div>
                </div>

                <div class="quiz-controls">
                    <button id="next-btn" class="btn-next" style="display: none;">Next Question</button>
                </div>
            </div>

            <!-- Quiz Results -->
            <div id="quiz-results" class="quiz-results" style="display: none;">
                <h2>Quiz Complete!</h2>
                <div class="results-summary">
                    <p>Final Score: <span id="final-score"></span></p>
                    <p>Best Streak: <span id="best-streak"></span></p>
                    <p>Accuracy: <span id="accuracy"></span></p>
                </div>
                <button id="play-again-btn" class="btn-play-again">Play Again</button>
                <button id="back-to-selection-btn" class="btn-back">Choose Another Quiz</button>
            </div>

            <!-- Admin Panel -->
            <div id="admin-panel" class="admin-panel" style="display: none;">
                <h2>Admin: Manage Quizzes <span class="admin-badge">ADMIN</span></h2>
                <button id="create-quiz-btn" class="btn-admin">Create New Quiz</button>
                <div id="quizzes-list" class="quizzes-list"></div>
            </div>

            <!-- Quiz Editor Modal -->
            <div id="quiz-editor" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2 id="editor-title">Create Quiz</h2>
                    <form id="quiz-form">
                        <input type="hidden" id="quiz-id">
                        <div class="form-group">
                            <label for="quiz-title">Title:</label>
                            <input type="text" id="quiz-title" required>
                        </div>
                        <div class="form-group">
                            <label for="quiz-description">Description:</label>
                            <textarea id="quiz-description"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Questions:</label>
                            <div id="questions-container">
                                <!-- Questions will be added here -->
                            </div>
                            <button type="button" id="add-question-btn" class="btn-add">Add Question</button>
                        </div>
                        <button type="submit" class="btn-submit">Save Quiz</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
`
};

const characterData = {
    arthur: {
        name: "ARTHUR MORGAN",
        desc: "ARTHUR MORGAN IS THE MAIN PROTAGONIST IN RED DEAD REDEMPTION II, A SENIOR MEMBER OF THE DUTCH VAN DER LINDE GANG WHO IS KNOWN AS A TOUGH FIGHTER, A SKILLED HUNTER, AND A MAN WITH HIS OWN MORAL CODE. BORN INTO A LIFE OF VIOLENCE ARTHUR GROWS UP TO BE A MAN LOYAL TO HIS GROUP BUT OVER TIME BEGINS TO QUESTION THE PATH HE HAS TAKEN.",
        image: "media/arthur.png",
        synopsis: "THE GAME IS SET IN 1899, NEAR THE END OF THE WILD WEST ERA IN AMERICA. THE PLAYER CONTROLS ARTHUR MORGAN, A SENIOR MEMBER OF THE DUTCH VAN DER LINDE GANG, A GROUP OF OUTLAWS WHO MAKE THEIR LIVING BY ROBBING, STEALING, AND SURVIVING THE GOVERNMENT.AFTER A ROBBERY IN THE TOWN OF BLACKWATER GOES TERRIBLY WRONG, THE GANG IS FORCED TO FLEE AND FIND A WAY TO SURVIVE. OVER TIME, ARTHUR BEGINS TO SEE CHANGES IN DUTCH'S LEADERSHIP, WHO BECOMES INCREASINGLY PARANOID AND DESTRUCTIVE, ESPECIALLY AFTER A TRAITOR, MICAH BELL, BEGINS TO GAIN DUTCH'S TRUST.THE PLAYER CAN CHOOSE WHETHER ARTHUR WILL REMAIN LOYAL TO THE GANG OR SEEK REDEMPTION FOR HIS PAST."
    },
    dutch: {
        name: "DUTCH VAN DER LINDE",
        desc: "DUTCH VAN DER LINDE IS THE CHARISMATIC LEADER OF THE VAN DER LINDE GANG, A ROMANTIC IDEALIST WHO DREAMS OF A LIFE FREE FROM THE CONSTRAINTS OF CIVILIZATION, VIEWING HIMSELF AS A ROBIN HOOD FIGURE. HE USES HIS SILVER TONGUE TO INSPIRE LOYALTY. HOWEVER, AS THE LAW CLOSES IN, DUTCH DESCENDS INTO PARANOIA, SLOWLY TEARING APART THE FAMILY HE BUILT IN HIS DESPERATE FIGHT FOR SURVIVAL.",
        image: "media/dutch.png",
        synopsis: "DUTCH VAN DER LINDE ADALAH PEMIMPIN KARISMATIK GENG YANG BERJUANG UNTIK KEBEBASAN. NAMUN, SETELAH PERAMPOKAN YANG GAGAL DI BLACKWATER, KEPEMIMPINANNYA MULAI GOYAH. KECURIGAAN DAN PARANOIA MENGGEROGOTI DIRINYA, MEMBUAT KEPUTUSAN-KEPUTUSANNYA MENJADI SEMAKIN RENTAN DAN MEMBAHAYAKAN SELURUH ANGGOTA GENG."
    },
    micah: {
        name: "MICAH BELL",
        desc: "MICAH BELL IS A CAREER CRIMINAL AND HITMAN, WILD AND UNPREDICTABLE. HE LIVES FOR THE ACTION. ALTHOUGH HE HAS ONLY BEEN WITH THE GANG FOR A FEW MONTHS, HE HAS QUICKLY GAINED DUTCH'S EAR. MICAH ENJOYS THE CHAOS OF THE OUTLAW LIFE AND BELIEVES IN SURVIVAL OF THE FITTEST, MAKING HIM A DANGEROUS AND DIVISIVE FIGURE WITHIN THE CAMP WHO FREQUENTLY CLASHES WITH ARTHUR.",
        image: "media/micah.png",
        synopsis: "MICAH BELL ADALAH FIGUR YANG DIVISIF DAN BERBAHAYA. SINOPOSIS INI BERFOKUS PADA BAGAIMANA PERLAKUAN BURUKNYA DAN KONFLIKNYA DENGAN ARTHUR MORGAN MEMPERCEPAT PERPECAHAN INTERNAL GENG. KESETIAAN DIUJI, DAN ERA PENJAHAT SEJATI MENGALAMI KEHANCURAN DENGAN ADANYA PENGKHIANATAN."
    },
    john: {
        name: "JOHN MARSTON",
        desc: "JOHN MARSTON WAS TAKEN IN BY DUTCH AT THE AGE OF TWELVE. ASTUTE, FEARLESS, AND STRONG-WILLED, HE AND ARTHUR ARE DUTCH'S PROUDEST PROTÉGÉS. HOWEVER, JOHN STRUGGLES WITH THE RESPONSIBILITIES OF FATHERHOOD AND HIS PLACE IN A CHANGING WORLD, OFTEN FINDING HIMSELF TORN BETWEEN THE OUTLAW LIFE HE WAS RAISED IN AND THE FAMILY HE LOVES.",
        image: "media/john.png",
        synopsis: "SINOPOSIS JOHN MARSTON MELIPUTI PERJALANANNYA UNTUK MENYEIMBANGKAN KEHIDUPAN OUTLAW DENGAN TANGGUNG JAWAB SEBAGAI SEORANG AYAH DAN SUAMI. IA ADALAH PROTÉGÉ DUTCH YANG PALING TERKEMUKA, TETAPI KONFLIK INTERNALNYA MENCERMINKAN TEMA REDEMPTION YANG LEBIH BESAR DALAM PERMAINAN."
    }
};

// Global variables
const contentContainer = document.getElementById('content-container');
const navLinks = document.querySelectorAll('nav ul li a');
let isAnimating = false;
let currentPage = 'home';

// ==================== NAVIGATION FUNCTIONS ====================

function animatePageTransition(direction, callback) {
    if (isAnimating) return;
    isAnimating = true;

    const main = document.querySelector('main');
    main.style.opacity = '0';
    main.style.transform = direction === 'next' ? 'translateY(-50px)' : 'translateY(50px)';
    
    setTimeout(() => {
        if (callback) callback();
        main.style.transform = direction === 'next' ? 'translateY(50px)' : 'translateY(-50px)';
        
        setTimeout(() => {
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
            setTimeout(() => { isAnimating = false; }, 600);
        }, 50);
    }, 400);
}

function updateURLHash(pageName) {
    if (pageName === 'home') {
        history.replaceState(null, null, ' ');
        window.location.hash = '';
    } else {
        history.replaceState(null, null, '#' + pageName);
        window.location.hash = pageName;
    }
}

function updateActiveNav(pageName) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
}

function cleanupCurrentPage() {
    console.log('🧹 Cleaning up current page:', currentPage);
    switch(currentPage) {
        case 'quiz':
            if (typeof window.QuizManager !== 'undefined' && 
                typeof window.QuizManager.cleanup === 'function') {
                window.QuizManager.cleanup();
            }
            // Reset quizPageInitialized guard for SPA
            window.quizPageInitialized = false;
            break;
        case 'about':
            // Reset about page state jika perlu
            break;
    }
}

function loadPageContent(pageName, useAnimation = true) {
    console.log('🔄 Loading page:', pageName);
    
    // Cleanup previous page
    cleanupCurrentPage();
    
    currentPage = pageName;
    
    const newContentHtml = pageContent[pageName] || '';
    const commentsSection = document.getElementById('comments-section');
    
    const loadContent = () => {
        // Update URL dan UI
        updateURLHash(pageName);
        updateActiveNav(pageName);
        
        // Load content
        contentContainer.innerHTML = newContentHtml;
        const pageElement = contentContainer.querySelector('.page-content');
        if (pageElement) pageElement.scrollTop = 0;

        // Initialize page-specific functionality
        switch(pageName) {
            case 'about':
                initializeAboutPage();
                if (commentsSection) commentsSection.style.display = 'block';
                break;
            case 'character':
                initializeCharacterPage();
                if (commentsSection) commentsSection.style.display = 'none';
                break;
            case 'quiz':
                initializeQuizPage();
                if (commentsSection) commentsSection.style.display = 'none';
                break;
            case 'game':
            case 'home':
            default:
                if (commentsSection) commentsSection.style.display = 'none';
                break;
        }
        
        // Dispatch page change event
        window.dispatchEvent(new CustomEvent('page:changed', {
            detail: { page: pageName }
        }));
        
        console.log('✅ Page loaded:', pageName);
    };

    if (useAnimation) {
        animatePageTransition('next', loadContent);
    } else {
        loadContent();
    }
}

// ==================== PAGE INITIALIZATION FUNCTIONS ====================

function initializeAboutPage() {
    console.log('🎯 Initializing about page...');
    
    const aboutPage = document.getElementById('about');
    if (!aboutPage) return;

    const charTabs = aboutPage.querySelectorAll('.char-tab-link');
    const charNameDesc = aboutPage.querySelector('#char-name-desc');
    const charImageContainer = aboutPage.querySelector('#char-image-container');
    const charSynopsis = aboutPage.querySelector('#char-synopsis');

    function loadCharacterDetail(charKey) {
        const data = characterData[charKey];
        if (!data) return;

        if (charNameDesc) charNameDesc.innerHTML = `<div class="char-content"><h1>${data.name}</h1><p>${data.desc}</p></div>`;
        if (charImageContainer) charImageContainer.innerHTML = `<div class="char-image-container"><img src="${data.image}" alt="${data.name}"></div>`;
        if (charSynopsis) charSynopsis.innerHTML = `<p>${data.synopsis}</p>`;

        const charMap = {
            arthur: 'Arthur Morgan',
            dutch: 'Dutch van der Linde',
            micah: 'Micah Bell',
            john: 'John Marston'
        };

        const dbName = charMap[charKey] || '';
        if (window.CommentsManager && dbName) {
            window.CommentsManager.loadComments(dbName);
        }
    }

    charTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            charTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            loadCharacterDetail(e.target.dataset.char);
        });
    });

    loadCharacterDetail('arthur');
}

function initializeCharacterPage() {
    console.log('🎯 Initializing character page...');
    
    const cards = document.querySelectorAll('.character-card');
    
    if (cards.length > 0) {
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('active');
            });
        });
    }
}

// SINGLE initializeQuizPage function (remove duplicate!)
function initializeQuizPage() {
    console.log('🎯 Initializing quiz page...');

    // Guard clause untuk prevent multiple initialization
    if (window.quizPageInitialized) {
        console.log('⚠️ Quiz page already initialized, skipping...');
        return;
    }
    window.quizPageInitialized = true;

    // Setup with delay untuk pastikan DOM ready
    setTimeout(() => {
        // Initialize QuizManager from quiz.js
        if (window.QuizManager && typeof window.QuizManager.init === 'function') {
            window.QuizManager.init();
        } else {
            console.error('QuizManager not available');
        }
    }, 500);
}





// ==================== EVENT LISTENERS ====================

// Setup nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAnimating) return;
        
        const pageName = e.target.dataset.page;
        console.log('Nav clicked:', pageName);
        
        loadPageContent(pageName, true);
    });
});

// Handle hash changes (back/forward buttons)
window.addEventListener('hashchange', function() {
    console.log('🔗 Hash changed to:', window.location.hash);
    
    const hash = window.location.hash.replace('#', '') || 'home';
    const validPages = ['home', 'about', 'character', 'game', 'quiz'];
    
    if (validPages.includes(hash)) {
        loadPageContent(hash, false);
    }
});

// Handle popstate (browser back/forward)
window.addEventListener('popstate', function(event) {
    console.log('🔙 popstate event');
    
    const hash = window.location.hash.replace('#', '') || 'home';
    const validPages = ['home', 'about', 'character', 'game', 'quiz'];
    
    if (validPages.includes(hash)) {
        loadPageContent(hash, false);
    }
});

// Global form submit handler
document.addEventListener('submit', function(e) {
    // Quiz form is handled by quiz.js
});

function handleQuizCreate(e) {
    const form = e.target;
    const title = form.querySelector('#quiz-title').value;
    const description = form.querySelector('#quiz-desc').value;

    const questions = [];
    const questionItems = form.querySelectorAll('.question-item');

    questionItems.forEach(item => {
        const inputs = item.querySelectorAll('input[type="text"]');
        const correctInput = item.querySelector('input[type="number"]');

        if (inputs.length >= 5 && correctInput) {
            const q = inputs[0].value;
            const options = Array.from(inputs).slice(1, 5).map(inp => inp.value);
            const answer = parseInt(correctInput.value);

            if (q && options.every(opt => opt)) {
                questions.push({ q, options, answer });
            }
        }
    });

    if (!title || questions.length === 0) {
        alert('Please fill in title and at least one question');
        return;
    }

    const quizData = {
        title,
        description,
        questions: JSON.stringify(questions)
    };

    fetch('api/quiz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Quiz created successfully!');
            form.reset();
            // Clear questions
            document.getElementById('quiz-questions-editor').innerHTML = '';
            addQuestionItem(); // Add one empty question
            loadQuizData(); // Refresh quiz list
        } else {
            alert('Error creating quiz: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error creating quiz:', error);
        alert('Error creating quiz');
    });
}

// Global click handlers
document.addEventListener('click', function(e) {
    // Quiz-related handlers are managed by quiz.js
});

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    
    // Load initial page based on hash
    const initialHash = window.location.hash.replace('#', '') || 'home';
    const validPages = ['home', 'about', 'character', 'game', 'quiz'];
    
    if (validPages.includes(initialHash)) {
        loadPageContent(initialHash, false);
    } else {
        loadPageContent('home', false);
    }
});