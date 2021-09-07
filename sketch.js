var clearScreen = true;
var lastX = 0;
var lastY = 0;
var EPS = 0.0001;
var velocityX = 0;
var velocityY = 0;
var count = 0;
var canvasHeight = 800;
var canvasWidth = 800;


class Bouncer {
  constructor() {
    this.height = canvasHeight;
    this.width = canvasWidth;
    this.x = random() * this.height;
    this.y = random() * this.width;
    this.total_velocity = 35.0;

    let a = random() * 2 * PI;

    this.velocity_x = cos(a) * this.total_velocity;
    this.velocity_y = sin(a) * this.total_velocity;
  }

  update() {
    let new_x = this.x + this.velocity_x
    let new_y = this.y + this.velocity_y

    if (new_x > this.width || new_x < 0) {
      this.velocity_x = -this.velocity_x;
      new_x = this.x + this.velocity_x
    }

    if (new_y > this.height || new_y < 0) {
      this.velocity_y = -this.velocity_y;
      new_y = this.y + this.velocity_y
    }

    let current_angle = atan2(this.velocity_y, this.velocity_x);

    let a = randomGaussian(current_angle, 2 * PI / 3.0);
    if (a > 2 * PI) {
      a -= 2 * PI;
    } else if (a < 0) {
      a += 2 * PI;
    }
    let noise_velocity_x = cos(a) * this.total_velocity;
    let noise_velocity_y = sin(a) * this.total_velocity;

    this.velocity_x = noise_velocity_x * 0.01 + this.velocity_x * 0.99;
    this.velocity_y = noise_velocity_y * 0.01 + this.velocity_y * 0.99;


    this.x = new_x;
    this.y = new_y;
  }

  draw() {
    push()
    ellipse(this.x, this.y, 20, 20);
    pop()
  }
}

class Spiral {
  constructor(centerX, centerY, max_steps) {
    this.x = centerX;
    this.y = centerY;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius_step = 0.5;
    this.radius = 5.0;
    this.alpha_step = 0.1;
    this.alpha = 0;
    this.max_steps = max_steps;
    this.step = 0;
    this.ellipse_radius = 5.0;
    this.velocity_x = 0;
    this.velocity_y = 0;

  }

  draw() {
    push();
    fill(128 + this.step % 128,this.step % 128, 0);
    stroke(96, 66, 128)
    translate(this.x, this.y);

    var c = atan2(this.velocity_y, this.velocity_x);

    rotate(c);
    // growTree(0, 0);

    ellipse(0, 0, 1.2 * sqrt(this.velocity_y * this.velocity_y + this.velocity_x * this.velocity_x), this.ellipse_radius);
    pop();

    // ellipse(this.x, this.y, this.ellipse_radius, this.ellipse_radius);

    // print("this.step: " + this.step);
  }

  update() {
    var new_x = this.centerX + cos(this.alpha) * this.radius;
    var new_y = this.centerY + sin(this.alpha) * this.radius;

    this.velocity_x = this.x - new_x;
    this.velocity_y = this.y - new_y;

    this.x = new_x;
    this.y = new_y;
    
    this.radius_step = 1.0 +  this.x * this.y * 0.000001;
    this.radius *= this.radius_step;
    this.alpha += this.alpha_step;
    if (this.alpha > 2 * PI) {
      this.alpha -= 2 * PI;
    }
    this.step += 1;
    return;
  }
}


function drawSpiral(spiral) {
  points = spiral.max_steps;
  
  var step = 0.1;
  var radius_step = 0.01 * spiral.centerY * spiral.centerX * 0.0001;
  var radius = 0.001;
  var i = 0;
  var alpha = 0;
  while (i < points) {
    alpha += step;
    if (alpha > 2 * PI) {
      alpha -= 2 * PI;
    }
    x = spiral.centerX + cos(alpha) * radius;
    y = spiral.centerY + sin(alpha) * radius;
    radius *= 1.0 + radius_step;
    ellipse(x, y, 5, 5);
    i++;

  }
}


function growTree(x, y) {
  var depth = 500;
  var max_steps = 32;

  var nodes = [[x,y,0]];

  var n = 0;


  var branch_proba = 0.9;


  while (nodes.length != 0 && n < max_steps) {

    var spread = randomGaussian(2 * PI, 1.0);

    var angle_step = spread / 3.0 - EPS;
    
    el = nodes.pop();

    x1 = el[0];
    y1 = el[1];
    d = el[2];

    for (let alpha = 0; alpha < spread; alpha += angle_step) {
      if (random() < branch_proba) {
        var branch_length = 12.0 * randomGaussian(0, 1.0);

        x2 = x1 + cos(alpha) * branch_length;
        y2 = y1 + sin(alpha) * branch_length;
        if (d < depth) {
          nodes.push([x2, y2, d+1]);
        } else {
          // print("Oh oh " + d)
        }
        stroke(0, (1.0 - d / depth) * 255 );
        fill(0, (1.0 - d / depth) * 255)
        line(x1, y1, x2, y2);
        var radius = randomGaussian(5.0, 3.0);
        ellipse(x2, y2, radius, radius);
      }
      n += 1;
    }
  }
}

draw_objects = []
var pingpong;

function counter() {
  count++;
}

function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);
  setInterval(counter, 0.1);
  pingpong = new Bouncer();
}

function draw() {
  if (clearScreen) {
    background(128);
    clearScreen = false;
  }

  background(255,255,255,1);

  if (keyIsPressed) {
    clearScreen = true; 
  }

  // fill(96, 66, 128, 1);
  
  if (mouseIsPressed) {
    // fill(0);
    // growTree(mouseX, mouseY);

    // drawSpiral(mouseX, mouseY);
    draw_objects.push(new Spiral(mouseX, mouseY, 1000));
  } else {
    //nothing
  }

  draw_objects.push(new Spiral(pingpong.x, pingpong.y, 100));

  // filter old objects
  draw_objects = draw_objects.reduce((p, c) => ((c.step < c.max_steps) && p.push(c), p), []);

  for (let draw_object of draw_objects) {
    // print(draw_objects);
    // print(draw_object);
    draw_object.update();
    draw_object.draw();
  }

  pingpong.update();
  // pingpong.draw();

  velocity_x = mouseX - lastX;
  velocity_y = mouseY - lastY;

  var c = atan2(velocity_y, velocity_x);

  push();
  fill(96, 66, 128);
  translate(mouseX, mouseY);
  rotate(c);

  ellipse(0, 0, sqrt(velocity_y * velocity_y + velocity_x * velocity_x), 5.0);
  pop();

  lastX = lastX * 0.5 + mouseX * 0.5;
  lastY = lastY * 0.5 + mouseY * 0.5;
}
