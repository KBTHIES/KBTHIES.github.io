// Kevin Thies
// Section C
// kthies@andrew.cmu.edu
// Project-11- Turtle Freestyle

var ttl; // turtle


function setup() {
    // style
    createCanvas(480, 480);
    background(4, 20, 45);

    // make the turtle with starting values
    ttl = makeTurtle(width/2, height/2);
    ttl.penDown();
    ttl.setWeight(6);
    ttl.setColor("yellow");
    ttl.face(0);
}

function draw() {
    background(4, 20, 45, 20);

// firefly
    // move
    ttl.forward(5);

    // rotate
        // random, flying-insect-like movement
    ttl.right(map(noise(ttl.x, ttl.y), 0, 1, -180, 180));

        // if mouse over jar, make it move towards mouse
    if(mouseX < 360 && mouseX > 120 && mouseY > 90 && mouseY < 390) {
        ttl.turnToward(mouseX, mouseY, 40);
    }

    // if near jar wall,
    if (ttl.x > 350 || ttl.x < 130 || ttl.y > 380 || ttl.y < 100) {
        // turn towards center
        ttl.turnToward(width/2, height/2, 180);
        ttl.forward(10);

        // teleport back into jar
        if (ttl.x > 350) {
            ttl.goto(350, ttl.y);
            print("turtle too far right");
        } else if (ttl.x < 130) {
            ttl.goto(130, ttl.y);
            print("turtle too far left");
        } else if (ttl.y > 380) {
            ttl.goto(ttl.x, 380);
            print("turtle too far down");
        } else if (ttl.y < 85) {
            ttl.goto(ttl.x, 100);
            print("turtle too far up");
        }
    }
    // firefly light
    strokeWeight(0);
    fill(255, 255, 0, 40);
    ellipse(ttl.x, ttl.y, 40, 40);


    // jar (dimensions are x 120 to 360 y 90 to 390)
        fill(0, 0, 0, 0);
        rectMode(CENTER);
        stroke(255);
        strokeWeight(2);
        rect(width/2, height/2, 240, 300, 20);
        fill(173, 151,64);
        strokeWeight(0);
        rect(width/2, 73, 240, 30, 20);
}

//////////////////////////////////////////////////////////////////////////
function turtleLeft(d) {
    this.angle -= d;
}


function turtleRight(d) {
    this.angle += d;
}


function turtleForward(p) {
    var rad = radians(this.angle);
    var newx = this.x + cos(rad) * p;
    var newy = this.y + sin(rad) * p;
    this.goto(newx, newy);
}


function turtleBack(p) {
    this.forward(-p);
}


function turtlePenDown() {
    this.penIsDown = true;
}


function turtlePenUp() {
    this.penIsDown = false;
}


function turtleGoTo(x, y) {
    if (this.penIsDown) {
      stroke(this.color);
      strokeWeight(this.weight);
      line(this.x, this.y, x, y);
    }
    this.x = x;
    this.y = y;
}


function turtleDistTo(x, y) {
    return sqrt(sq(this.x - x) + sq(this.y - y));
}


function turtleAngleTo(x, y) {
    var absAngle = degrees(atan2(y - this.y, x - this.x));
    var angle = ((absAngle - this.angle) + 360) % 360.0;
    return angle;
}


function turtleTurnToward(x, y, d) {
    var angle = this.angleTo(x, y);
    if (angle < 180) {
        this.angle += d;
    } else {
        this.angle -= d;
    }
}


function turtleSetColor(c) {
    this.color = c;
}


function turtleSetWeight(w) {
    this.weight = w;
}


function turtleFace(angle) {
    this.angle = angle;
}


function makeTurtle(tx, ty) {
    var turtle = {x: tx, y: ty,
                  angle: 0.0,
                  penIsDown: true,
                  color: color(128),
                  weight: 1,
                  left: turtleLeft, right: turtleRight,
                  forward: turtleForward, back: turtleBack,
                  penDown: turtlePenDown, penUp: turtlePenUp,
                  goto: turtleGoTo, angleto: turtleAngleTo,
                  turnToward: turtleTurnToward,
                  distanceTo: turtleDistTo, angleTo: turtleAngleTo,
                  setColor: turtleSetColor, setWeight: turtleSetWeight,
                  face: turtleFace};
    return turtle;
}
