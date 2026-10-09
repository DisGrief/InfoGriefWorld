// ============ PARTICLES CANVAS ============
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const leaves = [];

const LEAF_COLORS = ['#e2660f', '#c2410c', '#f0912c', '#f2b434', '#b45309', '#d97706', '#a8451c'];

function drawLeafShape(x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.85, -size * 0.45, size * 0.7, size * 0.6, 0, size);
    ctx.bezierCurveTo(-size * 0.7, size * 0.6, -size * 0.85, -size * 0.45, 0, -size);
    ctx.fill();
    ctx.strokeStyle = 'rgba(60, 30, 10, 0.35)';
    ctx.lineWidth = Math.max(0.6, size * 0.11);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.85);
    ctx.lineTo(0, size * 0.85);
    ctx.stroke();
    ctx.restore();
}

function spawnLeaf(x, y, opts = {}) {
    leaves.push({
        x,
        y,
        size: opts.size || 7 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.09,
        vx: (Math.random() - 0.5) * 0.6,
        vy: opts.vy || 0.45 + Math.random() * 0.7,
        sway: 0.6 + Math.random() * 1.4,
        swaySpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        alpha: opts.alpha != null ? opts.alpha : 0.85,
        fade: opts.fade || 0,
        t: 0
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            '226, 102, 15',
            '194, 65, 12',
            '242, 180, 52',
            '180, 83, 9',
            '217, 119, 6'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.008) * 0.15;
        this.opacity -= 0.0008;

        if (this.y < -20 || this.opacity <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 50; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
}

let leafFrame = 0;

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    leafFrame++;
    if (leafFrame % 34 === 0 && leaves.filter(l => l.fade === 0).length < 14) {
        spawnLeaf(Math.random() * canvas.width, -20, { vy: 0.35 + Math.random() * 0.5 });
    }

    for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.t++;
        l.phase += l.swaySpeed;
        l.x += l.vx + Math.sin(l.phase) * l.sway * 0.35;
        l.y += l.vy;
        l.rot += l.vr + Math.sin(l.phase) * 0.012;

        let alpha = l.alpha;
        if (l.fade > 0) {
            alpha = l.alpha * Math.max(0, 1 - l.t / l.fade);
            if (l.t >= l.fade) {
                leaves.splice(i, 1);
                continue;
            }
        }

        if (l.y > canvas.height + 40 || l.x < -60 || l.x > canvas.width + 60) {
            leaves.splice(i, 1);
            continue;
        }

        drawLeafShape(l.x, l.y, l.size, l.rot, l.color, alpha);
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ============ CLOUDS ============
function createClouds() {
    const layer = document.getElementById('clouds-layer');
    const cloudCount = 6;

    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';

        const w = 100 + Math.random() * 200;
        const h = 30 + Math.random() * 40;
        const x = Math.random() * window.innerWidth;
        const y = 30 + Math.random() * 250;
        const duration = 80 + Math.random() * 100;
        const delay = Math.random() * -80;
        const opacity = 0.02 + Math.random() * 0.06;

        cloud.style.cssText = `
            width: ${w}px;
            height: ${h}px;
            top: ${y}px;
            left: ${x}px;
            opacity: ${opacity};
            animation: cloudDrift ${duration}s linear ${delay}s infinite;
        `;

        layer.appendChild(cloud);
    }
}
createClouds();

// ============ FLOATING BLOCKS ============
function createFloatingBlocks() {
    const container = document.getElementById('floating-blocks');
    const blockColors = [
        { bg: 'rgba(226, 102, 15, 0.16)', border: 'rgba(226, 102, 15, 0.3)' },
        { bg: 'rgba(194, 65, 12, 0.14)', border: 'rgba(194, 65, 12, 0.28)' },
        { bg: 'rgba(242, 180, 52, 0.18)', border: 'rgba(242, 180, 52, 0.32)' },
        { bg: 'rgba(180, 83, 9, 0.14)', border: 'rgba(180, 83, 9, 0.26)' },
        { bg: 'rgba(120, 66, 20, 0.1)', border: 'rgba(120, 66, 20, 0.18)' }
    ];

    for (let i = 0; i < 12; i++) {
        const block = document.createElement('div');
        block.className = 'mine-block';

        const type = blockColors[Math.floor(Math.random() * blockColors.length)];
        const size = 10 + Math.floor(Math.random() * 20);
        const x = Math.random() * 100;
        const duration = 20 + Math.random() * 30;
        const delay = Math.random() * -20;

        block.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            background: ${type.bg};
            border: 1px solid ${type.border};
        `;

        container.appendChild(block);
    }
}
createFloatingBlocks();

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');

// ============ SCROLL PROGRESS + HERO PARALLAX ============
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

const heroContent = document.querySelector('.hero-content');
const scrollIndicator = document.querySelector('.scroll-indicator');
let scrollTicking = false;

function onScroll() {
    const y = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--scroll', String(docHeight > 0 ? (y / docHeight).toFixed(4) : 0));

    if (y > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    const vh = window.innerHeight;
    if (y < vh) {
        const progress = y / vh;
        heroContent.style.transform = `translateY(${y * 0.16}px)`;
        heroContent.style.opacity = String(Math.max(0, 1 - progress * 1.25));
        if (scrollIndicator) {
            scrollIndicator.style.opacity = String(Math.max(0, 1 - progress * 3));
        }
    }

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScroll);
    }
});
onScroll();

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.pageYOffset >= top) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============ SCROLL ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .rule-item, .join-step, .section-header').forEach(el => {
    observer.observe(el);
});

// ============ COUNTER ANIMATION ============
document.querySelectorAll('.stat-num[data-target]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if (Number.isNaN(target)) return;

    const duration = 2000;
    const step = target / (duration / 16);

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            let current = 0;
            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            update();
            counterObserver.disconnect();
        }
    }, { threshold: 0.5 });

    counterObserver.observe(counter);
});

// ============ COPY IP ============
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;
    navigator.clipboard.writeText(ip).then(showToast).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast();
    });
}

function showToast() {
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============ CURSOR LEAF TRAIL ============
let lastLeafAt = 0;

document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastLeafAt < 55) return;
    lastLeafAt = now;
    spawnLeaf(
        e.clientX + (Math.random() - 0.5) * 12,
        e.clientY + (Math.random() - 0.5) * 12,
        {
            size: 6 + Math.random() * 7,
            vy: 0.5 + Math.random() * 0.9,
            fade: 75,
            alpha: 0.9
        }
    );
});

// ============ REAL ONLINE ============
function animateNumber(el, to, duration = 900) {
    const from = parseInt(el.textContent) || 0;
    if (from === to) {
        el.textContent = String(to);
        return;
    }
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(from + (to - from) * eased));
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

async function fetchOnline() {
    try {
        const res = await fetch('https://api.mcsrvstat.us/3/mc.griefworlds.ru');
        const data = await res.json();
        if (data.online) {
            const online = data.players.online;
            const max = data.players.max;
            animateNumber(document.getElementById('online-count'), online);
            document.getElementById('badge-online').textContent = `Сервер онлайн — ${online} из ${max} игроков`;
            document.querySelector('.badge-dot').style.background = '#34d399';
            document.querySelector('.badge-dot').style.boxShadow = '0 0 10px rgba(52, 211, 153, 0.9)';
        } else {
            document.getElementById('online-count').textContent = '0';
            document.getElementById('badge-online').textContent = 'Сервер оффлайн';
            document.querySelector('.badge-dot').style.background = '#ef4444';
            document.querySelector('.badge-dot').style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.9)';
        }
    } catch {
        document.getElementById('online-count').textContent = '—';
        document.getElementById('badge-online').textContent = 'Статус недоступен';
    }
}
fetchOnline();
setInterval(fetchOnline, 60000);
