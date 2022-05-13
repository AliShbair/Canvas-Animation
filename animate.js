const canvas = document.querySelector("#can");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
let hue = 0;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = {
  x: undefined,
  y: undefined,
};
// build 5 particles once mouse is moved, store x,y values
canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i < 5; i++) {
    particlesArray.push(new Particle());
  }
});

// create the main object Particle, which will be copied 5 times with each mouse move
class Particle {
  // random values
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }
  // always update values of next 4 particles
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // fade, vanish effect
    if (this.size > 0.3) this.size -= 0.1;
  }
  // draw circles according to values above
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
// handling stored particles (invoking)
function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    // nested for loop to compare all particles with each others
    // j = i to avoid repeating previous compared particles.
    for (let j = i; j < particlesArray.length; j++) {
      // pythagorean theory, to calculate distance between 2 particles
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // draw lines only between particles within a certain range
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = particlesArray[i].size / 10;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
    // remove the already shrinked particles
    if (particlesArray[i].size <= 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
}
// loop function
function animate() {
  // clear old unneeded particles
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  hue += 2;
  requestAnimationFrame(animate);
}
animate();

// leave tails behind particles
// ctx.fillStyle = 'rgba(0,0,0,0.02)'
// ctx.fillRect(0, 0, canvas.width, canvas.height)
