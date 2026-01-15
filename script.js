// Sounds
const clickSound = new Audio('click.mp3');
const winSound = new Audio('win.mp3');
const loseSound = new Audio('lose.mp3');
const drawSound = new Audio('draw.mp3');

// Unlock audio on first user interaction (important for mobile)
document.body.addEventListener('click', () => {
    clickSound.play().catch(() => {});
}, { once: true });

// Game State
let userScore = 0;
let compScore = 0;
const choices = ['rock', 'paper', 'scissors'];

// DOM Elements
const userScoreEl = document.getElementById('user-score');
const compScoreEl = document.getElementById('comp-score');
const userDisp = document.getElementById('user-choice-disp');
const compDisp = document.getElementById('comp-choice-disp');
const resultText = document.getElementById('result-text');
const container = document.querySelector('.game-container');

// Icons mapping
const icons = {
    rock: 'ph-hand-fist',
    paper: 'ph-hand',
    scissors: 'ph-scissors',
};

function play(userChoice) {
    // Reset UI state
    resultText.classList.remove('show', 'win-text', 'lose-text', 'draw-text');
    resultText.innerText = "...";
    clickSound.currentTime = 0;
clickSound.play();
    
    // Disable buttons briefly
    const btns = document.querySelectorAll('.btn');
    btns.forEach(b => b.style.pointerEvents = 'none');

    // 1. Show User Choice Immediately
    updateDisplay(userDisp, userChoice);

    // 2. Computer "Thinking" Animation
    let shuffleInterval = setInterval(() => {
        const random = choices[Math.floor(Math.random() * 3)];
        updateDisplay(compDisp, random);
    }, 100);

    // 3. Reveal Result after 800ms
    setTimeout(() => {
        clearInterval(shuffleInterval);
        
        const compChoice = choices[Math.floor(Math.random() * 3)];
        updateDisplay(compDisp, compChoice);
        compDisp.classList.add('pop');

        determineWinner(userChoice, compChoice);
        
        // Re-enable buttons
        setTimeout(() => btns.forEach(b => b.style.pointerEvents = 'auto'), 500);
    }, 800);
}

function updateDisplay(element, choice) {
    element.innerHTML = `<i class="ph ${icons[choice]}"></i>`;
    element.style.borderColor = 'var(--glass-border)';
    element.style.boxShadow = 'none';
    
    // Add specific colors based on choice
    if(choice === 'rock') element.style.color = '#fff';
    if(choice === 'paper') element.style.color = 'var(--neon-blue)';
    if(choice === 'scissors') element.style.color = 'var(--neon-pink)';
}

function determineWinner(u, c) {
    let result = '';
    let type = '';

    if (u === c) {
        result = "It's a Draw!";
        type = 'draw-text';
        drawSound.play();
    } 
    else if (
        (u === 'rock' && c === 'scissors') ||
        (u === 'paper' && c === 'rock') ||
        (u === 'scissors' && c === 'paper')
    ) {
        result = "You Win!";
        type = 'win-text';
        userScore++;
        userScoreEl.innerText = userScore;
        winSound.play();
        triggerConfetti();
    } 
    else {
        result = "You Lose!";
        type = 'lose-text';
        compScore++;
        compScoreEl.innerText = compScore;
        loseSound.play();
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
    }

    setTimeout(() => {
        resultText.innerText = result;
        resultText.classList.add('show', type);
    }, 200);
}

// --- CONFETTI ENGINE ---
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function triggerConfetti() {
    for(let i=0; i<100; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1) * 15,
            life: 100,
            color: `hsl(${Math.random()*360}, 100%, 50%)`,
            size: Math.random() * 5 + 2
        });
    }
    animateConfetti();
}

function animateConfetti() {
    if(particles.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.life--;
        p.size *= 0.96;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if(p.life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateConfetti);
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
