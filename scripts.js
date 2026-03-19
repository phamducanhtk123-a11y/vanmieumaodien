// ================== COMMON FUNCTIONS ==================

// Navigation management
document.addEventListener('DOMContentLoaded', function() {
    updateActiveNavigation();
});

function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html')) {
            link.style.color = 'var(--gold)';
            link.style.borderBottom = '2px solid var(--gold)';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================== TOUR PAGE FUNCTIONS ==================

let currentSlide = 0;
let slides = [];

function initSlideshow(slideshowId) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return;
    
    slides = slideshow.querySelectorAll('.slide');
    if (slides.length > 0) {
        showSlide(0);
    }
}

function showSlide(n) {
    if (slides.length === 0) return;
    
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');
}

function nextSlide(slideshowId) {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide(slideshowId) {
    currentSlide--;
    showSlide(currentSlide);
}

function scrollToStep(stepNumber) {
    const step = document.getElementById(`step-${stepNumber}`);
    if (step) {
        step.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        // Add highlight animation
        step.classList.remove('active');
        void step.offsetWidth; // Trigger reflow
        step.classList.add('active');
    }
}

// ================== QUIZ FUNCTIONS ==================

let quizAnswers = [];
let quizSubmitted = false;

function initQuiz(quizId, totalQuestions) {
    quizAnswers = new Array(totalQuestions).fill(null);
    quizSubmitted = false;
}

function selectAnswer(questionIndex, selectedOption) {
    if (quizSubmitted) return;
    
    // Remove previous selection
    const options = document.querySelectorAll(`[data-question="${questionIndex}"]`);
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to new option
    selectedOption.classList.add('selected');
    quizAnswers[questionIndex] = selectedOption.getAttribute('data-value');
}

function submitQuiz(correctAnswers) {
    if (quizSubmitted) return;
    
    quizSubmitted = true;
    let correctCount = 0;
    
    correctAnswers.forEach((correct, index) => {
        const options = document.querySelectorAll(`[data-question="${index}"]`);
        
        options.forEach(option => {
            const value = option.getAttribute('data-value');
            
            if (value === correct) {
                option.classList.add('correct');
                if (value === quizAnswers[index]) {
                    correctCount++;
                }
            } else if (value === quizAnswers[index]) {
                option.classList.add('incorrect');
            }
        });
    });
    
    // Show results
    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        const percentage = Math.round((correctCount / correctAnswers.length) * 100);
        resultDiv.innerHTML = `
            <div class="feedback correct">
                <h3>Kết quả: ${correctCount}/${correctAnswers.length} đúng</h3>
                <p>Bạn đạt được ${percentage}% điểm.</p>
                <p>${getQuizFeedback(percentage)}</p>
            </div>
        `;
    }
    
    // Disable all options
    document.querySelectorAll('.option').forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.8';
    });
}

function resetQuiz() {
    quizAnswers = [];
    quizSubmitted = false;
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.style.pointerEvents = 'auto';
        opt.style.opacity = '1';
    });
    
    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
}

function getQuizFeedback(percentage) {
    if (percentage === 100) {
        return '🏆 Xuất sắc! Bạn là chuyên gia về Văn Miếu Mao Điền!';
    } else if (percentage >= 80) {
        return '🌟 Rất tốt! Bạn có kiến thức tốt về di tích.';
    } else if (percentage >= 60) {
        return '👍 Tốt! Bạn hiểu khá nhiều về Văn Miếu Mao Điền.';
    } else if (percentage >= 40) {
        return '📚 Bạn cần ôn tập thêm để nắm vững kiến thức.';
    } else {
        return '💪 Hãy tham quan và học tập thêm để hiểu hơn về di tích!';
    }
}

// ================== FIGURES PAGE FUNCTIONS ==================

function toggleDetails(figureId) {
    const details = document.getElementById(`${figureId}-details`);
    if (details) {
        const isVisible = details.style.display !== 'none';
        // Hide all details first
        document.querySelectorAll('[id$="-details"]').forEach(el => {
            el.style.display = 'none';
        });
        // Show selected details if it was hidden
        if (!isVisible) {
            details.style.display = 'block';
            details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        if (audio.paused) {
            // Pause other audios
            document.querySelectorAll('audio').forEach(a => {
                if (a.id !== audioId) a.pause();
            });
            audio.play();
        } else {
            audio.pause();
        }
    }
}

// Smooth animation for elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.5s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .tour-step, .figure-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Đã sao chép!');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-brown);
        color: var(--cream);
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations if not already in stylesheet
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}
