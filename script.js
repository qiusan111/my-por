const emojis = ["🎈", "🎉", "🎊", "🎈", "🎉","💗"];
for (let i = 0; i < 30; i++) {
  const span = document.createElement("span");
  span.className = "float";
  span.style.left = Math.random() * 100 + "vw";
  span.style.animationDuration = 4 + Math.random() * 6 + "s";
  span.style.fontSize = 20 + Math.random() * 30 + "px";
  span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  document.body.appendChild(span);
}

// 打字效果
const message = "哦！又年长一岁了，要少点烦恼 ( ๑˘︶˘๑ )🌈\n天天快乐，开心 (≧∇≦)/✌️🎈🎉 ";
const textDiv = document.getElementById("typing-text");
let i = 0;
function type() {
  if (i < message.length) {
    textDiv.textContent += message.charAt(i);
    i++;
    setTimeout(type, 80);
  }
}
type();

// 星空动画
const starsCanvas = document.getElementById("stars");
const starsCtx = starsCanvas.getContext("2d");
function resizeStarsCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
resizeStarsCanvas();

const stars = Array.from({length: 100}, () => ({
  x: Math.random() * starsCanvas.width,
  y: Math.random() * starsCanvas.height,
  r: Math.random() * 1.5 + 0.5,
  alpha: Math.random(),
  delta: Math.random() * 0.02 + 0.005
}));

function animateStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach(s => {
    s.alpha += s.delta;
    if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
    starsCtx.globalAlpha = s.alpha;
    starsCtx.beginPath();
    starsCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starsCtx.fillStyle = "white";
    starsCtx.fill();
  });
  requestAnimationFrame(animateStars);
}
animateStars();
window.addEventListener("resize", resizeStarsCanvas);

// 烟花动画
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
function resizeFireworksCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeFireworksCanvas();

class Firework {
  constructor(x, y, tx, ty, color) {
    this.x = x;
    this.y = y;
    this.tx = tx;
    this.ty = ty;
    this.color = color;
    this.speed = 5;
    this.angle = Math.atan2(ty - y, tx - x);
    this.distance = Math.hypot(tx - x, ty - y);
    this.traveled = 0;
    this.exploded = false;
  }
  update() {
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    this.traveled += Math.hypot(vx, vy);
    if (this.traveled >= this.distance && !this.exploded) {
      this.exploded = true;
      explode(this.tx, this.ty, this.color);
      if (explosionSound) explosionSound.cloneNode(true).play();
    }
  }
  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, angle, speed, color) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.radius = 2 + Math.random() * 2;
    this.life = 1;
    this.fade = 0.015 + Math.random() * 0.01;
    this.color = color;
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + 0.3;
    this.speed *= 0.98;
    this.life -= this.fade;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }
}

const fireworks = [];
const particles = [];

const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];

function initialRainbowExplosion() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const countPerColor = 15;
  rainbowColors.forEach(color => {
    for (let i = 0; i < countPerColor; i++) {
            const angle = (Math.random() * 2 * Math.PI);
      const speed = 3 + Math.random() * 3;
      particles.push(new Particle(centerX, centerY, angle, speed, color));
    }
  });
}
initialRainbowExplosion();

function createFirework() {
  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  const y = canvas.height;
  const tx = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  const ty = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
  const colors = ["#FFD700", "#FF69B4", "#87CEFA", "#ADFF2F", "#FFA07A"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  fireworks.push(new Firework(x, y, tx, ty, color));
}

function explode(x, y, color) {
  const count = 30;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push(new Particle(x, y, angle, speed, color));
  }
}

// 背景爆炸声音
const explosionSound = new Audio("https://freesound.org/data/previews/235/235968_3985975-lq.mp3");

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新并绘制烟花
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].exploded) {
      fireworks.splice(i, 1);
    }
  }

  // 更新并绘制粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    if (p.life <= 0) {
      particles.splice(i, 1);
    } else {
      p.draw();
    }
  }

  requestAnimationFrame(animate);
}
animate();

// 定时发射烟花
setInterval(createFirework, 1200);

// 窗口调整时重置画布大小
window.addEventListener("resize", () => {
  resizeFireworksCanvas();
});

