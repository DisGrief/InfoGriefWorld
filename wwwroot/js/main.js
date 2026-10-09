// ============ PARTICLES CANVAS ============
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouseTrail = [];

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
            '34, 211, 238',
            '167, 139, 250',
            '52, 211, 153',
            '234, 179, 8',
            '26, 26, 46'
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

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = mouseTrail.length - 1; i >= 0; i--) {
        const p = mouseTrail[i];
        p.life -= 0.045;
        if (p.life <= 0) {
            mouseTrail.splice(i, 1);
            continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9 * p.life + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.life * 0.14})`;
        ctx.fill();
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
        { bg: 'rgba(34, 211, 238, 0.12)', border: 'rgba(34, 211, 238, 0.2)' },
        { bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.2)' },
        { bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.2)' },
        { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.15)' },
        { bg: 'rgba(26, 26, 46, 0.06)', border: 'rgba(26, 26, 46, 0.1)' }
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
            border-radius: 3px;
            backdrop-filter: blur(2px);
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

// ============ MOUSE GLOW ============
document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (mouseTrail.length > 30) mouseTrail.shift();
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
