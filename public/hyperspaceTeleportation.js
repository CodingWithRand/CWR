let stars = [];
let startTime;
let speed = 0; // Initial speed

let teleportAcceleration = 25;
const maxValue = 25;
let alternateValue = 0.5;

const decreaseValue = () => {
    teleportAcceleration = min(teleportAcceleration - alternateValue, maxValue);
    alternateValue -= 0.005;
}

let isStopping = false;
let eventAdded = false;
let isCanvasShowing = false;
let canvas;

function showCanvas(canvas){
    isStopping = true;
    alternateValue = 0.5;
    teleportAcceleration = teleportAcceleration > 1 ? teleportAcceleration : 25;
    setTimeout(() => {
        canvas.style("opacity", isCanvasShowing ? "1" : "0");
        isCanvasShowing = !isCanvasShowing;
    }, 1250);
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 2400; i++) {
        stars[i] = new Star();
    }
    startTime = millis(); // Record the start time

}

function cubicEase(t) {
    return t * t * t;
}

function draw() {
    if(!isStopping){
        let currentTime = millis() - startTime;
        let normalizedTime = constrain(currentTime / (currentTime * teleportAcceleration), 0, 1);
        if (normalizedTime < 1) {
            speed = map(normalizedTime, 0, 1, 0, 50);
            decreaseValue();
        } else {
            speed = map(normalizedTime, 1, 0.8, 50, 100);
        }

    } else {
        let currentEndTime = millis() - startTime;
        let normalizedEndTime = constrain(currentEndTime / (currentEndTime * teleportAcceleration), 0, 1)
        if (normalizedEndTime < 1) {
            speed = map(normalizedEndTime, 0, 1, 50, 0);
            decreaseValue();
            
        } else {
            speed = 0
        }

    }

    background(20, 18, 26)
    translate(width / 2, height / 2);

    for (let i = 0; i < stars.length; i++) {
        stars[i].update(speed);
        stars[i].show();
    }

    if(!eventAdded){
        eventAdded = true;
        document.getElementById("animation-controller").addEventListener("click", showCanvas.bind(null, canvas));
    }
}

function Star() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    this.pz = this.z;

    this.update = function (speed) {
        this.z = this.z - speed;
        if (this.z < 1) {
            this.z = width;
            this.x = random(-width, width);
            this.y = random(-height, height);
            this.pz = this.z;
        }
    };

    this.show = function () {
        fill(255);
        noStroke();

        let sx = map(this.x / this.z, 0, 1, 0, width);
        let sy = map(this.y / this.z, 0, 1, 0, height);

        let r = map(this.z, 0, width, 16, 0);

        let px = map(this.x / this.pz, 0, 1, 0, width);
        let py = map(this.y / this.pz, 0, 1, 0, height);

        this.pz = this.z;

        stroke(255);
        line(px, py, sx, sy);
    };
}