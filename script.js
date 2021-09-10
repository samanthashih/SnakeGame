// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, background, ellipse, random, width, height,
   rect, line, text, rectMode, CENTER, mouseX, mouseY, frameRate, stroke, noFill,
   noStroke, keyCode, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, noLoop, 
   strokeWeight, textSize, fill, collideRectCircle*/

let backgroundColor, playerSnake, currentApple, score

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frameRate(12);
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
}

function displayScore() {
  stroke(0);
  fill(0);
  strokeWeight(1);
  textSize(10);
  text(`score: ${score}`, 5, 10);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - 10;
    this.direction = 'N';
    this.speed = 12;
    this.tail = []; //array associated w/ snake
  }

  moveSelf() {
    if (this.tail.length > 0) {
      for (let i = this.tail.length - 1; i > 0; i--) {
        this.tail[i].x = this.tail[i - 1].x;
        this.tail[i].y = this.tail[i - 1].y;
      }
      this.tail[0].x = this.x;
      this.tail[0].y = this.y;
    }
    
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }

  }

  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

  checkApples() {
    let hit = collideRectCircle(this.x, this.y, this.size, this.size, 
                               currentApple.x, currentApple.y, 10); //can access cuurentApple b/c defined at top, global variable
    if (hit) {
      score++;
      currentApple = new Apple();
      this.extendTail();
    }
  }

  checkCollisions() {
    if (this.y > height || this.y < 0 || this.x > width || this.x < 0) {
      gameOver();
    }
  }

  extendTail() {
    let x, y;
    if (this.tail.length === 0) {
      let x = this.x;
      let y = this.y;
    } else {
      x = this.tail[this.tail.length - 1].x;
      y = this.tail[this.tail.length - 1].y;
    }

    this.moveSelf();
    this.tail.push(new TailSegment(x, y)); //push adds new element at end of array
  }
}

class TailSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }
  
  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }
}


class Apple {
  constructor() {
    this.x = random(width);
    this.y = random(height);
  }

  showSelf() { 
    fill("red");
    ellipse(this.x, this.y, 10);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode)
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W";
  } else {
    console.log("wrong key");
  }
}

function restartGame() {}

function gameOver() {
  stroke(0);
  text("GAME OVER", width / 2, height / 2);
  noLoop(); // p5js function -- the draw function stops 
}