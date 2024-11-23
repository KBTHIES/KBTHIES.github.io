// Kevin Thies
// kthies@andrew.cmu.edu
// Section C
// Abstrack Clock

var HDEG = 360 / 24;        // constants define ration of how many degrees
var MDEG = 360 / 60;        // around a circle per unit
var SDEG = 360 / 60;
var MSDEG = 360 / 1000;

var hDim = 50;              // define the dimension of each planetoid
var mDim = 25;
var sDim = 12;
var msDim = 6;

var starNum = 70;     // how many stars are in the background
var starX = [];       // empty arrays to etermine their size and position
var starY = [];       // an how often they twinkle
var starSize = [];
var tick = [];


function setup() {
  createCanvas(480,480);

// fill empty arrays with location and size data
  for(var stars = 0; stars < starNum; stars++) {
      starX.push(random(10, 470));
      starY.push(random(10, 470));
      starSize.push(random(3, 7));
      tick.push(round(random(0, 10)));
  }
}

function draw() {

    angleMode(DEGREES); // this makes things easier for later
    background(20);
    push();

    // add a new tick value for each star, if tick is randomly 0, twinkle
    for(var stars = 0; stars < starNum; stars++) {
        tick.shift(1);
        tick.push(round(random(0, 10)));
        if(tick[stars] == 0) {
            starSize[stars] = random(3, 7);
        }

    // place stars
        fill(70);
        ellipse(starX[stars], starY[stars], starSize[stars], starSize[stars]);
    }

//==================== Hours ==============================================
    translate(240, 240); // moving origin to center of screen
    rotate(HDEG * hour());

    stroke(50, 0, 0);
    strokeWeight(3);
    noFill();
    line(0, 0, 0 , 120);    // make the hour hand
    ellipse(0,0, 240, 240); // make the orbit

    noStroke();
    fill("orange");
    ellipse (0, 0, hDim, hDim); // make the hour planetoid

//==================== Minutes ============================================
    translate(0, 120); // moving origin to end of hour hand
    rotate(MDEG * minute());

    stroke(50, 0, 0);
    strokeWeight(3);
    noFill();
    line(0, 0, 0, 50);      // make the minute hand
    ellipse(0,0, 100, 100); // make the orbit

    noStroke();
    fill("lightBlue");
    ellipse (0, 0, mDim, mDim); // make the minute planetoid

//==================== Seconds ============================================
    translate(0, 50); // moving origin to end of minute hand
    rotate(SDEG * second());

    stroke(50, 0, 0);
    strokeWeight(3);
    noFill();
    line(0, 0, 0, 20);      // make the second hand
    ellipse(0, 0, 40, 40);  // make the orbit

    noStroke();
    fill("mediumAquamarine");
    ellipse (0, 0, sDim, sDim); // make the second planetoid

//==================== Milliseconds =======================================
    translate(0, 20); // moving origin to end of second hand
    rotate(MSDEG * millis());

    stroke(50, 0, 0);
    strokeWeight(3);
    noFill();
    line(0, 0, 0, 10);      // make the millisecond hand
    ellipse(0, 0, 20, 20);  // make the orbit

    noStroke();
    fill("fireBrick");
    ellipse (0, 0, msDim, msDim);   // make the millisecond planetoid


    // add a little dot on the end of that hand
    translate(0, 10);
    fill("khaki");
    ellipse(0, 0, 4, 4);

    pop();
}
