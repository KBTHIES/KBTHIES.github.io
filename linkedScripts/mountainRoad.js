// Kevin Thies
// Section C
// kthies@andrew.cmu.edu
// Project 10 - Generative Landscape

// initiate containers for mountains, trees, and posts
var mountains = [];
var trees = [];
var posts = [];

// keeps track of time for post spawning
var timer = 0;

// preset y values to act as "layers"
var layer = [470, 435, 400, 380, 320, 290];


function setup() {
    createCanvas(480, 480);

    // add starting mountains
    for(var i = 0; i < 15; i++) {
        var randomX = random(width);
        mountains[i] = makeMountain(randomX, 5);
    }

    // add starting trees
    for(var i = 0; i < 100; i++) {
        var randomX = random(width);
        trees[i] = makeTree(randomX, 5);
    }

    // add closer starting trees with different speed and color
    for(var i = 100; i < 200; i++) {
        var randomX = random(width);
        var newTree = makeTree(randomX, 4);
        newTree.color = color(10,0,29);
        newTree.speed = 0.9;
        trees[i] = newTree;
    }
}

function draw() {

    // background
    background(12,24,68);
    strokeWeight(3);
    backgroundGradient();
    strokeWeight(0);

    // sun
    strokeWeight(0);
    fill("lemonchiffon");
    ellipse(width / 2, layer[5], 100, 100);

    // ground
    fill(12,24,68);
    rectMode(CORNERS);
    rect(0, layer[5], width, height);
    fill(10,0,29);
    rect(0, layer[4], width, height);

    // mountains
    strokeWeight(0);
    updateAndDisplayMountains();
    removeOffscreenMountains();
    addNewMountains();

    // trees at base of mountain
    updateAndDisplayTrees();
    removeOffscreenTrees();
    addNewTrees();
    addNewCloserTrees();

    // highway railing
      // posts
    updateAndDisplayPosts();
    removeOffscreenPosts();
    addNewPosts();

      // solid barrier part of the rail
    fill(40,37,31);
    rect(0, layer[2], width, layer[0]);
    stroke(98,87,93);
    strokeWeight(3);
    line(0, layer[2], width, layer[2]);
    strokeWeight(0);
    rectMode(CENTER);
    fill(24,12,14);
    rect(width/2, layer[1], width, 40)
}

// POSTS //////////////////////////////////////////////////////////////////

// moves the existing posts
function updateAndDisplayPosts() {
    for(var i = 0; i < posts.length; i++) {
        posts[i].move();
        posts[i].display();
    }
}

// removes the posts that are offscreen
function removeOffscreenPosts() {
    // if posts are offscreen, don't re-add them to posts[]
    var postsToKeep = [];
    for(var i = 0; i < posts.length; i++) {
        if (posts[i].x + 40 > 0) {
            postsToKeep.push(posts[i]);
        }
    }
    posts = postsToKeep;
}

// adds the new posts
function addNewPosts() {
    // every 40 frames, shoot in a new post
    timer ++;
    if(timer == 40) {
        timer = 0;
        posts.push(makePost(width))
    }
}

// how posts are made
function makePost(px) {
    var post = {x: px,
                speed: 12,
                display: postDisplay,
                color: color(98,87,93),
                color2: color(40,37,31),
                move: postMove,
    }
    return post;
}

// is how to move the posts
function postMove() {
    this.x -= this.speed;
}

// builds the posts from the this.x coordinate
function postDisplay() {
    stroke(this.color);
    strokeWeight(3);
    //       |      part of post
    line(this.x, height, this.x, layer[2] - 20);
    //      / /     part of post
    line(this.x, layer[2] - 20, this.x - 10, layer[2] - 10);
    line(this.x - 20, layer[2] - 20, this.x - 30, layer[2] - 10);
    //       -      part of post
    line(this.x - 5, layer[2] - 15, this.x - 25, layer[2] - 15);
    strokeWeight(0);
}

// TREES //////////////////////////////////////////////////////////////////

// how trees are made
function makeTree(tx, layer) {
    var tree = {x: tx,
                layer: layer,
                speed: 0.7,
                display: treeDisplay,
                color: color(12,24,68),
                move: treeMove,
                scale: random(0.5, 1)};
    return tree;
}

// how the trees are moved
function treeMove() {
    this.x -= this.speed;
}

// builds the far trees from an x coordinate
function treeDisplay() {
    fill(this.color);
    ellipse(this.x, layer[this.layer], 20 * this.scale, 20 * this.scale);
}

// moves existing trees
function updateAndDisplayTrees() {
    for(var i = 0; i < trees.length; i++) {
        trees[i].move();
        trees[i].display();
    }
}

// removes trees that are offscreen
function removeOffscreenTrees() {
    // if tree is offscreen, don't re-add it to trees[]
    var treesToKeep = [];
    for(var i = 0; i < trees.length; i++) {
        if (trees[i].x + 20 > 0) {
            treesToKeep.push(trees[i]);
        }
    }
    trees = treesToKeep;
}

// random chance generates a new tree on layer 5
function addNewTrees() {
    var newTreeChance = 0.1;
    if(random(0,1) < newTreeChance) {
        trees.push(makeTree(width, 5))
    }
}

// random chance generates a new tree on layer 4 with fitting color and speed
function addNewCloserTrees() {
    var newTreeChance = 0.1;
    if(random(0,1) < newTreeChance) {
        var newTree = makeTree(width, 4);
        newTree.color = color(10,0,29);
        newTree.speed = 0.9;
        trees.push(newTree);
    }
}

// BACKGROUND //////////////////////////////////////////////////////////////

// makes the gradient seen in the background from y = 0 to layer 5
function backgroundGradient() {
    for(var i = 0; i < layer[5]; i++) {
        var g = map(i, 0, layer[5], 0, 140);
        stroke(255, g, 0);
        line(0, i, width, i);
    }
}

// MOUNTAINS //////////////////////////////////////////////////////////////

// moves existing mountains (so strong)
function updateAndDisplayMountains() {
    for(var i = 0; i < mountains.length; i++) {
        mountains[i].move();
        mountains[i].display();
    }
}

// removes mountains that are offscreen
function removeOffscreenMountains() {
    // if mountain is offscreen, don't re-add it to mountains[]
    var mountainsToKeep = [];
    for(var i = 0; i < mountains.length; i++) {
        if (mountains[i].x + (200 * mountains[i].scale) > 0) {
            mountainsToKeep.push(mountains[i]);
        }
    }
    mountains = mountainsToKeep;
}

// random chance generates a new mountain
function addNewMountains() {
    var newMountainChance = 0.01;
    if(random(0,1) < newMountainChance) {
        mountains.push(makeMountain(width, 5))
    }
}

// how mountains are made
function makeMountain(mx, layer) {
    var mountain = {x: mx,
                    layer: layer,
                    speed: 0.5,
                    display: mountainDisplay,
                    color: color(85,54,86),
                    color2: color(85, 54, 106),
                    move: mountainMove,
                    scale: random(0.5, 1)};
    return mountain;
}

// how mountains are moved
function mountainMove() {
    this.x -= this.speed;
}

// actually builds the moutain based off an x coordinate
function mountainDisplay() {
    fill(this.color);
    triangle(this.x, layer[this.layer],
         this.x + (200 * this.scale), layer[this.layer],
         this.x + (100 * this.scale), layer[this.layer] - (180 * this.scale));
    fill(this.color2);
    triangle(this.x + (170 * this.scale), layer[this.layer],
              this.x + (200 * this.scale), layer[this.layer],
              this.x + (100 * this.scale), layer[this.layer] - (180 * this.scale));
}

// Congradulations, you made it to the end! *confetti emoji*
