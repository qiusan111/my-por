// 更新和画粒子
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

// 开始动画
animate();

// 定时发射烟花
setInterval(createFirework, 1200);

// 监听窗口大小变化
window.addEventListener("resize", () => {
    resizeFireworksCanvas();
});

// 点击屏幕发射烟花
canvas.addEventListener('click', (e) => {
    const fw = new Firework();
    fw.x = e.clientX;
    fw.y = e.clientY;
    fw.targetY = e.clientY - 100;
    fw.explode();
});