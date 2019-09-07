/*

Coursework 1.2 Game Project 

Week 10

NOTES:

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

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;

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
            y_pos: 580
        },{
            x_pos: 900,
            y_pos: 580
        },{
            x_pos: 1250,
            y_pos: 580
        },{
            x_pos: 1450,
            y_pos: 580
        },{
            x_pos: 2300,
            y_pos: 580
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
    game_score = 0;
}

function draw()
{

	///////////DRAWING CODE//////////

	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
    
    push();
    translate(scrollPos*0.4,0); //multiplying scrollPos by a factor to enable parallax effect
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
    translate(scrollPos*0.7,0);
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
    translate(scrollPos*0.9,0);
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
    
	//Canyons
    for (var i = 0; i < canyons.length; i++)
    {
        fill(94,74,58);
        rect(canyons[i].x_pos,canyons[i].y_pos,100,-148);
        fill(150,0,0);
        beginShape(); //hazards in canyon
        vertex(canyons[i].x_pos,canyons[i].y_pos);
        vertex(canyons[i].x_pos+10,canyons[i].y_pos-50);
        vertex(canyons[i].x_pos+20,canyons[i].y_pos);
        vertex(canyons[i].x_pos+30,canyons[i].y_pos-50);
        vertex(canyons[i].x_pos+40,canyons[i].y_pos);
        vertex(canyons[i].x_pos+50,canyons[i].y_pos-50);
        vertex(canyons[i].x_pos+60,canyons[i].y_pos);
        vertex(canyons[i].x_pos+70,canyons[i].y_pos-50);
        vertex(canyons[i].x_pos+80,canyons[i].y_pos);
        vertex(canyons[i].x_pos+90,canyons[i].y_pos-50);
        vertex(canyons[i].x_pos+100,canyons[i].y_pos);
        endShape(CLOSE);
    }    
    
    //Game Score: Score is calculated by counting number of isFound properties in collectables array and then resetting it to zero before next frame
    for (var i = 0; i < collectables.length; i++) {
        if (collectables[i].isFound) {
            game_score++;
        }
    }
    fill(27,26,101);
    textSize(64);
    text(game_score, 10, 60);
    game_score = 0;
    
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
    

	//Character
    
    //hacky fix to disable left or right movement once character falls into a canyon
    if (gameChar_y > floorPos_y + 10)
    {
        isLeft = false;
        isRight = false;
    }
    
    //varios character positions
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
            for (var i = 0; i < collectables.length; i++)
            {
                collectables[i].x_pos += 3
            }
            for (var i = 0; i < canyons.length; i++)
            {
                canyons[i].x_pos += 3
            }
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
            for (var i = 0; i < collectables.length; i++)
            {
                collectables[i].x_pos -= 3
            }
            for (var i = 0; i < canyons.length; i++)
            {
                canyons[i].x_pos -= 3
            }
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
            for (var i = 0; i < collectables.length; i++)
            {
                collectables[i].x_pos += 3
            }
            for (var i = 0; i < canyons.length; i++)
            {
                canyons[i].x_pos += 3
            }
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
            for (var i = 0; i < collectables.length; i++)
            {
                collectables[i].x_pos -= 3
            }
            for (var i = 0; i < canyons.length; i++)
            {
                canyons[i].x_pos -= 3
            }
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
    }
    
    if ((keyCode == 32 || keyCode == 38) && gameChar_y == floorPos_y)
    {
        isFlying = 20;
    }
    
    if ((key == 'D' || keyCode == 39) && gameChar_y <= floorPos_y)
    {
        isRight = true;
    }

}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

    if (key == 'A' || keyCode == 37)
    {
        isLeft = false;
    }
    
    if (key == 'D' || keyCode == 39)
    {
        isRight = false;
    }

}

/////OTHER FUNCTIONS/////

//Canyon Test: Checks if character has entered a canyon
function canyon_test(canyons) {
    for (var i = 0; i < canyons.length; i++)
    {
        if (gameChar_x > canyons[i].x_pos && gameChar_x < canyons[i].x_pos + 100)
        {
            return true;
        }
    }
}
//Collectable Test: Checks if character has collected a collectable
function collectable_test(i) {
    if (dist(gameChar_x,gameChar_y,collectables[i].x_pos,collectables[i].y_pos) < 60)
    {
        collectables[i].isFound = true;
    }
}