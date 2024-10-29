const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const balls = [];
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.dx = -this.dx;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}
function init() {
  for (let i = 0; i < 20; i++) {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    balls.push(new Ball(x, y, radius, color));
  }
}
function checkCollision(ballA, ballB) {
  const dx = ballA.x - ballB.x;
  const dy = ballA.y - ballB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < ballA.radius + ballB.radius) {
    const tempColor = ballA.color;
    ballA.color = ballB.color;
    ballB.color = tempColor;
    // 创建光效
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(ballA.x, ballA.y, ballA.radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';
  }
}

class DemonicCircle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = 0;
    this.dy = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // 限制恶魔圈在画布内
    if (this.x - this.radius < 0) {
      this.x = this.radius;
    }
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
    }
    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
    }

    this.draw();
  }
}

const demonCircle = new DemonicCircle(canvas.width / 2, canvas.height / 2, 50);

function checkCollision(ball, demonCircle) {
  const dx = ball.x - demonCircle.x;
  const dy = ball.y - demonCircle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < ball.radius + demonCircle.radius) {
    balls.splice(balls.indexOf(ball), 1);
  }
}

let score = 0;

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = '48px serif';
  ctx.fillStyle = 'black';
  ctx.fillText('弹跳吧！小彩球', 10, 50);

  ctx.font = '24px serif';
  ctx.fillStyle = 'white';
  ctx.fillText(`得分：${score}`, canvas.width / 2 - 50, 30);

  ctx.fillText(`剩余小球数量：${balls.length}`, canvas.width - 200, 30);

  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    for (let j = i + 1; j < balls.length; j++) {
      checkCollision(balls[i], balls[j]);
    }
  }

  demonCircle.update();
  for (let i = 0; i < balls.length; i++) {
    checkCollision(balls[i], demonCircle);
  }
}

function checkCollision(ball, demonCircle) {
  const dx = ball.x - demonCircle.x;
  const dy = ball.y - demonCircle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < ball.radius + demonCircle.radius) {
    balls.splice(balls.indexOf(ball), 1);
    score++;
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      demonCircle.dy = -5;
      break;
    case 'ArrowDown':
    case 's':
      demonCircle.dy = 5;
      break;
    case 'ArrowLeft':
    case 'a':
      demonCircle.dx = -5;
      break;
    case 'ArrowRight':
    case 'd':
      demonCircle.dx = 5;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'ArrowDown':
    case 's':
      demonCircle.dy = 0;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'ArrowRight':
    case 'd':
      demonCircle.dx = 0;
      break;
  }
});


init();
animate();
