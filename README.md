### The Game Project 3 – Game interaction

Now to add some proper interaction to your game.

1. Inspect the code [0 marks]

2. Create variables for interaction [1 marks]
	- Declare four variables: `isLeft`, `isRight`, `isFalling` and `isPlummeting`
	- Initialise each of them to `false`. These variables will be used to animate your game
	 character.

3. Implement left and right for keyPressed [1 marks]
	- Inside the function `keyPressed` write two `if` statements such that:
		when the left arrow key is pressed, `isLeft = true`;
		when the right arrow key is pressed, `isRight = true`.
	- Test your conditional statements  using `console.log()` to see the values of
		isLeft and isRight
	- Hint: look up the difference between
		[`keyCode`](https://p5js.org/reference/#/p5/keyCode) and
		[`key`](https://p5js.org/reference/#/p5/key) to help you decide
		which variable you need to use.

4. Implement left and right for keyReleased [1 marks]
	- Inside the function `keyReleased` write two `if` statements such that:
	- when the left arrow key is released, `isLeft = false`;
	- when the right arrow key is released, `isRight = false`.
	- Test your conditional statements  using `console.log()` to see the values of
		isLeft and isRight

5. Add game character [1 marks]
	- Add your game character code from part 2 to this sketch.
	- You need to place each block of character code within the appropriate
	`if` statement so that when the character is animated the correct
	image will be drawn.

6. Make the game character move left and right [2 marks]
	- In the `draw` function add two `if` statements such that:
	- when `isLeft` is `true` the character moves to the left;
	- when `isRight` is `true` the character moves to the right.
	- Test that your character moves left, right, and stops correctly
		when the arrow keys are pressed and released.
	- HINT: you need to use the `isLeft`, `isRight`, and `gameChar_x`
		variables.

7. Make the game character jump [2 marks]
	- Add another `if` statement within `keyPressed` that checks when the
	the space-bar is pressed.
	- When the condition is met subtract 100 from `gameChar_y` so that the character jumps up in the air.
	- Now adjust your conditional statement so that your character can only jump when
	it is touching the ground. HINT: use `gameChar_y` variable in your condition.

8. Add gravity [2 marks]
	- Add an `if` statement within `draw` to detect when the character is above ground level.
	HINT: use `floorPos_y` and `gameChar_y` in your condition
	- When the condition is met increment `gameChar_y` so that the character falls towards the ground. Also set `isFalling` to `true` so that the falling image of the character appears
	- Now add an `else` action to your conditional statement which set `isFalling` to `false`

9. Testing your interaction [0 marks]
	- Make sure the correct character images appear when you move left, move right, jump left and jump right
	- Make sure that game character falls immediately after you press the space bar and that you can't jump again until they have touched the ground
