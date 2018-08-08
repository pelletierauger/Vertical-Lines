let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/default-p5-sketch";
let maxFrames = 20;
let g;
let current = 0;
let stripeAmount = 64;
let panSpeed = 1600;
let mic;
let song;
let amp;
let level;

function setup() {
    pixelDensity(1);
    socket = io.connect('http://localhost:8080');
    cnvs = createCanvas(windowWidth, windowWidth / 16 * 9);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    song = loadSound("c-sharp.mp3", loaded);
    amp = new p5.Amplitude();
    // mic = new p5.AudioIn();
    // mic.start();
    frameRate(30);
    background(255);
    fill(255, 50);
    noStroke();
    if (!looping) {
        noLoop();
    }
    g = createGraphics(stripeAmount, 1);

    g.background(255, 0, 0);
    g.loadPixels();
    for (let i = 0; i < stripeAmount * 4; i += 4) {
        g.pixels[i] = 0;
        g.pixels[i + 1] = 0;
        g.pixels[i + 2] = 0;
        g.pixels[i + 3] = 255;
    }
    g.updatePixels();
}

function loaded() {
    song.play();
}

function draw() {
    level = amp.getLevel();
    // level = mic.getLevel();
    // console.log(level);
    let x1 = map(frameCount % panSpeed, 0, panSpeed, width, 0);
    let x2 = map(frameCount % panSpeed, 0, panSpeed, 0, -width);
    image(g, x1, 0, width, height);
    image(g, x2, 0, width, height);
    // let x3 = map(frameCount % panSpeed, 0, panSpeed, 0, width);
    // let x4 = map(frameCount % panSpeed, 0, panSpeed, -width, 0);
    // tint(255, 255, 255, 150);
    // image(g, x3, 0, width, height);
    // image(g, x4, 0, width, height);
    g.loadPixels();
    if (current == 0) {
        g.pixels[0] = g.pixels[((stripeAmount - 1) * 4)];
        g.pixels[1] = g.pixels[((stripeAmount - 1) * 4) + 1];
        g.pixels[2] = g.pixels[((stripeAmount - 1) * 4) + 2];
    } else {
        g.pixels[(current * 4)] = random(255) * (level * 10);
        g.pixels[(current * 4) + 1] = random(255) * (level * 10);
        g.pixels[(current * 4) + 2] = random(255) * (level * 10);
    }
    g.updatePixels();
    if (frameCount % 1 == 0) {
        current++;
        if (current == stripeAmount) {
            current = 0;
        }
    }

    if (exporting && frameCount < maxFrames) {
        frameExport(p);
    }
}

function keyPressed() {
    if (keyCode === 32) {
        if (looping) {
            noLoop();
            looping = false;
            song.pause();
        } else {
            loop();
            looping = true;
            song.play();
        }
    }
    if (key == 'p' || key == 'P') {
        frameExport(p);
    }
}