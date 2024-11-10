var debugMode = false;  // toggles debug mode
var char;               // stores the character
var missiles = [];      // stores the magic missiles
var enemies = [];       // stores the enemies
var rooms = [];         // stores the rooms
var roomKeys = [];      // sotres the "name" of the room
var roomEnemies = [];   // stores the leftover enemies of each room
var lastUsedFloorSeed = 1;  // previous floor seed used
var currentRoom = "C";  // room id of current room
var directions = ["N", "E", "S", "W"]; // used in generating doors
var previousDir = "C";  // initiates with the previous value of C
var mouseCounter = 0;   // how long has mouse been held for?
var spread = 30;        // spread of the angle for magic missiles
var fireInterval = 5;   // how often are missiles shot
var manaGain = 1.5;     // how much mana regained per frame
var manaLost = 20;      // mana expended to shoot a magic missile
var hitDamage = 1;      // damage player takes if hit
var moveSpeed = 1.7;    // how fast the player moves
var enemySpeed = 1.5;   // how fast enemies move
var hitRadius = 15;     // radius of enemy hitbox
var hitsToKill = 20;    // how many hits an enemy needs to be killed
var doorLimit;          // max amount of doors that can spawn
var floorsCleared = 0;  // number of floors the player has cleared
var deathCounter = 0;   // a timer after the player dies
var fadeCounter = 0;    // the counter for fade out
var shouldFade = false; // should the screen fade?
var shotsFired= 0;      // holds how many shots were fired
var enemiesSlain = 0;   // holds how many skeletons were slain
var enemiesAlive = 0;   // holds how many enemies in room are alive



function preload() {    // load the textures
    dungeonFloor = loadImage("https://i.imgur.com/VjkGIfD.jpg");
    dungeonWalls = loadImage("https://i.imgur.com/z7qxLHe.png");
    northDoor = loadImage("https://i.imgur.com/KmQ5l5A.png");
    southDoor = loadImage("https://i.imgur.com/PS56sKG.png");
    westDoor = loadImage("https://i.imgur.com/UvWhm3u.png");
    eastDoor = loadImage("https://i.imgur.com/KNxPK3v.png");
    hole = loadImage("https://i.imgur.com/2CX6TWN.png");
    holeLight = loadImage("https://i.imgur.com/GR17LVV.png");
    wizard = loadImage("https://i.imgur.com/3eZz0KO.png");
    wizardNoMagic = loadImage("https://i.imgur.com/PI6dWjQ.png");
    wizardHurt = loadImage("https://i.imgur.com/OF8kDJn.png");
    staffGlow = loadImage("https://i.imgur.com/FaP3USD.png");
    missileGlow = loadImage("https://i.imgur.com/kz9j30X.png");
    deadSkeleton = loadImage("https://i.imgur.com/XPcZiRJ.png");
    skeleton = loadImage("https://i.imgur.com/MmpBxbE.png");
    skeletonHit = loadImage("https://i.imgur.com/KxqTfbM.png");
}

function setup() {
    createCanvas(480, 480);
    angleMode(DEGREES);
    noCursor();              // hide cursor so that we can replace it with a custom one
    makeCharacter(240, 240); // starts character in the center of the canvas
    doorLimit = floor(random(6, 11)); // random door limit at the start

    // generate the initial center room
    centerRoom = {"floorSeed":1,
            "doorSeed":1,
            "directionEntered":"C",
            "north":true, "south":false, "east":false, "west":false,
            "final":false, "enemiesInRoom":[]
            };

    // push the room into the room array
    rooms.push(centerRoom);
    // push the room key into the room key array
    roomKeys.push(currentRoom);
    // push 0 enemies into the first room
    roomEnemies.push(enemies);
    // fade in
    shouldFade = true;
    fadeCounter = 120;
}

function draw() {
    background(0);      // backup in case textures don't load

    drawRoom();         // draws the room
    enemyUpdate();      // updates enemies in room
    missileUpdate();    // updates the magic missiles
    characterUpdate();  // updates the character
    cursorUpdate();     // updates the cursor
    doorCheck();        // checks if a player can go thorugh a door
    deathCheck();       // checks if the player has died
    fadeOut();          // checks if fadeout should execute
}

function fadeOut() { // fades the screen to black and back

    // applies a red overlay based on character health
    strokeWeight(0);
    fill(255, 0, 0, map(char.health, 70, 0, 0, 100));
    // if the character is dead, stop the red
    if(char.health <= 0){
        fill(0, 0, 0, 0);
    }
    rect(0, 0, width, height);

    // counts the fade counter up to 128 if fade is started
    if(fadeCounter < 128 && shouldFade === true) {
        fadeCounter ++;
    }
    // after it reaches that point, fade is set back to false
    if(fadeCounter >= 128) {
        shouldFade = false;
    }
    // if fade is false, decrement the counter
    if(shouldFade === false) {
        fadeCounter --;
    }
    // add a black box of darkening opacity to fade out
    fill(0, 0, 0, fadeCounter * 2);
    rect(0, 0, width, height);
}

function deathCheck() { // checks to see if the character has died
    // grabs the index of the current room
    // needs to be a local variable or it just doesn't work
    var roomIndex = roomKeys.indexOf(currentRoom);

    push();
    // if character is dead:
    if(char.health <= 0) {
        // increment death counter
        deathCounter++;
        // do a special death fadeout with a black box
        strokeWeight(0);
        fill(0, 0, 0, deathCounter * 2);
        rect(0, 0, width, height);
    }

    // after a certain amount of time to fade:
    if(deathCounter > 120) {
        // fade in text that the character has died
        textAlign(CENTER);
        textSize(32);
        strokeWeight(0);
        textStyle(BOLD);
        fill(255, 0, 0, (deathCounter - 120));
        text("You have Died", width / 2, 150);
        // format the bottom text
        fill(0);
        textSize(14);
        strokeWeight(1.3);
        stroke(255, 0, 0, (deathCounter - 240));
        textStyle(ITALIC);
        // fade in how many floors were cleared
        if (floorsCleared === 1) {
            text(floorsCleared + " floor freed from evil's grasp", width / 2, 200);
        } else {
            text(floorsCleared + " floors freed from evil's grasp", width / 2, 200);
        }
        // fade in how many magic missiles were cast
        stroke(255, 0, 0, (deathCounter - 360));
        text("Magic missile was cast " + shotsFired + " times", width / 2, 230);
        // fade in how many enemies were defeated
        stroke(255, 0, 0, (deathCounter - 480));
        text(enemiesSlain - enemiesAlive + " of evil's minions were put to rest", width / 2, 260);
        // after a while, offer the option to replay
        textSize(18);
        strokeWeight(0);
        textStyle(BOLD);
        fill(255, 0, 0, (deathCounter - 800));
        text("press space to play again", width / 2, 300);
    }
    pop();
}

function doorCheck() { // checks if a player can enter a door or hole
    // grabs the index of the current room
    var roomIndex = roomKeys.indexOf(currentRoom);
    // sets initial value if all enemies have been defeated
    var allEnemiesDefeated = true;
    // for all enemies in room:
    for(var i = 0; i < rooms[roomIndex].enemiesInRoom.length; i++) {
        // if one is alive, allEnemiesDefeated is false
        if(rooms[roomIndex].enemiesInRoom[i].life < 100) {
            allEnemiesDefeated = false;
        }
    }

    // if the character is near and going in the direction of a door
    // change the room in that direction
    if(dist(char.x, char.y, width / 2, 0) < 60 &&
            char.up === true &&
            rooms[roomIndex].north === true &&
            allEnemiesDefeated === true) {
        char.y = 440;
        changeRoom("N");
    }
    if(dist(char.x, char.y, width / 2, height) < 60 &&
            char.down === true &&
            rooms[roomIndex].south === true &&
            allEnemiesDefeated === true) {
        char.y = 40;
        changeRoom("S");
    }
    if(dist(char.x, char.y, 0, height / 2) < 60 &&
            char.left === true &&
            rooms[roomIndex].west === true &&
            allEnemiesDefeated === true) {
        char.x = 440;
        changeRoom("W");
    }
    if(dist(char.x, char.y, width, height / 2) < 60 &&
            char.right === true &&
            rooms[roomIndex].east === true &&
            allEnemiesDefeated === true) {
        char.x = 40;
        changeRoom("E");
    }
    if(dist(char.x, char.y, width / 2, height / 2) < 30 &&
            rooms[roomIndex].final === true &&
            allEnemiesDefeated === true) {
        resetFloor();
    }
}

function drawRoom() { // draws the room each update cycle

    // grabs the index of the current room
    var roomIndex = roomKeys.indexOf(currentRoom);

    // displays floor based on floorseed
    if(rooms[roomIndex].floorSeed === 1) {
        image(dungeonFloor, 0, 0, width, height);

    } else if (rooms[roomIndex].floorSeed === 2) {
        push();
        rotate(90);
        image(dungeonFloor, 0, -1 * height, width, height);
        pop();

    } else if (rooms[roomIndex].floorSeed === 3) {
        push();
        rotate(180);
        image(dungeonFloor, -1 * width, -1 * height, width, height);
        pop();

    } else if (rooms[roomIndex].floorSeed === 4) {
        push();
        rotate(270);
        image(dungeonFloor, -1 * width, 0, width, height);
        pop();
    }

    // displays walls
    image(dungeonWalls, 0, 0, width, height);

    // display doors
    if(rooms[roomIndex].north === true) {
        image(northDoor, 0, 0, width, height);
    }

    if(rooms[roomIndex].south === true) {
        image(southDoor, 0, 0, width, height);
    }

    if(rooms[roomIndex].west === true) {
        image(westDoor, 0, 0, width, height);
    }

    if(rooms[roomIndex].east === true) {
        image(eastDoor, 0, 0, width, height);
    }

    // display hole if final room
    if(rooms[roomIndex].final === true) {
        image(hole, 0, 0, width, height);
    }

    // display light if first room
    if(currentRoom === "C") {
        image(holeLight, 0, 0, width, height);
    }

    // debug options
    if(debugMode === true) {
        strokeWeight(0);
        fill(255);
        stroke(255);
        text("room ID = " + currentRoom, 20, 20);
        text("rooms left = " + doorLimit, 20, 30);
        text("north = " + rooms[roomIndex].north, 20, 40);
        text("south = " + rooms[roomIndex].south, 20, 50);
        text("east = " + rooms[roomIndex].east, 20, 60);
        text("west = " + rooms[roomIndex].west, 20, 70);
        text("final = " + rooms[roomIndex].final, 20, 80);
        text("Number of enemies = " + rooms[roomIndex].enemiesInRoom.length, 20, 400);
        text("floors cleared = " + floorsCleared, 20, 90);
    }
}

function changeRoom(directionEntered) { // if players enter a door, change the room

    // set a random floor seed to determine the floor image rotation
    var floorSeed = ceil(random(0, 4));

    // make sure the last floor seed is different from the new one
    while(floorSeed === lastUsedFloorSeed) {
        floorSeed = ceil(random(0, 4));
    }

    // reset the last used floor seed
    lastUsedFloorSeed = floorSeed;

    // Add doorseed based on how many are left
    var doorSeed = ceil(random(0, 3));

    // This giant block manages room ids, if you enter a new room that direction
    // is added to the string for the name, and removes the last letter of the string
    // if you backtrack into a previously explored room
    if(directionEntered === "N" && previousDir === "S") {
        currentRoom = currentRoom.substr(0, currentRoom.length - 1);

    } else if(directionEntered === "S" && previousDir === "N") {
        currentRoom = currentRoom.substr(0, currentRoom.length - 1);

    } else if(directionEntered === "E" && previousDir === "W") {
        currentRoom = currentRoom.substr(0, currentRoom.length - 1);

    } else if(directionEntered === "W" && previousDir === "E") {
        currentRoom = currentRoom.substr(0, currentRoom.length - 1);

    // if the current room has not been entered, append the
    // direction entered to the end of current room
    } else {
        currentRoom = currentRoom + directionEntered;
    }

    // sets previous direction to the direction used to enter the room
    previousDir = currentRoom.substring(currentRoom.length - 1, currentRoom.length);

    // sets initial door values
    var doorNorth = false;
    var doorSouth = false;
    var doorEast = false;
    var doorWest = false;
    var doorFinal = false;

    // if the room entered doesn't exist yet:
    if(roomKeys.indexOf(currentRoom) == -1) {

        // subrtact one from the remaining rooms to generate
        doorLimit --;

        // set the starting position of where the player entered
        var initial = directions.indexOf(directionEntered);

        // generates a random door based on where the character entered
        // and the door seed
        var doorNum = initial + 2 + doorSeed;

        // make sure doorNum is between 0 and 3
        while(doorNum > 3) {
            doorNum -= 4;
        }

        // ties the door num to a direction string
        var doorToDisplay = directions[doorNum];

        // if it's the final room of the floor:
        if(doorLimit === 0) {

            // make sure the room know's it's the final one
            doorFinal = true;

            // generate the final door on the same side as would enter from
            var finalDoorNum = initial + 2;
            while(finalDoorNum > 3) {
                finalDoorNum -= 4;
            }

            // tie the final door number to a direction string
            doorToDisplay = directions[finalDoorNum];
        }

        // take the door to display as well as the door the character came from
        // and add those properties to the new room
        if(doorToDisplay === "N" || directionEntered === "S") {
            doorNorth = true;
        }
        if(doorToDisplay === "S" || directionEntered === "N") {
            doorSouth = true;
        }
        if(doorToDisplay === "E" || directionEntered === "W") {
            doorEast = true;
        }
        if(doorToDisplay === "W" || directionEntered === "E") {
            doorWest = true;
        }

    }

    // add a new room to the room array
    rooms.push(makeNewRoom(doorSeed, floorSeed, directionEntered,
                           doorNorth, doorSouth, doorEast, doorWest,
                           doorFinal));

    // add the room ID to the list of roomKeys
    roomKeys.push(currentRoom);

    // sets local room index
    var roomIndex = roomKeys.indexOf(currentRoom);

    // resets the arrays for missiles and enemies, clearing the room
    missiles = [];
    enemies = [];

    // generate new enemies
    if(doorFinal === false && roomKeys.indexOf(currentRoom) === roomKeys.length - 1) {
        for(var i = 0; i < (random(2, 4 + floorsCleared) + floorsCleared); i++) {
            rooms[roomIndex].enemiesInRoom.push(makeEnemy(random(100, 380), random(100, 380), 0, 0));
            // rotate random directions
            rooms[roomIndex].enemiesInRoom[i].right(degrees(random(360)));
            // set random speed that increases each floor
            rooms[roomIndex].enemiesInRoom[i].speed = random(1.3, 1.8) + 0.05 * floorsCleared;
            // set random move mode
            rooms[roomIndex].enemiesInRoom[i].moveMode = floor(random(2));
        }
    }
}

function makeNewRoom(doorSeed, floorSeed, directionEntered,
                     north, south, east, west,
                     final) { // makes the room

    room = {"floorSeed":floorSeed,
            "doorSeed":doorSeed,
            "directionEntered":directionEntered,
            "north":north, "south":south, "east":east, "west":west,
            "final":final,
            "enemiesInRoom":[]
            };
    return room;
}

function resetFloor() { // resets the floor if cleared

    // heal some of the character's health
    char.health += floor(((100 - char.health) * 3 / 5));

    // reset floor containers
    missiles = [];
    enemies = [];
    rooms = [];
    roomKeys = [];

    previousDir = "C";  // initiates with the previous value of C
    currentRoom = "C";  // current room is the center room

    // make a new door limit
    doorLimit = floor(random(6, 11));

    // add 1 to number of floors cleared
    floorsCleared ++;

    // define the new center room of the floor
    centerRoom = {"floorSeed":1,
            "doorSeed":1,
            "directionEntered":"C",
            "north":true, "south":false, "east":false, "west":false,
            "final":false,
            "enemiesInRoom":[]
            };

    // push the room into the rooms array
    rooms.push(centerRoom);

    // push the room ID into the room keys array
    roomKeys.push(currentRoom);

    // push 0 enemies into the array
    roomEnemies.push(enemies);

    // execute fade out
    shouldFade = true;
    fadeCounter = 0;

    // position character to the center of the room
    char.x = width / 2;
    char.y = height / 2;
}

function makeCharacter(x, y) { // creates the character object
    char = {"x":x, "y":y,
            "left":false, "right":false,
            "up":false,  "down":false,
            "facing":0, "health":100, "mana":100,
            "isHit":false
            };
    return char;
}

function characterUpdate() { // updates the character's movement

    // if the movement key is pressed, set the appropriate character move state
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D or right arrow
        char.right = true;
    } else {
        char.right = false;
    }

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A or left arrow
        char.left = true;
    } else {
        char.left = false;
    }

    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { // S or down arrow
        char.down = true;
    } else {
        char.down = false;
    }

    if (keyIsDown(87) || keyIsDown(UP_ARROW)) { // W or up arrow
        char.up = true;
    } else {
        char.up = false;
    }

    // Face the mouse
    push();
    translate(char.x, char.y);

    // this gets an angle between 0 and 360
    char.facing = ((atan2(mouseY - char.y, mouseX - char.x) + 360)% 360);
    pop();

    // the update moves and draws the character
    characterMove();
    characterDraw();

    // regain mana
    char.mana = min(100, char.mana += manaGain)
    return;
}

function characterMove() { // moves the character

    // if it's not fading and the character is alive:
    if(deathCounter === 0 && shouldFade === false) {

        // if the movement states are true, move by a set speed
        // move linearly slightly faster
        if(char.right === true && char.up === false && char.down === false) {
            char.x += moveSpeed * sqrt(2);
        }

        if(char.left === true && char.up === false && char.down === false) {
            char.x -= moveSpeed * sqrt(2);
        }

        if(char.up === true && char.left === false && char.right === false) {
            char.y -= moveSpeed * sqrt(2);
        }

        if(char.down === true && char.left === false && char.right === false) {
            char.y += moveSpeed * sqrt(2);
        }

        // move diagonally
        if(char.right === true && char.up === true && deathCounter === 0) {
            char.x += moveSpeed;
            char.y -= moveSpeed;
        }

        if(char.right === true && char.down === true && deathCounter === 0) {
            char.x += moveSpeed;
            char.y += moveSpeed;
        }

        if(char.left === true && char.up === true && deathCounter === 0) {
            char.x -= moveSpeed;
            char.y -= moveSpeed;
        }

        if(char.left === true && char.down === true && deathCounter === 0) {
            char.x -= moveSpeed;
            char.y += moveSpeed;
        }
    }

    // limit x and y coords to inside the walls
    char.x = constrain(char.x, 40, 440);
    char.y = constrain(char.y, 40, 440);

}

function characterDraw() { // draws the character
    // style
    fill(255);
    stroke(5);
    strokeWeight(2);

    // glow under character
    image(missileGlow, char.x - 120 + sin((char.facing + 247) * -1) * 40,
                         char.y - 120 + cos((char.facing + 247) * -1) * 40,
                         240, 240);

    // Main Character //  //  //  //  //  //  //  //  //  //
    push();

    // make the main character the origin
    translate(char.x, char.y);

    // rotate the character based on its angle
    rotate(char.facing - 80);

    // display ,agic hand if shooting magic missiles or normal if not
    if(mouseIsPressed) {
        image(wizard, -60, -45, 120, 120);
    } else {
        image(wizardNoMagic, -60, -45, 120, 120);
    }

    // if the character is hit display a red overlay
    if(char.isHit === true) {
        image(wizardHurt, -60, -45, 120, 120);
    }

    // make the staff glow based on how much mana the character has
    push();
    tint(255, map(char.mana, 0, 100, 0, 180))
    image(staffGlow, -32, 4, 20, 20);
    pop();

    // reset the main character push
    pop();

    // Debugging Options
        // if debug is true, display:
    strokeWeight(2);
    if(debugMode === true) {
        stroke(255);
        line(char.x, char.y, mouseX, mouseY);
        stroke(0);
        // what direction is the character facing?
        text("Facing:" + floor(char.facing), char.x + 20, char.y + 10);
        // what are its coordinates?
        text("X:" + floor(char.x) + " Y:" + floor(char.y), char.x + 20, char.y + 20);
        // if the mouse is pressed, what's the mouse counter?
        if(mouseIsPressed) {
            text("mouseCounter:" + mouseCounter, char.x + 20, char.y + 30);
        }
        // how much mana does it have?
        text("Mana:" + char.mana, char.x + 20, char.y + 40);
        // how much health?
        text("Health:" + char.health, char.x + 20, char.y + 50);
        // is the character hit?
        text("isHit:" + char.isHit, char.x + 20, char.y + 60);
    }
}

function makeEnemy(ex, ey, cx, cy) {  // creates the enemy object
    // make a turtle at the enemy coordinates with proxy target coords
    enemy = makeTurtle(ex, ey, cx, cy);

    enemy.angle = 1;
    enemy.penUp();
    enemy.setWeight(4);
    enemy.setColor(255);

    // add 1 to total amount of enemies slain
    enemiesSlain ++;

    return enemy;
}

function enemyUpdate() { // updates the enemies' movement

    // sets local room index
    var roomIndex = roomKeys.indexOf(currentRoom);

    // set initial player collision value
    var hasBeenHit = false;

    // set initial enemies alive value
    enemiesAlive = 0;

    // go through all the enemies
    for(var i = 0; i < rooms[roomIndex].enemiesInRoom.length; i++) {
        // if the enemy is alive:
        if(rooms[roomIndex].enemiesInRoom[i].life < 100) {

            // add 1 to enemiesAlive
            enemiesAlive ++;

            // face the character using a more aggressive, snappy formula
            if (rooms[roomIndex].enemiesInRoom[i].moveMode === 0) {
                rooms[roomIndex].enemiesInRoom[i].face(degrees((atan2(
                    char.y - rooms[roomIndex].enemiesInRoom[i].y,
                    char.x - rooms[roomIndex].enemiesInRoom[i].x) + 360)% 360));
            // or use the short interesting way where enemies wander
            } else if(rooms[roomIndex].enemiesInRoom[i].moveMode === 1) {
                rooms[roomIndex].enemiesInRoom[i].right(rooms[roomIndex].enemiesInRoom[i].angleTo(char.x, char.y));
            }

            // move forward
            rooms[roomIndex].enemiesInRoom[i].forward(rooms[roomIndex].enemiesInRoom[i].speed);

            // constrain enemy movement
            rooms[roomIndex].enemiesInRoom[i].x = constrain(rooms[roomIndex].enemiesInRoom[i].x, 40, 440);
            rooms[roomIndex].enemiesInRoom[i].y = constrain(rooms[roomIndex].enemiesInRoom[i].y, 40, 440);


            // display as alive
            push();
            // make the enemy the origin
            translate(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y);
            // rotate based on its angle
            rotate(radians(rooms[roomIndex].enemiesInRoom[i].angle) - 90);
            // display the monster image
            image(skeleton, -60, -55, 120, 120);
            pop();

        } else { // if the enemy is dead
            // display as dead
            push();
            // make the enemy the origin
            translate(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y);
            // rotate based on angle
            rotate(radians(rooms[roomIndex].enemiesInRoom[i].angle) - 90);
            // display the dead monster image
            image(deadSkeleton, -60, -60, 120, 120);
            pop();
        }

        // test if missile collides
        // for all missiles:
        for(var j = 0; j < missiles.length; j++) {
            // if the enemy is less than hitRadius from the missile:
            if(dist(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y,
                    missiles[j].x, missiles[j].y) < hitRadius) {
                // add a portion of 100 based on the hitsToKill variable
                rooms[roomIndex].enemiesInRoom[i].life += 100 / hitsToKill;
                // if an enemy has less than 100 life (aka is alive):
                if(rooms[roomIndex].enemiesInRoom[i].life < 100){
                    // display the hurt skeleton
                    push();
                    // make the skeleton the origin
                    translate(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y);
                    // rotate based on enemy angle
                    rotate(radians(rooms[roomIndex].enemiesInRoom[i].angle) - 90);
                    // display the white overlay on the skeleton
                    image(skeletonHit, -60, -55, 120, 120);
                    pop();
                }
            }
        }

        // test if it hits player
        // if the enemy x and y is withing hitRadius from the character x and y:
        if(dist(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y, char.x, char.y) < hitRadius &&
                rooms[roomIndex].enemiesInRoom[i].life < 100) {
            // character health goes down by hit damage
            char.health -= hitDamage;
            // character hasBeenHit becomes true to display red overlay
            hasBeenHit = true;
        }

        // if too far away, change to aggressive move mode
        if(dist(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y, char.x, char.y) > width * 2 / 3) {
            rooms[roomIndex].enemiesInRoom[i].moveMode = 0;
        }

        // if too close, change to passive move mode
        if(dist(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y, char.x, char.y) < hitRadius) {
            rooms[roomIndex].enemiesInRoom[i].moveMode = 1;
        }

        // Debug Options
        // if debugMode is on:
        if(debugMode === true) {
            // display
            strokeWeight(1);
            stroke(255, 0, 0);
            fill(0, 0, 0, 0);
            // what is the enemy's angle?
            text("Angle:" + floor(radians(rooms[roomIndex].enemiesInRoom[i].angle)),
                 rooms[roomIndex].enemiesInRoom[i].x + 20,
                 rooms[roomIndex].enemiesInRoom[i].y + 20);
            // what is the enemy's health?
            text("Health:" + floor(rooms[roomIndex].enemiesInRoom[i].life),
                 rooms[roomIndex].enemiesInRoom[i].x + 20,
                 rooms[roomIndex].enemiesInRoom[i].y + 30);
            // what is the enemy's angle to player?
            text("angle2Player:" + floor(rooms[roomIndex].enemiesInRoom[i].angleto(char.x, char.y)),
                 rooms[roomIndex].enemiesInRoom[i].x + 20,
                 rooms[roomIndex].enemiesInRoom[i].y + 10);
            // draw an ellipse to show the hitRadius of the enemy
            ellipse(rooms[roomIndex].enemiesInRoom[i].x, rooms[roomIndex].enemiesInRoom[i].y, hitRadius * 2, hitRadius * 2);
          }
    }

    // if any enemy in the room has hit the player:
    if(hasBeenHit === true){
        // isHit is true
        char.isHit = true;
    } else {
        // isHit is false
        char.isHit = false;
    }
}

function cursorUpdate() { // replaces the mouse cursor with a new one
    // displays a custom "cursor" over the mouse position
    // since the mouse cursor is hidden in setup
    fill(0, 0, 0, 0);
    stroke(255, 0, 0);
    strokeWeight(2);
    ellipse(mouseX, mouseY, 8, 8);
}

function missileUpdate() { // updates the magic missiles

    // if the mouse is pressed and char alive, spawn a missile every interval
    if(mouseIsPressed && deathCounter === 0) {
        // increment mouseCounter, which is the number of frames the mouse has
        // been held down for
        mouseCounter++;

        // every interval of frames after (if there's mana)
        if(mouseCounter % fireInterval == 0 && char.mana > 0) {
            // push the new missile into the array
            missiles.push(makeMissile(char.x, char.y,
                                      mouseX, mouseY,
                                      char.facing));
        }
    } else { // if mouse isn't pressed, then reset the mouse counter
        mouseCounter = 0;
    }

    // for each missile:
    for(var i = 0; i < missiles.length; i++) {
        // after a certain "age" the missile will be pushed out of the array
        // increment age
        missiles[i].life++;

        // guide missile towards its target, turning more the closer it is
        missiles[i].turnToward(missiles[i].tx, missiles[i].ty,
                                   map(abs(missiles[i].angleTo(missiles[i].tx, missiles[i].ty)),
                                        200, 0, 0, 320));

        // draw the missile tail
        fill(0, 255, 255, 99);
        strokeWeight(2);
        stroke(0, 255, 255, 0.9);
        ellipse(missiles[i].x, missiles[i].y, 10, 10);

        // move missile
        missiles[i].forward(8);

        // draw the missile glow
        image(missileGlow, missiles[i].x - 60, missiles[i].y - 60, 120, 120);

        // draw missile head
        fill("White");
        strokeWeight(0);
        stroke(0, 255, 255, 0.9);
        ellipse(missiles[i].x, missiles[i].y, 5, 5);


        // cull old missiles
        if(missiles[i].life > 70) {
            missiles.shift();
        }
    }
}

function makeMissile(cx, cy, tx, ty, d) { // creates the magic missiles
    // make a turtle at the character and with the target coords
        // there's a bunch of math to make sure they come out of the
        // magic aura around his hand
    missile = makeTurtle(cx + sin((d + 247) * -1) * 40,
                         cy + cos((d + 247) * -1) * 40,
                         tx, ty);

    // add a random offset to the launch trajectory
    var offset = random(-1 * spread, spread);

    // launch the missile
    missile.right(degrees(d + offset));
    missile.penUp();

    // add 1 to total shots fired
    shotsFired ++;

    // character looses mana when a missile is shot
    char.mana -= manaLost;
    return missile;
}

function keyPressed() { // turns on debug mode when = is pressed
    // if the "=" key is pressed, which I found was 187 or 69
    if(keyCode === 187 || keyCode === 61) {
        // if debug is on, turn it off
        if (debugMode === true) {
            debugMode = false;
        // if debug is off, turn it on
        }  else {
        debugMode = true;
        }
    }

    // if spacebar is pressed at the end of the death sequence
    if(deathCounter > 800 && keyCode === 32) {
        // reset the floor
        resetFloor();
        // reset values that are not reset usually when a floor is
        fadeCounter = 120;
        deathCounter = 0;
        floorsCleared = 0;
        char.health = 100;
        enemiesSlain = 0;
        shotsFired = 0;
    }

    // if "e" is pressed while debugMode is on, spawn an enemy at the mouse
    if(keyCode === 69 && debugMode === true) {
        var roomIndex = roomKeys.indexOf(currentRoom);
        rooms[roomIndex].enemiesInRoom.push(makeEnemy(mouseX, mouseY, 0, 0));
    }

    // if ENTER is pressed while debugMode is on, set doorLimit to 1,
    // making sure the next room is the final room
    if(keyCode === ENTER && debugMode === true) {
    doorLimit = 1;
    }

    // if SHIFT is pressed while debugMode is on, increment floorsCleared
    if(keyCode === SHIFT && debugMode === true) {
    floorsCleared ++;
    }
}



// turtle code has and added "tx" and "ty", which are coordinate points
// that are used to make the magic missiles home in on the clicked location.
// also have a "Life" that tracks how many frames it's been on screen for
function turtleLeft(d){this.angle-=d;}function turtleRight(d){this.angle+=d;}
function turtleForward(p){var rad=radians(this.angle);var newx=this.x+cos(rad)*p;
var newy=this.y+sin(rad)*p;this.goto(newx,newy);}function turtleBack(p){
this.forward(-p);}function turtlePenDown(){this.penIsDown=true;}
function turtlePenUp(){this.penIsDown = false;}function turtleGoTo(x,y){
if(this.penIsDown){stroke(this.color);strokeWeight(this.weight);
line(this.x,this.y,x,y);}this.x = x;this.y = y;}function turtleDistTo(x,y){
return sqrt(sq(this.x-x)+sq(this.y-y));}function turtleAngleTo(x,y){
var absAngle=degrees(atan2(y-this.y,x-this.x));
var angle=((absAngle-this.angle)+360)%360.0;return angle;}
function turtleTurnToward(x,y,d){var angle = this.angleTo(x,y);if(angle< 180){
this.angle+=d;}else{this.angle-=d;}}function turtleSetColor(c){this.color=c;}
function turtleSetWeight(w){this.weight=w;}function turtleFace(angle){
this.angle = angle;}function makeTurtle(tx,ty,targetx,targety){var turtle={x:tx,y:ty,
angle:0.0,penIsDown:true,color:color(128),weight:1,left:turtleLeft,
right:turtleRight,forward:turtleForward, back:turtleBack,penDown:turtlePenDown,
penUp:turtlePenUp,goto:turtleGoTo, angleto:turtleAngleTo,
turnToward:turtleTurnToward,distanceTo:turtleDistTo, angleTo:turtleAngleTo,
setColor:turtleSetColor, setWeight:turtleSetWeight,face:turtleFace,
tx:targetx, ty:targety, life:0, speed:1, moveMode:0};
return turtle;}
