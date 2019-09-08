/*

Final Game Project - Introduction to Programming I

Week 20


EXTENSIONS:

1. Advanced Graphics
I added parallax effect by scaling the horizontal translation of different layers by different factors. This creates an illusion that items such as collectables, canyons and the character are close and trees are behind, moutains in distance and clouds the farthest away.



2. Sound
I added sounds for different actions and events such as jumping, collecting an item, destruction of the robot. I wanted to load a background music track however, p5 would not preload a large file so I had to give up on that once. While jump and destruction sounds were quite easy to implement, I had a hard time perfecting the sound behavor of collecting an item. Since my collectable detection function is called with in draw loop, single sound file was played with each frame and produced wiered echo. I came up with a workaround to detech the specific frame in which collecable is collected and played the sound only on that frame, thus fixing the issue. Instead of playing the sound in collectable_test function, I play the sound when score goes up thus simplifying the problem.


OTHER NOTES:

1.  Changing size property for collectables, clouds and mountains changes their position on canvas as well. Please fix 'x_pos' and 'y_pos' after you change size.

2.  Width of canyons can also be set as object property and then taking that into account when testing if character is falling into the canyon (see the function at the bottom). This will significantly reduce the chances of bugs if the project is to be developed into a real-world game. However, this was beyond the scope of this assignment. Similarly, tree sizes may also be set as object property.

3.  The physics is far from realistic, but I preferred to keep the project simple.

4. I deliberately moved interactive objects (i.e. collectables and canyons) outside push() pop(). This was because translating these objects with the scenery only moved the objects visibly however their position property remaining static relative to the window. I fixed this by manually changing the position properties whenever the scenery moved.


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

var game_score;
var lives;
var flagpole;

var parallax;

var jumpSound;
var destructSound;
var levelSound;
var thudSound;
var moveSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
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

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    scrollPos = 0;
	gameChar_x = 50;
	gameChar_y = floorPos_y;
    treePos_y = height/2 - 1;
    isLeft = false;
    isRight = false;
    isFlying = 0;
    isPlummeting = false;
    clouds = [
        {
            x_pos: 300,
            y_pos:50,
            size: 1 
        },{
            x_pos: 500,
            y_pos:50,
            size: 1.5 
        }
        
    ];
    mountains = [
        {
            x_pos: 300,
            y_pos:432,
            size: 1
        },{
            x_pos: 1400,
            y_pos:360,
            size: 1.2
        }
    ];
    trees_x = [400,700,1300,1900,2100,2600];
    canyons = [
        {
            x_pos: 180,
            size: 4
        },{
            x_pos: 800,
            size: 5
        },{
            x_pos: 1050,
            size: 7
        },{
            x_pos: 1450,
            size: 8
        },{
            x_pos: 2300,
            size: 6
        }
    ];
    collectables = [
        {
            x_pos: 250,
            y_pos: 380,
            size: 30,
            isFound: false
        },{
            x_pos: 1100,
            y_pos: 360,
            size: 30,
            isFound: false
        },{
            x_pos: 1500,
            y_pos: 340,
            size: 30,
            isFound: false
        },{
            x_pos: 1900,
            y_pos: 340,
            size: 30,
            isFound: false
        },{
            x_pos: 2700,
            y_pos: 360,
            size: 30,
            isFound: false
        }
    ];
    parallax = {
        clouds: 0.3,
        mountains: 0.6,
        trees: 0.8,
    };
    game_score = 0;
    lives = 3;
    flagpole = {
        isReached: false,
        x_pos: 3000
    };
}

function draw()
{

	///////////DRAWING CODE//////////

	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
    
    push();
    translate(scrollPos*parallax.clouds,0); //multiplying scrollPos by a factor to enable parallax effect
    //Draw clouds
    for (var i = 0; i < clouds.length; i++)
    {
        fill(255);
        push();
        scale(clouds[i].size);
        beginShape();
        rect(clouds[i].x_pos,clouds[i].y_pos,100,40);
        ellipse(clouds[i].x_pos,clouds[i].y_pos+20,40,40);
        ellipse(clouds[i].x_pos+100,clouds[i].y_pos+20,40,40);
        ellipse(clouds[i].x_pos+30,clouds[i].y_pos,50,50);
        ellipse(clouds[i].x_pos+70,clouds[i].y_pos,70,70);
        endShape();
        pop(); //push() and pop() keep scale() from affecting other shapes
    }
    pop();
    
    push();
    translate(scrollPos*parallax.mountains,0);
    //Mountains
    for (var i = 0; i < mountains.length; i++)
    {
        fill(80,90,120);
        push();
        scale(mountains[i].size);
        beginShape();
        triangle(mountains[i].x_pos,mountains[i].y_pos-232,mountains[i].x_pos-250,mountains[i].y_pos,mountains[i].x_pos+250,mountains[i].y_pos);
        triangle(mountains[i].x_pos-150,mountains[i].y_pos-232,mountains[i].x_pos-400,mountains[i].y_pos,mountains[i].x_pos+200,mountains[i].y_pos);
        endShape(CLOSE);
        pop();
    }
    pop();
    
    push();
    translate(scrollPos*parallax.trees,0);
    //Trees
    for (var i = 0; i < trees_x.length; i++)
    {
        fill(130,90,50);
        rect(trees_x[i],treePos_y,50,145);
        fill(34,139,34);
        triangle(trees_x[i]-50,treePos_y+50,trees_x[i]+100,treePos_y+50,trees_x[i]+25,treePos_y-50);
        triangle(trees_x[i]-50,treePos_y,trees_x[i]+100,treePos_y,trees_x[i]+25,treePos_y-100);
        triangle(trees_x[i]-50,treePos_y-50,trees_x[i]+100,treePos_y-50,trees_x[i]+25,treePos_y-150);
    }
    pop();
    
    push();
    translate(scrollPos,0);
	//Canyons
    for (var i = 0; i < canyons.length; i++)
    {
        fill(44,34,28);
        rect(canyons[i].x_pos,floorPos_y,canyons[i].size*20,150);
        fill(150,0,0);
        beginShape(); //hazards in canyon
        vertex(canyons[i].x_pos,height);
        for (var j = 0; j < canyons[i].size; j++)
        {
            vertex(canyons[i].x_pos+(j+1)*20-10,height-50);
            vertex(canyons[i].x_pos+(j+1)*20,height);
        }
        endShape(CLOSE);
    }
    //Collectables
    for (var i = 0; i < collectables.length; i++)
    {
        collectable_test(i);
        if (!collectables[i].isFound) 
        {
        //collectable
            fill(220,220,0);
            ellipse(collectables[i].x_pos-collectables[i].size*0.65,collectables[i].y_pos,collectables[i].size,collectables[i].size);
            ellipse(collectables[i].x_pos+collectables[i].size*0.65,collectables[i].y_pos,collectables[i].size,collectables[i].size);
            ellipse(collectables[i].x_pos,collectables[i].y_pos-collectables[i].size*0.65,collectables[i].size,collectables[i].size);
            ellipse(collectables[i].x_pos,collectables[i].y_pos+collectables[i].size*0.65,collectables[i].size,collectables[i].size);
            fill(0);
            ellipse(collectables[i].x_pos,collectables[i].y_pos,collectables[i].size,collectables[i].size);
        }
    }
    //Flagpole
    flagpole_render();
    flagpole_test();
    
    pop();
    

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
    if (isFlying > 0)
    {
        isFlying -= 1;
    }
    
    if (gameChar_y != floorPos_y && isFlying == 0)
    {
        gameChar_y += 1;
    } else if   (canyon_test(canyons))
    {
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
    fill(27,26,101);
    textAlign(LEFT);
    textSize(32);
    text("Score: "+game_score, 10, 32);
    
    
    //Lives: Character dies once it hits the spikes in canyons. This reduces lives by 1 and resets character position to start.
    fill(27,26,101);
    textSize(32);
    text("Lives: "+lives, 10, 64);
    if (gameChar_y > 535 && lives > 1)
    {
        lives--;
        scrollPos = 0;
        gameChar_x = 50;
	    gameChar_y = floorPos_y;
        destructSound.play();
    } else if (gameChar_y > 535 && lives == 1) {
        lives--;
        destructSound.play();
    } else if (lives == 0) {
        textAlign(CENTER);
        fill(200,0,0);
        textSize(96);
        text('GAME OVER', width/2, height/2);
        textSize(32);
        text('Press R to restart the game.', width/2, height/2+100);
        if (rPressed) {
            gameReset();
            rPressed = false;
        }
    }

	//Character
    
    //hacky fix to disable left or right movement once character falls into a canyon
    if (gameChar_y > floorPos_y + 10)
    {
        isLeft = false;
        isRight = false;
    }
    
    //various character positions
	if(isLeft && isFlying > 0)
	{
        gameChar_y -= 3;
        if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
		//jumping-left
        fill(253,207,88);
        ellipse(gameChar_x,gameChar_y,16,30);
        fill(242,145,32);
        ellipse(gameChar_x,gameChar_y,10,24);
        fill(255,244,0);
        ellipse(gameChar_x,gameChar_y,6,18);
        fill(27,26,101);
        ellipse(gameChar_x,gameChar_y-46,30,30);
        fill(180);
        ellipse(gameChar_x-10,gameChar_y-50,3,4);
        beginShape();
        vertex(gameChar_x-15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-9);
        vertex(gameChar_x+6,gameChar_y);
        vertex(gameChar_x-6,gameChar_y);
        vertex(gameChar_x-15,gameChar_y-9);
        endShape(CLOSE);
        fill(27,26,101);
        beginShape();
        vertex(gameChar_x-5,gameChar_y-40);
        vertex(gameChar_x+5,gameChar_y-40);
        vertex(gameChar_x+7,gameChar_y-37);
        vertex(gameChar_x+7,gameChar_y-9);
        vertex(gameChar_x+10,gameChar_y);
        vertex(gameChar_x+10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y);
        vertex(gameChar_x-7,gameChar_y-9);
        vertex(gameChar_x-7,gameChar_y-37);
        endShape(CLOSE);

	}
	else if(isRight && isFlying > 0)
	{
        gameChar_y -= 3;
        if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
		//jumping-right
        fill(253,207,88);
        ellipse(gameChar_x,gameChar_y,16,30);
        fill(242,145,32);
        ellipse(gameChar_x,gameChar_y,10,24);
        fill(255,244,0);
        ellipse(gameChar_x,gameChar_y,6,18);
        fill(27,26,101);
        ellipse(gameChar_x,gameChar_y-46,30,30);
        fill(180);
        ellipse(gameChar_x+10,gameChar_y-50,3,4);
        beginShape();
        vertex(gameChar_x-15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-9);
        vertex(gameChar_x+6,gameChar_y);
        vertex(gameChar_x-6,gameChar_y);
        vertex(gameChar_x-15,gameChar_y-9);
        endShape(CLOSE);
        fill(27,26,101);
        beginShape();
        vertex(gameChar_x-5,gameChar_y-40);
        vertex(gameChar_x+5,gameChar_y-40);
        vertex(gameChar_x+7,gameChar_y-37);
        vertex(gameChar_x+7,gameChar_y-9);
        vertex(gameChar_x+10,gameChar_y);
        vertex(gameChar_x+10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y);
        vertex(gameChar_x-7,gameChar_y-9);
        vertex(gameChar_x-7,gameChar_y-37);
        endShape(CLOSE);
	}
	else if(isLeft)
	{
        if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
		//walking left
        fill(27,26,101);
        ellipse(gameChar_x,gameChar_y-46,30,30);
        fill(180);
        ellipse(gameChar_x-10,gameChar_y-50,3,4);
        beginShape();
        vertex(gameChar_x-15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-9);
        vertex(gameChar_x+6,gameChar_y);
        vertex(gameChar_x-6,gameChar_y);
        vertex(gameChar_x-15,gameChar_y-9);
        endShape(CLOSE);
        fill(27,26,101);
        beginShape();
        vertex(gameChar_x-5,gameChar_y-40);
        vertex(gameChar_x+5,gameChar_y-40);
        vertex(gameChar_x+7,gameChar_y-37);
        vertex(gameChar_x+7,gameChar_y-9);
        vertex(gameChar_x+10,gameChar_y);
        vertex(gameChar_x+10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y);
        vertex(gameChar_x-7,gameChar_y-9);
        vertex(gameChar_x-7,gameChar_y-37);
        endShape(CLOSE);

	}
	else if(isRight)
	{
        if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
		//walking right
        fill(27,26,101);
        ellipse(gameChar_x,gameChar_y-46,30,30);
        fill(180);
        ellipse(gameChar_x+10,gameChar_y-50,3,4);
        beginShape();
        vertex(gameChar_x-15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-9);
        vertex(gameChar_x+6,gameChar_y);
        vertex(gameChar_x-6,gameChar_y);
        vertex(gameChar_x-15,gameChar_y-9);
        endShape(CLOSE);
        fill(27,26,101);
        beginShape();
        vertex(gameChar_x-5,gameChar_y-40);
        vertex(gameChar_x+5,gameChar_y-40);
        vertex(gameChar_x+7,gameChar_y-37);
        vertex(gameChar_x+7,gameChar_y-9);
        vertex(gameChar_x+10,gameChar_y);
        vertex(gameChar_x+10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y);
        vertex(gameChar_x-7,gameChar_y-9);
        vertex(gameChar_x-7,gameChar_y-37);
        endShape(CLOSE);

	}
	else if(isFlying > 0)
	{
        gameChar_y -= 3;
		//jumping facing forwards
        fill(253,207,88);
        ellipse(gameChar_x-18,gameChar_y+5,9,25);
        fill(242,145,32);
        ellipse(gameChar_x-18,gameChar_y+5,5,19);
        fill(255,244,0);
        ellipse(gameChar_x-18,gameChar_y+5,2,13);
        fill(253,207,88);
        ellipse(gameChar_x+18,gameChar_y+5,9,25);
        fill(242,145,32);
        ellipse(gameChar_x+18,gameChar_y+5,5,19);
        fill(255,244,0);
        ellipse(gameChar_x+18,gameChar_y+5,2,13);
        fill(27,26,101);
        beginShape();
        vertex(gameChar_x-18,gameChar_y-40);
        vertex(gameChar_x+18,gameChar_y-40);
        vertex(gameChar_x+21,gameChar_y-37);
        vertex(gameChar_x+21,gameChar_y-9);
        vertex(gameChar_x+24,gameChar_y);
        vertex(gameChar_x+24,gameChar_y+2);
        vertex(gameChar_x+12,gameChar_y+2);
        vertex(gameChar_x+12,gameChar_y);
        vertex(gameChar_x+16,gameChar_y-9);
        vertex(gameChar_x+16,gameChar_y-30);
        vertex(gameChar_x-16,gameChar_y-30);
        vertex(gameChar_x-16,gameChar_y-9);
        vertex(gameChar_x-12,gameChar_y);
        vertex(gameChar_x-12,gameChar_y+2);
        vertex(gameChar_x-24,gameChar_y+2);
        vertex(gameChar_x-24,gameChar_y);
        vertex(gameChar_x-21,gameChar_y-9);
        vertex(gameChar_x-21,gameChar_y-37);
        endShape(CLOSE);
        ellipse(gameChar_x,gameChar_y-46,30,30);
        fill(180);
        ellipse(gameChar_x+5,gameChar_y-50,4,4);
        ellipse(gameChar_x-5,gameChar_y-50,4,4);
        beginShape();
        vertex(gameChar_x-15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-9);
        vertex(gameChar_x+6,gameChar_y);
        vertex(gameChar_x-6,gameChar_y);
        vertex(gameChar_x-15,gameChar_y-9);
        endShape(CLOSE);
	}
	else
	{
        // facing forwards
	    fill(27,26,101);
        beginShape();
        vertex(gameChar_x-18,gameChar_y-40);
        vertex(gameChar_x+18,gameChar_y-40);
        vertex(gameChar_x+21,gameChar_y-37);
        vertex(gameChar_x+21,gameChar_y-9);
        vertex(gameChar_x+24,gameChar_y);
        vertex(gameChar_x+24,gameChar_y+2);
        vertex(gameChar_x+12,gameChar_y+2);
        vertex(gameChar_x+12,gameChar_y);
        vertex(gameChar_x+16,gameChar_y-9);
        vertex(gameChar_x+16,gameChar_y-30);
        vertex(gameChar_x-16,gameChar_y-30);
        vertex(gameChar_x-16,gameChar_y-9);
        vertex(gameChar_x-12,gameChar_y);
        vertex(gameChar_x-12,gameChar_y+2);
        vertex(gameChar_x-24,gameChar_y+2);
        vertex(gameChar_x-24,gameChar_y);
        vertex(gameChar_x-21,gameChar_y-9);
        vertex(gameChar_x-21,gameChar_y-37);
        endShape(CLOSE);
        ellipse(gameChar_x,gameChar_y-46,30,30);
        fill(180);
        ellipse(gameChar_x+5,gameChar_y-50,4,4);
        ellipse(gameChar_x-5,gameChar_y-50,4,4);
        beginShape();
        vertex(gameChar_x-15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-46);
        vertex(gameChar_x+15,gameChar_y-9);
        vertex(gameChar_x+6,gameChar_y);
        vertex(gameChar_x-6,gameChar_y);
        vertex(gameChar_x-15,gameChar_y-9);
        endShape(CLOSE);
	}

}


function keyPressed()
{

	// if statements to control the movement of the character when
	// keys are pressed.
    
    if ((key == 'A' || keyCode == 37) && gameChar_y <= floorPos_y)
    {
        isLeft = true;
        moveSound.loop();
    }
    
    if ((keyCode == 32 || keyCode == 38) && gameChar_y == floorPos_y)
    {
        isFlying = 20;
        jumpSound.play();
    }
    
    if ((key == 'D' || keyCode == 39) && gameChar_y <= floorPos_y)
    {
        isRight = true;
        moveSound.loop();
    }
    if (key == 'R') {
        rPressed = true;
    }
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

    if (key == 'A' || keyCode == 37)
    {
        isLeft = false;
        moveSound.stop();
    }
    
    if (key == 'D' || keyCode == 39)
    {
        isRight = false;
        moveSound.stop();
    }

}

/////OTHER FUNCTIONS/////

//Canyon Test: Checks if character has entered a canyon
function canyon_test(canyons) {
    for (var i = 0; i < canyons.length; i++)
    {
        if (gameChar_x > canyons[i].x_pos + scrollPos && gameChar_x < canyons[i].x_pos + scrollPos + canyons[i].size*20)
        {
            return true;
        }
    }
}

//Collectable Test: Checks if character has collected a collectable
function collectable_test(i) {
    if (dist(gameChar_x,gameChar_y,collectables[i].x_pos+scrollPos,collectables[i].y_pos) < 60)
    {
        collectables[i].isFound = true;
    }
}

//Flagpole renderer
function flagpole_render() {
    stroke(200);
    strokeWeight(5);
    line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y-200);
    noStroke();
    if (flagpole.isReached) {
        fill(0,155,0);
        rect(flagpole.x_pos,floorPos_y-160,50,-40);
        textAlign(CENTER);
        fill(0,155,0);
        textSize(64);
        text('LEVEL COMPLETE', flagpole.x_pos, height/2-100);
    } else {
        fill(255,255,0);
        rect(flagpole.x_pos,floorPos_y,50,-40);
    } 
}

//Raises flag on completion of level
function flagpole_test() {
    if (gameChar_x + 50 > flagpole.x_pos + scrollPos)
    {
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