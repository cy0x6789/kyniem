const START_DATE = new Date("2017-11-10");
// const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initGallery();
    initVideo();
    initTimeline();
    initCountdown();
    initHeartParticles();
    initScrollButton();
    initFloatingHearts();
});

function initScrollButton() {
    const scrollBtn = document.getElementById('scrollBtn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function() {
            document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;

    const heartSVG = `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartSVG;
        
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.4 + 0.2;
        const swayAmount = Math.random() * 60 - 30;
        
        heart.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        heart.querySelector('svg').style.opacity = opacity;
        
        const swayKeyframes = `
            @keyframes sway${Date.now()} {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(${swayAmount}px); }
            }
        `;
        
        container.appendChild(heart);
        
        heart.addEventListener('animationend', () => {
            heart.remove();
            createHeart();
        });
    }

    const numHearts = window.innerWidth < 768 ? 8 : 15;
    for (let i = 0; i < numHearts; i++) {
        setTimeout(() => createHeart(), i * 800);
    }
}

function initNavigation() {
    const sections = ['hero', 'gallery', 'video', 'timeline', 'story', 'countdown', 'footer'];
    const navDots = document.querySelectorAll('.nav-dot');

    navDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navDots.forEach(dot => dot.classList.remove('active'));
                const activeDot = document.querySelector(`[data-section="${entry.target.id}"]`);
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

function initGallery() {
    const images = document.querySelectorAll('.gallery-image');
    const dotsContainer = document.getElementById('galleryDots');
    const container = document.getElementById('galleryContainer');
    
    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval;

    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `gallery-dot${index === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.gallery-dot');

    function updateSlide(newIndex) {
        if (isTransitioning || newIndex === currentIndex) return;
        isTransitioning = true;

        images[currentIndex].classList.remove('active');
        images[currentIndex].classList.add('previous');
        dots[currentIndex].classList.remove('active');

        currentIndex = newIndex;

        images[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        setTimeout(() => {
            images.forEach((img, i) => {
                if (i !== currentIndex) img.classList.remove('previous');
            });
            isTransitioning = false;
        }, 500);
    }

    function goToSlide(index) {
        updateSlide(index);
    }

    function nextSlide() {
        updateSlide((currentIndex + 1) % images.length);
    }

    function prevSlide() {
        updateSlide((currentIndex - 1 + images.length) % images.length);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 10000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    let touchStartX = 0;
    let touchStartY = 0;
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) nextSlide();
            else prevSlide();
            resetAutoSlide();
        }
    }, { passive: true });
}

function initVideo() {
    const playBtn = document.getElementById('playBtn');
    const videoOverlay = document.getElementById('videoOverlay');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoIframe = document.getElementById('videoIframe');

    playBtn.addEventListener('click', function() {
        videoOverlay.style.display = 'none';
        videoThumbnail.style.display = 'none';
        videoIframe.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`;
        videoIframe.classList.remove('hidden');
    });
}

function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-index'));
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });

    items.forEach(item => observer.observe(item));
}

function initCountdown() {
    function updateCountdown() {
        const now = new Date();
        const diff = now.getTime() - START_DATE.getTime();

        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        document.getElementById('days').textContent = totalDays.toLocaleString();
        document.getElementById('hours').textContent = totalHours % 24;
        document.getElementById('minutes').textContent = totalMinutes % 60;
        document.getElementById('seconds').textContent = totalSeconds % 60;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initHeartParticles() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const settings = {
        particles: {
            length: 500,
            duration: 3,
            velocity: 100,
            effect: -0.75,
            size: 13,
        },
    };

    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        clone() {
            return new Point(this.x, this.y);
        }

        length(length) {
            if (typeof length === 'undefined') {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
            this.normalize();
            this.x *= length;
            this.y *= length;
            return this;
        }

        normalize() {
            const len = this.length();
            this.x /= len;
            this.y /= len;
            return this;
        }
    }

    class Particle {
        constructor() {
            this.position = new Point();
            this.velocity = new Point();
            this.acceleration = new Point();
            this.age = 0;
        }

        initialize(x, y, dx, dy) {
            this.position.x = x;
            this.position.y = y;
            this.velocity.x = dx;
            this.velocity.y = dy;
            this.acceleration.x = dx * settings.particles.effect;
            this.acceleration.y = dy * settings.particles.effect;
            this.age = 0;
        }

        update(deltaTime) {
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;
            this.velocity.x += this.acceleration.x * deltaTime;
            this.velocity.y += this.acceleration.y * deltaTime;
            this.age += deltaTime;
        }

        draw(context, image) {
            function ease(t) {
                return --t * t * t + 1;
            }
            const size = image.width * ease(this.age / settings.particles.duration);
            context.globalAlpha = 1 - this.age / settings.particles.duration;
            context.drawImage(
                image,
                this.position.x - size / 2,
                this.position.y - size / 2,
                size,
                size
            );
        }
    }

    class ParticlePool {
        constructor(length) {
            this.particles = new Array(length);
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i] = new Particle();
            }
            this.firstActive = 0;
            this.firstFree = 0;
            this.duration = settings.particles.duration;
        }

        add(x, y, dx, dy) {
            this.particles[this.firstFree].initialize(x, y, dx, dy);
            this.firstFree++;
            if (this.firstFree === this.particles.length) this.firstFree = 0;
            if (this.firstActive === this.firstFree) this.firstActive++;
            if (this.firstActive === this.particles.length) this.firstActive = 0;
        }

        update(deltaTime) {
            if (this.firstActive < this.firstFree) {
                for (let i = this.firstActive; i < this.firstFree; i++) {
                    this.particles[i].update(deltaTime);
                }
            }
            if (this.firstFree < this.firstActive) {
                for (let i = this.firstActive; i < this.particles.length; i++) {
                    this.particles[i].update(deltaTime);
                }
                for (let i = 0; i < this.firstFree; i++) {
                    this.particles[i].update(deltaTime);
                }
            }

            while (
                this.particles[this.firstActive].age >= this.duration &&
                this.firstActive !== this.firstFree
            ) {
                this.firstActive++;
                if (this.firstActive === this.particles.length) this.firstActive = 0;
            }
        }

        draw(context, image) {
            if (this.firstActive < this.firstFree) {
                for (let i = this.firstActive; i < this.firstFree; i++) {
                    this.particles[i].draw(context, image);
                }
            }
            if (this.firstFree < this.firstActive) {
                for (let i = this.firstActive; i < this.particles.length; i++) {
                    this.particles[i].draw(context, image);
                }
                for (let i = 0; i < this.firstFree; i++) {
                    this.particles[i].draw(context, image);
                }
            }
        }
    }

    function pointOnHeart(t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) -
                50 * Math.cos(2 * t) -
                20 * Math.cos(3 * t) -
                10 * Math.cos(4 * t) +
                25
        );
    }

    function createHeartImage() {
        const heartCanvas = document.createElement('canvas');
        const heartCtx = heartCanvas.getContext('2d');
        heartCanvas.width = settings.particles.size;
        heartCanvas.height = settings.particles.size;

        function to(t) {
            const point = pointOnHeart(t);
            point.x = settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
            point.y = settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
            return point;
        }

        heartCtx.beginPath();
        let t = -Math.PI;
        let point = to(t);
        heartCtx.moveTo(point.x, point.y);
        while (t < Math.PI) {
            t += 0.01;
            point = to(t);
            heartCtx.lineTo(point.x, point.y);
        }
        heartCtx.closePath();
        heartCtx.fillStyle = '#FF5CA4';
        heartCtx.fill();

        const image = new Image();
        image.src = heartCanvas.toDataURL();
        return image;
    }

    const particles = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration;
    const image = createHeartImage();
    let time;

    function onResize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    function render() {
        requestAnimationFrame(render);

        const newTime = new Date().getTime() / 1000;
        const deltaTime = newTime - (time || newTime);
        time = newTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const amount = particleRate * deltaTime;
        for (let i = 0; i < amount; i++) {
            const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            const dir = pos.clone().length(settings.particles.velocity);
            particles.add(
                canvas.width / 2 + pos.x,
                canvas.height / 2 - pos.y,
                dir.x,
                -dir.y
            );
        }

        particles.update(deltaTime);
        particles.draw(ctx, image);
    }

    onResize();
    window.addEventListener('resize', onResize);

    setTimeout(() => {
        render();
    }, 10);
}
