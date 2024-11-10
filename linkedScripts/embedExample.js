// Define a variable for the position of the ellipse
let x = 0;
let y = 200;

// This function will be called once when the sketch starts
function setup() {
    createCanvas(400, 400);
    background(220);
}

// This function will continuously run
function draw() {
    background(220);  // Clear the screen each time
    ellipse(x, y, 50, 50);  // Draw an ellipse at the current x, y position
    x += 2;  // Move the ellipse to the right
}
