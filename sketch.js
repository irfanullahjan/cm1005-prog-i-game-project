/*

Final Game Project - Introduction to Programming I
Student Name: Irfanullah Jan


EXTENSIONS:

1. ADVANCED GRAPHICS

I added parallax effect by scaling the horizontal translation of different layers by different factors.
This creates an illusion that items such as collectables, canyons and the character are close and trees
are behind, mountains in distance and clouds farther away. I also added stars to the night sky which
don't move at all when the character moves because they are farthest away. The stars are randomly
generated and are pushed to an array in setup function. This ensures that the star map is generated
only once, and they stay in their place for the whole level of the game. Also dded gradient for sky.
I found it hard to make the twinkling of the stars realistic and to clean up my code into different
layers. 

WHAT I LEARNT: From the parallax feature I learnt to efficiently use objects to keep my code clean and
by generating stars, I learnt how to use a constructor function to create hundreds of objects thus
avoiding unnecessary code repetition.


2. SOUNDS

I added sounds for different actions and events such as jumping, collecting an item, destruction of the
robot. I wanted to load a background music track however, p5 would not preload a large file so I had to
give up on that one. While jump and destruction sounds were quite easy to implement, I had a hard time
perfecting the sound behavior of collecting an item. Since my collectable detection function is called
within draw loop, a single sound file was played with each frame and produced a weird echo. I came up
with a workaround to isolate the specific frame in which collectable is collected and played the sound
only once on that frame, thus fixing the issue. Instead of playing the sound in collectable_test function,
I play the sound when score goes up thus simplifying the task. There is still a minor glitch in character
moving sound and it stops playing when I press both left and right keys at the same time.

WHAT I LEARNT: From this exercise I learnt the basic idea of how sound works in a simple game and
importance of sound effects in the immersion we experience in video games.


OTHER NOTES:

1.  Changing size property for collectables, clouds and mountains changes their position on canvas as well.
Please fix 'x_pos' and 'y_pos' after you change size.

2.  Width of canyons has been set as object property and then taking that into account when testing if
character is falling into the canyon (see the function at the bottom). This significantly reduces the
chances of bugs if the project is to be developed into a real-world game.

3.  The physics is far from realistic, but I preferred to keep the project simple.

4.  Sounds used in this game are free and did require CC attribution however since the game is not going
to be distributed, I decided to not add the attribution in the game for now.

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var isLeft;
var isRight;
var isFlying;
var isPlummeting;
var rPressed;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var parallax;
var stars;

var game_score;
var lives;
var flagpole;

var jumpSound;
var destructSound;
var levelSound;
var thudSound;
var moveSound;

function preload() {
    soundFormats('mp3');
    //loading sounds to be used in the game
    jumpSound = loadSound('assets/jump.mp3');
    jumpSound.setVolume(0.5);
    destructSound = loadSound('assets/destruct.mp3');
    destructSound.setVolume(0.5);
    collectSound = loadSound('assets/collect.mp3');
    collectSound.setVolume(1);
    thudSound = loadSound('assets/thud.mp3');
    thudSound.setVolume(0.1);
    moveSound = loadSound('assets/move.mp3');
    moveSound.setVolume(0.5);
}

function setup() {
    textFont('Consolas');
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    scrollPos = 0;
    gameChar_x = 50;
    gameChar_y = floorPos_y;
    treePos_y = height / 2 - 1;
    isLeft = false;
    isRight = false;
    isFlying = 0;
    isPlummeting = false;
    clouds =
        [
            {
                x_pos: 300,
                y_pos: 50,
                size: 1
            }, {
                x_pos: 500,
                y_pos: 50,
                size: 1.5
            }

        ];
    mountains =
        [
            {
                x_pos: 700,
                y_pos: 432,
                size: 1
            }, {
                x_pos: 1400,
                y_pos: 360,
                size: 1.2
            }
        ];
    trees_x = [400, 700, 1300, 1900, 2100, 2600];
    canyons =
        [
            {
                x_pos: 180,
                size: 4
            }, {
                x_pos: 800,
                size: 5
            }, {
                x_pos: 1050,
                size: 7
            }, {
                x_pos: 1450,
                size: 8
            }, {
                x_pos: 2300,
                size: 6
            }
        ];
    collectables =
        [
            {
                x_pos: 250,
                y_pos: 380,
                size: 30,
                isFound: false
            }, {
                x_pos: 1100,
                y_pos: 360,
                size: 30,
                isFound: false
            }, {
                x_pos: 1500,
                y_pos: 340,
                size: 30,
                isFound: false
            }, {
                x_pos: 1900,
                y_pos: 340,
                size: 30,
                isFound: false
            }, {
                x_pos: 2700,
                y_pos: 360,
                size: 30,
                isFound: false
            }
        ];
    parallax =
        {
            clouds: 0.2,
            mountains: 0.6,
            trees: 0.8,
        };
    game_score = 0;
    lives = 3;
    flagpole =
        {
            isReached: false,
            x_pos: 3000
        };
    stars = [];
    for (var i = 0; i < 100; i++) {
        stars.push(
            new Star(
                random(0, width),
                random(0, height),
                random(1, 3),
                random(100, 255)
            )
        );
    }
}

function draw() {
    //Sky
    draw_sky();

    //Stars
    draw_stars();

    //Ground
    noStroke();
    fill(144, 79, 32);
    rect(0, floorPos_y, width, height - floorPos_y);

    //Parallax Layer 1
    push();
    translate(scrollPos * parallax.clouds, 0); //multiplying scrollPos by a factor to enable parallax effect
    draw_clouds();                          //draw clouds
    pop();

    //Parallax Layer 2
    push();
    translate(scrollPos * parallax.mountains, 0);
    draw_mountains();                       //draw mountains
    pop();

    //Parallac Layer 3
    push();
    translate(scrollPos * parallax.trees, 0);
    draw_trees();                           //draw trees
    pop();

    //Parallax Layer 4
    push();
    translate(scrollPos, 0);
    draw_canyons();                         //draw canyons
    //Collectables
    draw_collectables();                    //draw collectables
    collectable_test();
    //Flagpole
    draw_flagpole();
    flagpole_test();
    pop();


    ///////////INTERACTION CODE//////////
    //Put conditional statements to move the game character below here
    if (isFlying > 0) {
        isFlying -= 1;
    }

    if (gameChar_y != floorPos_y && isFlying == 0) {
        gameChar_y += 1;
    }
    else if (canyon_test(canyons)) {
        gameChar_y += 1;
    }

    //Sound when character hits the ground
    if (gameChar_y == floorPos_y - 1 && !canyon_test(canyons)) {
        thudSound.play();
    }

    //Game Score: Score is calculated by counting number of isFound properties in collectables array and then resetting it to zero before next frame
    var old_score = game_score;
    game_score = 0;
    for (var i = 0; i < collectables.length; i++) {
        if (collectables[i].isFound) {
            game_score++;
        }
    }
    if (game_score > old_score) {
        collectSound.play();
    }
    fill(255);
    textAlign(RIGHT);
    textSize(32);
    text("Score: " + game_score, width - 16, 32);


    //Lives: Character dies once it hits the spikes in canyons. This reduces lives by 1 and resets character position to start.
    fill(255);
    textAlign(LEFT);
    textSize(32);
    text("Lives: " + lives, 10, 32);
    if (gameChar_y > 535 && lives > 1) {
        lives--;
        scrollPos = 0;
        gameChar_x = 50;
        gameChar_y = floorPos_y;
        destructSound.play();
    }
    else if (gameChar_y > 535 && lives == 1) {
        lives--;
        destructSound.play();
    }
    else if (lives == 0) {
        textAlign(CENTER);
        fill(200, 0, 0);
        textSize(96);
        text('GAME OVER', width / 2, height / 2);
        textSize(32);
        text('Press R to restart the game.', width / 2, height / 2 + 100);
        if (rPressed) {
            gameReset();
            rPressed = false;
        }
    }

    //Character

    //hacky fix to disable left or right movement once character falls into a canyon
    if (gameChar_y > floorPos_y + 10) {
        isLeft = false;
        isRight = false;
    }

    //various character moves
    if (isLeft && isFlying > 0) {
        gameChar_y -= 3;
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 3;
        }
        else {
            scrollPos += 3;
        }
        character_jumping_left();
    }
    else if (isRight && isFlying > 0) {
        gameChar_y -= 3;
        if (gameChar_x < width * 0.5) {
            gameChar_x += 3;
        }
        else {
            scrollPos -= 3; // negative for moving against the background
        }
        character_jumping_right();
    }
    else if (isLeft) {
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 3;
        }
        else {
            scrollPos += 3;
        }
        character_face_left();
    }
    else if (isRight) {
        if (gameChar_x < width * 0.5) {
            gameChar_x += 3;
        }
        else {
            scrollPos -= 3; // negative for moving against the background
        }
        character_face_right();

    }
    else if (isFlying > 0) {
        gameChar_y -= 3;
        character_face_forward_jump();
    }
    else {
        character_face_forward();
    }

}


function keyPressed() {

    // if statements to control the movement of the character when
    // keys are pressed.

    if ((key == 'A' || keyCode == 37) && gameChar_y <= floorPos_y) {
        isLeft = true;
        moveSound.loop();
    }

    if ((keyCode == 32 || keyCode == 38) && gameChar_y == floorPos_y) {
        isFlying = 20;
        jumpSound.play();
    }

    if ((key == 'D' || keyCode == 39) && gameChar_y <= floorPos_y) {
        isRight = true;
        moveSound.loop();
    }
    if (key == 'R') {
        rPressed = true;
    }
}

function keyReleased() {
    // if statements to control the animation of the character when
    // keys are released.

    if (key == 'A' || keyCode == 37) {
        isLeft = false;
        moveSound.stop();
    }

    if (key == 'D' || keyCode == 39) {
        isRight = false;
        moveSound.stop();
    }

}

/////OTHER FUNCTIONS/////

//Draw sky
function draw_sky() {
    //colors for linear gradient
    var color1 = [25, 50, 150];
    var color2 = [5, 10, 30];
    //horizontal lines to generate gradient for sky
    for (var i = 0; i < height; i++) {
        var weight1 = i;
        var weight2 = height - i;
        var total = weight1 + weight2;
        var r = color1[0] * weight1 / total + color2[0] * weight2 / total;
        var g = color1[1] * weight1 / total + color2[1] * weight2 / total;
        var b = color1[2] * weight1 / total + color2[2] * weight2 / total;
        stroke(r, g, b);
        noFill();
        strokeWeight(1);
        line(0, i, width, i);
    }
}

//Draw stars
function draw_stars() {
    for (var i = 0; i < stars.length; i++) {
        noStroke();
        fill(random(stars[i].twinkle, 255));
        ellipse(stars[i].x, stars[i].y, stars[i].size);
    }
}

//Draw clouds
function draw_clouds() {
    for (var i = 0; i < clouds.length; i++) {
        fill(150);
        push(); //push() and pop() keep scale() from affecting other shapes
        scale(clouds[i].size);
        beginShape();
        rect(clouds[i].x_pos, clouds[i].y_pos, 100, 40);
        ellipse(clouds[i].x_pos, clouds[i].y_pos + 20, 40, 40);
        ellipse(clouds[i].x_pos + 100, clouds[i].y_pos + 20, 40, 40);
        ellipse(clouds[i].x_pos + 30, clouds[i].y_pos, 50, 50);
        ellipse(clouds[i].x_pos + 70, clouds[i].y_pos, 70, 70);
        endShape();
        pop();
    }
}

//Draw mountains
function draw_mountains() {
    for (var i = 0; i < mountains.length; i++) {
        fill(30, 30, 50);
        push(); //push() and pop() keep scale() from affecting other shapes
        scale(mountains[i].size);
        beginShape();
        triangle(mountains[i].x_pos, mountains[i].y_pos - 232, mountains[i].x_pos - 250, mountains[i].y_pos, mountains[i].x_pos + 250, mountains[i].y_pos);
        triangle(mountains[i].x_pos - 150, mountains[i].y_pos - 232, mountains[i].x_pos - 400, mountains[i].y_pos, mountains[i].x_pos + 200, mountains[i].y_pos);
        endShape(CLOSE);
        pop();
    }
}

//Draw trees
function draw_trees() {
    for (var i = 0; i < trees_x.length; i++) {
        fill(60, 35, 25);
        rect(trees_x[i], treePos_y, 50, 145);
        fill(10, 60, 10);
        triangle(trees_x[i] - 50, treePos_y + 50, trees_x[i] + 100, treePos_y + 50, trees_x[i] + 25, treePos_y - 50);
        triangle(trees_x[i] - 50, treePos_y, trees_x[i] + 100, treePos_y, trees_x[i] + 25, treePos_y - 100);
        triangle(trees_x[i] - 50, treePos_y - 50, trees_x[i] + 100, treePos_y - 50, trees_x[i] + 25, treePos_y - 150);
    }
}

//Draw canyons
function draw_canyons() {
    for (var i = 0; i < canyons.length; i++) {
        fill(10, 25, 50);
        rect(canyons[i].x_pos, floorPos_y, canyons[i].size * 20, 150);
        fill(150, 0, 0);
        beginShape(); //hazards in canyon
        vertex(canyons[i].x_pos, height);
        for (var j = 0; j < canyons[i].size; j++) {
            vertex(canyons[i].x_pos + (j + 1) * 20 - 10, height - 50);
            vertex(canyons[i].x_pos + (j + 1) * 20, height);
        }
        endShape(CLOSE);
    }
}

//Draw collectables
function draw_collectables() {
    for (var i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound) {
            //collectable
            fill(160, 160, 0);
            ellipse(collectables[i].x_pos - collectables[i].size * 0.65, collectables[i].y_pos, collectables[i].size, collectables[i].size);
            ellipse(collectables[i].x_pos + collectables[i].size * 0.65, collectables[i].y_pos, collectables[i].size, collectables[i].size);
            ellipse(collectables[i].x_pos, collectables[i].y_pos - collectables[i].size * 0.65, collectables[i].size, collectables[i].size);
            ellipse(collectables[i].x_pos, collectables[i].y_pos + collectables[i].size * 0.65, collectables[i].size, collectables[i].size);
            fill(0);
            ellipse(collectables[i].x_pos, collectables[i].y_pos, collectables[i].size, collectables[i].size);
        }
    }
}

//Canyon Test: Checks if character has entered a canyon
function canyon_test(canyons) {
    for (var i = 0; i < canyons.length; i++) {
        if (gameChar_x > canyons[i].x_pos + scrollPos && gameChar_x < canyons[i].x_pos + scrollPos + canyons[i].size * 20) {
            return true;
        }
    }
}

//Collectable Test: Checks if character has collected a collectable
function collectable_test() {
    for (var i = 0; i < collectables.length; i++) {
        if (dist(gameChar_x, gameChar_y, collectables[i].x_pos + scrollPos, collectables[i].y_pos) < 60) {
            collectables[i].isFound = true;
        }
    }
}

//Draw flagpole
function draw_flagpole() {
    stroke(200);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    noStroke();
    if (flagpole.isReached) {
        fill(0, 155, 0);
        rect(flagpole.x_pos, floorPos_y - 160, 50, -40);
        textAlign(CENTER);
        fill(0, 155, 0);
        textSize(64);
        text('LEVEL COMPLETE', flagpole.x_pos, height / 2 - 100);
    } else {
        fill(255, 255, 0);
        rect(flagpole.x_pos, floorPos_y, 50, -40);
    }
}

//Raises flag on completion of level
function flagpole_test() {
    if (gameChar_x + 50 > flagpole.x_pos + scrollPos) {
        flagpole.isReached = true;
    }
}

//Resets game: resets lives, character position and puts all collectables back on map.
function gameReset() {
    for (var i = 0; i < collectables.length; i++) {
        collectables[i].isFound = false;
    }
    lives = 3;
    scrollPos = 0;
    gameChar_x = 50;
    gameChar_y = floorPos_y;
    flagpole.isReached = false;
}

//Stars constructur
function Star(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.twinkle = random(0, 255);
    if (size > 2.5) {
        this.twinkle = 255; //this disables twinkling of large stars
    }

}

//CHARACTER MODELS

//character main shell (inner body). this is used in functions below to reduce code repetition.
function character_shell() {
    fill(180)
    beginShape();
    vertex(gameChar_x - 15, gameChar_y - 46);
    vertex(gameChar_x + 15, gameChar_y - 46);
    vertex(gameChar_x + 15, gameChar_y - 9);
    vertex(gameChar_x + 6, gameChar_y);
    vertex(gameChar_x - 6, gameChar_y);
    vertex(gameChar_x - 15, gameChar_y - 9);
    endShape(CLOSE);
}

//face forward
function character_face_forward() {
    fill(90);
    beginShape();
    vertex(gameChar_x - 18, gameChar_y - 40);
    vertex(gameChar_x + 18, gameChar_y - 40);
    vertex(gameChar_x + 21, gameChar_y - 37);
    vertex(gameChar_x + 21, gameChar_y - 9);
    vertex(gameChar_x + 24, gameChar_y);
    vertex(gameChar_x + 24, gameChar_y + 2);
    vertex(gameChar_x + 12, gameChar_y + 2);
    vertex(gameChar_x + 12, gameChar_y);
    vertex(gameChar_x + 16, gameChar_y - 9);
    vertex(gameChar_x + 16, gameChar_y - 30);
    vertex(gameChar_x - 16, gameChar_y - 30);
    vertex(gameChar_x - 16, gameChar_y - 9);
    vertex(gameChar_x - 12, gameChar_y);
    vertex(gameChar_x - 12, gameChar_y + 2);
    vertex(gameChar_x - 24, gameChar_y + 2);
    vertex(gameChar_x - 24, gameChar_y);
    vertex(gameChar_x - 21, gameChar_y - 9);
    vertex(gameChar_x - 21, gameChar_y - 37);
    endShape(CLOSE);
    ellipse(gameChar_x, gameChar_y - 46, 30, 30);
    fill(20);
    ellipse(gameChar_x + 5, gameChar_y - 50, 4, 4);
    ellipse(gameChar_x - 5, gameChar_y - 50, 4, 4);
    character_shell();
}

//jumping with face forward
function character_face_forward_jump() {
    //boosters flames front view
    fill(253, 207, 88);
    ellipse(gameChar_x - 18, gameChar_y + 5, 9, 25);
    fill(242, 145, 32);
    ellipse(gameChar_x - 18, gameChar_y + 5, 5, 19);
    fill(255, 244, 0);
    ellipse(gameChar_x - 18, gameChar_y + 5, 2, 13);
    fill(253, 207, 88);
    ellipse(gameChar_x + 18, gameChar_y + 5, 9, 25);
    fill(242, 145, 32);
    ellipse(gameChar_x + 18, gameChar_y + 5, 5, 19);
    fill(255, 244, 0);
    ellipse(gameChar_x + 18, gameChar_y + 5, 2, 13);
    character_face_forward();
}

//side view without eyes. this is used within functions below to reduce code repetition.
function character_side_view() {
    character_shell();
    fill(90);
    beginShape();
    vertex(gameChar_x - 5, gameChar_y - 40);
    vertex(gameChar_x + 5, gameChar_y - 40);
    vertex(gameChar_x + 7, gameChar_y - 37);
    vertex(gameChar_x + 7, gameChar_y - 9);
    vertex(gameChar_x + 10, gameChar_y);
    vertex(gameChar_x + 10, gameChar_y + 2);
    vertex(gameChar_x - 10, gameChar_y + 2);
    vertex(gameChar_x - 10, gameChar_y);
    vertex(gameChar_x - 7, gameChar_y - 9);
    vertex(gameChar_x - 7, gameChar_y - 37);
    endShape(CLOSE);
}

//face right
function character_face_right() {
    //side view of eye facing right
    fill(90);
    ellipse(gameChar_x, gameChar_y - 46, 30, 30);
    fill(20);
    ellipse(gameChar_x + 10, gameChar_y - 50, 3, 4);
    character_side_view();
}

//face left
function character_face_left() {
    //side view of eye facing left
    fill(90);
    ellipse(gameChar_x, gameChar_y - 46, 30, 30);
    fill(20);
    ellipse(gameChar_x - 10, gameChar_y - 50, 3, 4);
    character_side_view();
}

//this function is used in left and right jump view below
function character_rocket_flame_sideview() {
    fill(253, 207, 88);
    ellipse(gameChar_x, gameChar_y, 16, 30);
    fill(242, 145, 32);
    ellipse(gameChar_x, gameChar_y, 10, 24);
    fill(255, 244, 0);
    ellipse(gameChar_x, gameChar_y, 6, 18);
}

function character_jumping_right() {
    //jumping-right
    character_rocket_flame_sideview();
    character_face_right();
}

function character_jumping_left() {
    //jumping-left
    character_rocket_flame_sideview();
    character_face_left();
}