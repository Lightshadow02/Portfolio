
/* Matrix Rain Effect */
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

// Detect mobile for performance optimization
const isMobile = window.innerWidth <= 768;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

// Adjust font size and density based on device
const fontSize = isMobile ? 20 : 16; // Larger on mobile = less columns = better performance
const columns = Math.floor(canvas.width / fontSize);

const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

let lastFrameTime = 0;
const frameInterval = isMobile ? 50 : 30; // Mobile: 50ms (~20 FPS), Desktop: 30ms (~33 FPS)

const draw = (currentTime) => {
    // Request next frame
    requestAnimationFrame(draw);

    // Throttle to ~33 FPS
    if (currentTime - lastFrameTime < frameInterval) {
        return;
    }
    lastFrameTime = currentTime;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0'; // Green text
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

// Throttle resize for better performance
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalculate columns on resize
        const newColumns = Math.floor(canvas.width / fontSize);
        rainDrops.length = 0;
        for (let x = 0; x < newColumns; x++) {
            rainDrops[x] = 1;
        }
    }, 250); // Wait 250ms after resize stops
});

// Start animation with requestAnimationFrame
requestAnimationFrame(draw);


/* Typing Effect for "Hugo LOUREIRO" */
class TypeWriter {
    constructor(el, text, speed = 100) {
        this.el = el;
        this.text = text;
        this.speed = speed;
        this.charIndex = 0;
    }

    type() {
        const currentText = this.text.substring(0, this.charIndex);
        const remainingText = this.text.substring(this.charIndex);

        // Build HTML with typed text (with glow) and cursor
        let html = '';

        // Add each typed character with glow effect
        for (let i = 0; i < currentText.length; i++) {
            const char = currentText[i];
            // Replace space with non-breaking space for proper display
            const displayChar = char === ' ' ? '&nbsp;' : char;

            // Add glow to recent characters (last 3)
            if (i >= currentText.length - 3) {
                html += `<span class="typed-char glow">${displayChar}</span>`;
            } else {
                html += `<span class="typed-char">${displayChar}</span>`;
            }
        }

        // Add cursor
        html += '<span class="typing-cursor">|</span>';

        this.el.innerHTML = html;

        if (this.charIndex < this.text.length) {
            // Continue typing
            this.charIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            // Finished typing - add final glow to all text and blinking cursor
            let finalHtml = '';
            for (let char of this.text) {
                const displayChar = char === ' ' ? '&nbsp;' : char;
                finalHtml += `<span class="typed-char final-glow">${displayChar}</span>`;
            }
            finalHtml += '<span class="typing-cursor blink">|</span>';
            this.el.innerHTML = finalHtml;
        }
    }

    start() {
        // Start typing after a delay
        setTimeout(() => this.type(), 800);
    }
}

/* OPTION 2: NEON REVEAL Effect (Alternative) */
class NeonReveal {
    constructor(el, text, speed = 50) {
        this.el = el;
        this.text = text;
        this.speed = speed;
        this.charIndex = 0;
    }

    reveal() {
        if (this.charIndex === 0) {
            // Show all text but invisible first
            let html = '';
            for (let char of this.text) {
                html += `<span class="neon-char hidden">${char}</span>`;
            }
            this.el.innerHTML = html;

            // Start revealing
            setTimeout(() => this.revealNext(), 300);
        } else {
            this.revealNext();
        }
    }

    revealNext() {
        const chars = this.el.querySelectorAll('.neon-char');

        if (this.charIndex < chars.length) {
            chars[this.charIndex].classList.remove('hidden');
            chars[this.charIndex].classList.add('reveal');
            this.charIndex++;
            setTimeout(() => this.revealNext(), this.speed);
        } else {
            // All revealed, add final glow
            chars.forEach(char => {
                char.classList.remove('reveal');
                char.classList.add('final-reveal');
            });
        }
    }

    start() {
        setTimeout(() => this.reveal(), 800);
    }
}

// Initialize Effect on Load
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.hero-title');
    if (title) {
        // OPTION 1: TYPING EFFECT (Actif)
        const typewriter = new TypeWriter(title, 'Hugo LOUREIRO', 80);
        typewriter.start();

        // OPTION 2: NEON REVEAL (Désactivé)
        // const neonReveal = new NeonReveal(title, 'Hugo LOUREIRO', 40);
        // neonReveal.start();
    }
});
