document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        htmlElement.setAttribute('data-theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = 'dark';

        if (currentTheme === 'dark') {
            newTheme = 'light';
        }

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });

    // CANVAS PARTICLES ENGINE
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const numberOfParticles = 65;

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class DataNode {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() * 0.4) - 0.2;
            this.speedY = (Math.random() * 0.4) - 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw(color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initMatrix() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new DataNode());
        }
    }
    initMatrix();

    function connectNodes(colorCode) {
        let maxDistance = 145;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    let opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(${colorCode}, ${opacity * 0.12})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function renderPipelineLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isLightMode = htmlElement.getAttribute('data-theme') === 'light';
        const nodeColor = isLightMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(168, 85, 247, 0.2)';
        const lineRGB = isLightMode ? '148, 163, 184' : '168, 85, 247';

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw(nodeColor);
        }
        
        connectNodes(lineRGB);
        requestAnimationFrame(renderPipelineLoop);
    }
    renderPipelineLoop();
});