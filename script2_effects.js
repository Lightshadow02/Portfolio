/* ============================================
   Cyber Hex Grid Background
   ============================================ */
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

const isMobile = window.innerWidth <= 768;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Hex settings
const HEX_RADIUS = isMobile ? 28 : 22;
const HEX_GAP = 2;
const PULSE_CHANCE = 0.0008; // chance per frame a hex wakes up

// Hex colors pool
const COLORS = [
    { r: 0,   g: 243, b: 255 }, // cyan
    { r: 57,  g: 255, b: 20  }, // green
    { r: 191, g: 90,  b: 242 }, // purple (rare)
];

// Pointy-top hex geometry
const R = HEX_RADIUS;
const W = Math.sqrt(3) * R;        // hex width
const H = 2 * R;                   // hex height
const COL_STEP = W + HEX_GAP;
const ROW_STEP = H * 0.75 + HEX_GAP;

// Build hex grid
let hexes = [];

function buildGrid() {
    hexes = [];
    const cols = Math.ceil(canvas.width  / COL_STEP) + 2;
    const rows = Math.ceil(canvas.height / ROW_STEP) + 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const offset = (row % 2 === 0) ? 0 : COL_STEP / 2;
            const x = col * COL_STEP + offset;
            const y = row * ROW_STEP;
            hexes.push({
                x, y,
                alpha: 0,
                targetAlpha: 0,
                color: COLORS[0],
                state: 'idle', // idle | rising | holding | falling
                holdTimer: 0,
            });
        }
    }
}

buildGrid();

// Draw a single pointy-top hexagon
function drawHex(x, y, radius) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

let lastFrameTime = 0;
const frameInterval = isMobile ? 50 : 30;

function render(currentTime) {
    requestAnimationFrame(render);

    if (currentTime - lastFrameTime < frameInterval) return;
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const hex of hexes) {

        // State machine
        if (hex.state === 'idle') {
            // Random chance to activate
            if (Math.random() < PULSE_CHANCE) {
                const colorIndex = Math.random() < 0.05 ? 2 : (Math.random() < 0.5 ? 0 : 1);
                hex.color = COLORS[colorIndex];
                hex.targetAlpha = 0.55 + Math.random() * 0.35;
                hex.state = 'rising';
            }
        } else if (hex.state === 'rising') {
            hex.alpha += 0.04;
            if (hex.alpha >= hex.targetAlpha) {
                hex.alpha = hex.targetAlpha;
                hex.holdTimer = Math.floor(Math.random() * 30) + 10;
                hex.state = 'holding';
            }
        } else if (hex.state === 'holding') {
            hex.holdTimer--;
            if (hex.holdTimer <= 0) {
                hex.state = 'falling';
            }
        } else if (hex.state === 'falling') {
            hex.alpha -= 0.025;
            if (hex.alpha <= 0) {
                hex.alpha = 0;
                hex.state = 'idle';
            }
        }

        if (hex.alpha <= 0.005) continue;

        const { r, g, b } = hex.color;
        const innerR = R - HEX_GAP;

        // Fill
        drawHex(hex.x, hex.y, innerR);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${hex.alpha * 0.12})`;
        ctx.fill();

        // Border
        drawHex(hex.x, hex.y, innerR);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${hex.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Glow for bright hexes
        if (hex.alpha > 0.4) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
            drawHex(hex.x, hex.y, innerR);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${hex.alpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
}

// Resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        buildGrid();
    }, 250);
});

requestAnimationFrame(render);


/* ============================================
   Typing Effect for "Hugo LOUREIRO"
   ============================================ */
class TypeWriter {
    constructor(el, text, speed = 100) {
        this.el = el;
        this.text = text;
        this.speed = speed;
        this.charIndex = 0;
    }

    type() {
        const currentText = this.text.substring(0, this.charIndex);

        let html = '';
        for (let i = 0; i < currentText.length; i++) {
            const char = currentText[i];
            const displayChar = char === ' ' ? '&nbsp;' : char;
            if (i >= currentText.length - 3) {
                html += `<span class="typed-char glow">${displayChar}</span>`;
            } else {
                html += `<span class="typed-char">${displayChar}</span>`;
            }
        }
        html += '<span class="typing-cursor">|</span>';
        this.el.innerHTML = html;

        if (this.charIndex < this.text.length) {
            this.charIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
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
        setTimeout(() => this.type(), 800);
    }
}

class NeonReveal {
    constructor(el, text, speed = 50) {
        this.el = el;
        this.text = text;
        this.speed = speed;
        this.charIndex = 0;
    }

    reveal() {
        if (this.charIndex === 0) {
            let html = '';
            for (let char of this.text) {
                html += `<span class="neon-char hidden">${char}</span>`;
            }
            this.el.innerHTML = html;
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

document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.hero-title');
    if (title) {
        const typewriter = new TypeWriter(title, 'Hugo LOUREIRO', 80);
        typewriter.start();
    }
});
