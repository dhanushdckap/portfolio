	

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = (canvas.width = window.innerWidth);
var h = (canvas.height = window.innerHeight);

window.onresize = function () {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
};

var particles = [];
var maxParticles = 100;
var radius = 5;
var lastCollision = 0;
var repelForce = -5; // Adjust the repel force as needed
var repelRadius = 1000; // Adjust the repel radius as needed
var repelDecayFactor = 0.98; // Adjust the decay factor for smoother slowdown

var suctionForce = 5; // Adjust the suction force as needed
var suctionRadius = 1000; // Adjust the suction radius as needed
var suctionDecayFactor = 0.98; // Adjust the decay factor for smoother slowdown
var isLeftMouseDown = false;
var isRightMouseDown = false;

function handleLeftMouseClick(event) {
  isLeftMouseDown = true;
  handleMouseEffect(event, "repel");
}

function handleRightMouseClick(event) {
  isRightMouseDown = true;
  handleMouseEffect(event, "suction");
}

function handleMouseEffect(event, effectType) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  updateParticles(mouseX, mouseY, effectType);
}

function updateParticles(mouseX, mouseY, effectType) {
  for (var i = 0; i < particles.length; i++) {
    var dx = mouseX - particles[i].x;
    var dy = mouseY - particles[i].y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var effectForce = 10;
    var decayFactor = 0;

    if (effectType === "repel") {
      effectForce = repelForce;
      decayFactor = repelDecayFactor;
    } else if (effectType === "suction") {
      effectForce = suctionForce;
      decayFactor = suctionDecayFactor;
    }

    if (distance < repelRadius) {
      var angle = Math.atan2(dy, dx);
      particles[i].xv += Math.cos(angle) * effectForce;
      particles[i].yv += Math.sin(angle) * effectForce;
    }
  }

  if (isLeftMouseDown || isRightMouseDown) {
    requestAnimationFrame(updateParticles);
  }
}

canvas.addEventListener("contextmenu", function (event) {
  event.preventDefault(); // Prevent the default context menu on right-click
});

canvas.addEventListener("mousedown", function (event) {
  if (event.button === 0) {
    // Left mouse click
    handleLeftMouseClick(event);
  } else if (event.button === 2) {
    // Right mouse click
    handleRightMouseClick(event);
  }
});

canvas.addEventListener("mouseup", function (event) {
  if (event.button === 0) {
    // Left mouse button released
    isLeftMouseDown = false;
  } else if (event.button === 2) {
    // Right mouse button released
    isRightMouseDown = false;
  }
});
function createParticle() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    xv: Math.random() * 2 - 1,
    yv: Math.random() * 2 - 1
  };
}

function createParticles() {
  for (var i = 0; i < maxParticles; i++) {
    particles.push(createParticle());
  }
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < particles.length; i++) {
    ctx.beginPath();

    // Create the main particle gradient
    var gradient = ctx.createRadialGradient(
      particles[i].x, particles[i].y, 0,
      particles[i].x, particles[i].y, radius
    );
    gradient.addColorStop(0, "hsla(" + ((particles[i].x + 180) % 360) + ", 25%, 25%, 1)");
    gradient.addColorStop(1, "hsla(" + (particles[i].x % 360) + ", 50%, 50%, 1)");

    // Create the glow gradient
    var glowGradient = ctx.createRadialGradient(
      particles[i].x, particles[i].y, radius,
      particles[i].x, particles[i].y, radius + 15 // Adjust the glow radius as needed
    );
    glowGradient.addColorStop(0, "hsla(" + ((particles[i].x + 180) % 360) + ", 25%, 25%, 0.2)"); // Adjust the glow opacity as needed
    glowGradient.addColorStop(1, "hsla(" + (particles[i].x % 360) + ", 50%, 50%, 0)");

    // Combine the main particle gradient and the glow gradient
    ctx.fillStyle = gradient;
    ctx.arc(particles[i].x, particles[i].y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = glowGradient;
    ctx.arc(particles[i].x, particles[i].y, radius + 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function move() {
  var maxSpeed = 3;
  for (var i = 0; i < particles.length; i++) {
    particles[i].x += particles[i].xv;
    particles[i].y += particles[i].yv;
    particles[i].xv = Math.min(Math.max(particles[i].xv, -maxSpeed), maxSpeed);
    particles[i].yv = Math.min(Math.max(particles[i].yv, -maxSpeed), maxSpeed);

  }
}

function connect() {
  for (var i = 0; i < maxParticles - 1; i++) {
    var p1 = particles[i];
    for (var j = i + 1; j < maxParticles; j++) {
      var p2 = particles[j];
      var currentDist = dist(p1.x, p2.x, p1.y, p2.y);

      if (currentDist <= 80) {
        var proDist = 100 / 80;
        var opacity = 1 - (currentDist * proDist) / 500;
        var force = (p1.x - p2.x) * (1 / currentDist) ** 2;
        var momentum = (p1.x + p2.x) / 2;

        p1.x += force * -0.0001 - momentum * 0.0001;
        p2.x -= force * -0.0001 + momentum * -0.0001;

        p1.x = Math.min(Math.max(p1.x, 0), canvas.width);
        p2.x = Math.min(Math.max(p2.x, 0), canvas.width);

        if (p1.x < 10 && p2.x > 10) {
          p1.xv = -p1.xv;
          p2.xv = -p2.xv;
        } else if (p1.x > w - 10 && p2.x < w - 10) {
          p1.xv = -p1.xv;
          p2.xv = -p2.xv;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.strokeStyle = `hsla(${
        particles[i].x % 360
      }, 50%, 50%,    ${opacity})`;
        ctx.lineWidth = 1;
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function collision() {
  for (var i = 0; i < particles.length; i++) {
    var p1 = particles[i];
    if (p1.x < radius || p1.x + radius > w) {
      p1.xv = -p1.xv;
    }
    if (p1.y - radius < 0 || p1.y + radius > h) {
      p1.yv = -p1.yv;
    }

    for (var j = i + 1; j < particles.length; j++) {
      var p2 = particles[j];
      var distance = dist(p1.x, p2.x, p1.y, p2.y);

      if (distance < radius + radius) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var angle = Math.atan2(dy, dx);
        var sine = Math.sin(angle);
        var cosine = Math.cos(angle);

        // Rotate velocities
        var vx1 = p1.xv * cosine + p1.yv * sine;
        var vy1 = p1.yv * cosine - p1.xv * sine;
        var vx2 = p2.xv * cosine + p2.yv * sine;
        var vy2 = p2.yv * cosine - p2.xv * sine;

        // Perform collision response
        var vCollisionX = vx1 - vx2;
        var vCollisionY = vy1 - vy2;
        var distanceX = p2.x - p1.x;
        var distanceY = p2.y - p1.y;

        if (vCollisionX * distanceX + vCollisionY * distanceY >= 0) {
          var collisionAngle = -Math.atan2(distanceY, distanceX);
          var mass1 = radius * radius;
          var mass2 = radius * radius;

          // Rotate velocities back
          var rotatedVelocities1 = {
            x: vx1 * Math.cos(collisionAngle) - vy1 * Math.sin(collisionAngle),
            y: vx1 * Math.sin(collisionAngle) + vy1 * Math.cos(collisionAngle)
          };
          var rotatedVelocities2 = {
            x: vx2 * Math.cos(collisionAngle) - vy2 * Math.sin(collisionAngle),
            y: vx2 * Math.sin(collisionAngle) + vy2 * Math.cos(collisionAngle)
          };

          // Final velocities after collision
          var finalVelocities1 = {
            x: rotatedVelocities1.x * (mass1 - mass2) / (mass1 + mass2) + rotatedVelocities2.x * 2 * mass2 / (mass1 + mass2),
            y: rotatedVelocities1.y
          };
          var finalVelocities2 = {
            x: rotatedVelocities2.x * (mass2 - mass1) / (mass1 + mass2) + rotatedVelocities1.x * 2 * mass1 / (mass1 + mass2),
            y: rotatedVelocities2.y
          };

          // Rotate the velocities to the original axis
          var vFinal1 = {
            x: finalVelocities1.x * Math.cos(collisionAngle) - finalVelocities1.y * Math.sin(collisionAngle),
            y: finalVelocities1.x * Math.sin(collisionAngle) + finalVelocities1.y * Math.cos(collisionAngle)
          };
          var vFinal2 = {
            x: finalVelocities2.x * Math.cos(collisionAngle) - finalVelocities2.y * Math.sin(collisionAngle),
            y: finalVelocities2.x * Math.sin(collisionAngle) + finalVelocities2.y * Math.cos(collisionAngle)
          };

          // Update velocities
          p1.xv = vFinal1.x;
          p1.yv = vFinal1.y;
          p2.xv = vFinal2.x;
          p2.yv = vFinal2.y;
        }
      }
    }
  }
}


function dist(x1, x2, y1, y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}

createParticles();
function render() {
  move();
  draw();
  collision();
  connect();
  requestAnimationFrame(render);
}
render();

//my carry starts scroll animation

let button  = document.querySelector("#scroll");
let container = document.querySelector("#demo");
button.addEventListener("click",()=>{
    const containerOffset = container.offsetTop;
    window.scrollTo(0, containerOffset);
})

let Skill_set = document.querySelector("#Skill_set");
let skills_display = document.querySelector(".skills");
Skill_set.addEventListener("click",()=>{
    const containerOffset = skills_display.offsetTop;
    window.scrollTo(0, containerOffset);
})


/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

const speedWheel = 0.02
const speedDrag = -0.1

const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i/$items.length) * 100 + 10
    animate()
  })
})

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

document.addEventListener('mousemove', handleMouseMove);

