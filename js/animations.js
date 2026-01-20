const STAR_COUNT = 30;
const POP_DURATION_MS = 500;

export function createStars(containerId = 'stars') {
    const starsContainer = document.getElementById(containerId);
    if (!starsContainer) {
        return;
    }

    for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size = Math.random() * 20 + 10;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 3;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }
}

export function applyPopAnimation(...elements) {
    const targets = elements.filter(Boolean);
    if (!targets.length) {
        return;
    }

    targets.forEach(element => element.classList.add('pop-animation'));

    window.setTimeout(() => {
        targets.forEach(element => element.classList.remove('pop-animation'));
    }, POP_DURATION_MS);
}

