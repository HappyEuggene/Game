const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 30, dx: 0 };
const lasers = [];
const asteroids = [];

let gameLoopId;
let isGameOver = false;

function drawShip() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function drawLasers() {
    ctx.fillStyle = 'red';
    lasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });
}

function drawAsteroids() {
    ctx.fillStyle = 'gray';
    asteroids.forEach(asteroid => {
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawLasers();
    drawAsteroids();

    if (Math.random() < 0.05) {
        const width = Math.random() * 30 + 20;
        asteroids.push({ x: Math.random() * (canvas.width - width), y: -30, width: width, height: 30 });
    }

    ship.x += ship.dx;

    lasers.forEach((laser, laserIndex) => {
        laser.y -= 5;
        if (laser.y + laser.height < 0) {
            lasers.splice(laserIndex, 1);
        }
    });

    asteroids.forEach((asteroid, asteroidIndex) => {
        asteroid.y += 2;
        if (asteroid.y > canvas.height) {
            asteroids.splice(asteroidIndex, 1);
        }

        // Check for collisions with the ship
        if (asteroid.y + asteroid.height > ship.y &&
            asteroid.x + asteroid.width > ship.x &&
            asteroid.x < ship.x + ship.width) {
            cancelAnimationFrame(gameLoopId);
            isGameOver = true;
            alert('Game Over!');
        }

        // Check for collisions with lasers
        lasers.forEach((laser, laserIndex) => {
            if (laser.y < asteroid.y + asteroid.height &&
                laser.x + laser.width > asteroid.x &&
                laser.x < asteroid.x + asteroid.width) {
                lasers.splice(laserIndex, 1);
                asteroids.splice(asteroidIndex, 1);
            }
        });
    });

    if (!isGameOver) {
        gameLoopId = requestAnimationFrame(update);
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        ship.dx = -5;
    } else if (event.key === 'ArrowRight') {
        ship.dx = 5;
    } else if (event.key === ' ') {
        lasers.push({ x: ship.x + ship.width / 2 - 2.5, y: ship.y, width: 5, height: 10 });
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        ship.dx = 0;
    }
});

update();
