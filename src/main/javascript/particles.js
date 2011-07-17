var context, ctx;
var particles = [];
var P = 20;
var mouseDown = false;
var c;
var mouseX = 0;
var mouseY = 0;
var intensity = 500;

function particle() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.dt = 0.05;
    this.size = 0;
    this.gradientNo = 1;
    this.init = function () {
        this.x = c.x; // Math.random() * canvas.width;
        this.y = c.y; // Math.random() * canvas.height;
        this.size = 3; //Math.random() * 8 + 1;
        this.vx = Math.srandom() * 20;
        this.vy = Math.srandom() * 20;
        this.gradientNo = Math.floor(Math.random() * 5 + 1);
    }
    this.draw = function () {

        var g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);

	/*
        switch (this.gradientNo) {
            case 1:
                g.addColorStop(0.0, 'rgba(246, 222, 16,1.0)');
                g.addColorStop(0.1, 'rgba(255,255,255,0.5)');
                g.addColorStop(0.2, 'rgba(246, 222, 16,1.0)');
                g.addColorStop(1.0, 'rgba(246, 222, 16,0)');
                break;
            case 2:
                g.addColorStop(0.0, 'rgba(255, 156, 0,1.0)');
                g.addColorStop(0.1, 'rgba(255,255,255,0.5)');
                g.addColorStop(0.2, 'rgba(255, 156, 0,1.0)');
                g.addColorStop(1.0, 'rgba(255, 156, 0,0)');
                break;
            case 3:
                g.addColorStop(0.0, 'rgba(246, 242, 141,1.0)');
                g.addColorStop(0.1, 'rgba(255,255,255,0.5)');
                g.addColorStop(0.2, 'rgba(246, 242, 141,1.0)');
                g.addColorStop(1.0, 'rgba(246, 242, 141,0)');
                break;
            case 4:
                g.addColorStop(0.0, 'rgba(249, 64, 0,1.0)');
                g.addColorStop(0.1, 'rgba(255,255,255,0.5)');
                g.addColorStop(0.2, 'rgba(249, 64, 0,1.0)');
                g.addColorStop(1.0, 'rgba(249, 64, 0,0)');
                break;
            case 5:
                g.addColorStop(0.0, 'rgba(249, 223, 0,1.0)');
                g.addColorStop(0.1, 'rgba(255,255,255,0.5)');
                g.addColorStop(0.2, 'rgba(249, 223, 0,1.0)');
                g.addColorStop(1.0, 'rgba(249, 223, 0,0)');
                break;
        }*/

	g.addColorStop(0.1, 'rgba(255,255,255,0.2)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = g;
        ctx.fill();

    }
    this.update = function () {

        if (mouseDown) {
            intensity += 200;
        }
        else {
            intensity = 80;
        }

        var dx = (mouseX) - this.x + (Math.random() * 2 - 1) * intensity;
        var dy = (mouseY) - this.y + (Math.random() * 2 - 1) * intensity;
        var angle = Math.atan2(dy, dx);
        var ax = Math.cos(angle);
        var ay = Math.sin(angle);
        this.x += ax * 50 * this.dt;
        this.y += ay * 50 * this.dt;

        this.bound();
    }
    this.bound = function () {
        var r = this.size / 2;
        if (this.x < r) { this.x = r; this.vx *= -1; }
        if (this.y < r) { this.y = r; this.vy *= -1; }
        if (this.x > canvas.width - r) { this.x = canvas.width - r; this.vx *= -1; }
        if (this.y > canvas.height - r) { this.y = canvas.height - r; this.vy *= -1; }
    }
}

function addParticles(n) {
    for (var i = 0; i < n; i++) {
        var p = new particle();
        p.init();
        particles.push(p);
    }
}

Math.srandom = function () { return Math.random() * 2 - 1; }

function init() {
    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");

        document.addEventListener('mousemove', documentMouseMoveHandler, false);
        document.addEventListener('mousedown', documentMouseDownHandler, false);
        document.addEventListener('mouseup', documentMouseUpHandler, false);
        window.addEventListener('resize', windowResizeHandler, false);

        windowResizeHandler();
        
        c = new point(canvas.width / 2, canvas.height / 2);

        mouseX = c.x;
        mouseY = c.y;

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        addParticles(P);

    }
}

function documentMouseMoveHandler(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function documentMouseDownHandler(e) {
    mouseDown = true;
}

function documentMouseUpHandler(e) {
    mouseDown = false;
}

function windowResizeHandler() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loop() {

    ctx.fillStyle = "rgba(76,76,78,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
}

function loopDelegate() { loop(); }
var timer = setInterval(loopDelegate, 1000 / 60);

function point(x, y) {
    this.x = x;
    this.y = y;
}

init();
