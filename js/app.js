// Create an enemy class which has attributes for X and Y coordinates, a speed, and the sprite image.
var Enemy = function(positionX, positionY, speed) {
    this.x = positionX;
    this.y = positionY;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	
	// This formula is derived from the physics formula for speed where position (S) is equal to the initial
	// position (S sub 0) added to the product of the velocity (v) and time (t). S = S(0) + (v * t)
	this.x = this.x + this.speed * dt;
	
	// Sets the right boundary at 550 and the initial position at -120. If the enemy hits an x coordinate of
	// 550 then the enemy is reset back to -120 with a new randomly generated speed.
	if (this.x > 550) {
		this.x = -120;
		this.randomSpeed();
	}
	
	// Because this.x and this.y represent the center point for the enemy, we need to extend out the detection
	// boundaries for when the player collides with the enemy
	var enemyLeftBound = this.x - 60;
    var enemyRightBound = this.x + 60;
    var enemyTopBound = this.y - 60;
    var enemyBottomBound = this.y + 60;
    
    // If the player's position is within the top, bottom, left, and right boundaries of the enemy
    // then we have a collision and the player is reset
    if (player.x < enemyRightBound && player.x > enemyLeftBound && player.y > enemyTopBound && player.y < enemyBottomBound) {
        player.resetPlayer();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.randomSpeed = function() {
	// Generate a random number between 0 and 1, multiply that by 10, then add 1 (to ensure the number isn't 0).
	// Finally, multiply that number by 80 to get the random speed.
    this.speed = 80 * (Math.floor(Math.random() * 10 + 1));
}


var Player = function() {
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function() {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.resetPlayer = function() {
    this.x = 200;
    this.y = 400;
    this.changeHorizontalBoundaryState(false, false);
    this.boundaryState.bottomBoundary = true;
}

Player.prototype.boundaryState = function() {
    var rightBoundary = false;
    var leftBoundary = false;
    var bottomBoundary = true;
}

Player.prototype.checkForBoundary = function() {
    if (this.x === 0) {
        this.changeHorizontalBoundaryState(true, false);
    }
    else if (this.x === 400) {
        this.changeHorizontalBoundaryState(false, true);
    }
    else {
        this.changeHorizontalBoundaryState(false, false);
    }
    if (this.y === 400) {
        this.boundaryState.bottomBoundary = true;
    }
    else {
        this.boundaryState.bottomBoundary = false;
    }
}

Player.prototype.changeHorizontalBoundaryState = function(leftBoundaryState, rightBoundaryState) {
    this.boundaryState.leftBoundary = leftBoundaryState;
    this.boundaryState.rightBoundary = rightBoundaryState;
}

Player.prototype.handleInput = function(key) {
    var stepHorizontalLength = 100;
    var stepVerticalLength = 90;
    this.checkForBoundary();

    if (key === 'up') {
        if (this.y === 40) {
            this.resetPlayer();
            return null;
        }
        this.y -= stepVerticalLength;
    }
    else if (key === 'down') {
        if (this.boundaryState.bottomBoundary) {
            return null;
        }
        this.y += stepVerticalLength;
    }
    else if (key === 'left') {
        if (this.boundaryState.leftBoundary) {
            return null;
        }
        this.x -= stepHorizontalLength;
    } 
    else if (key === 'right') {
        if (this.boundaryState.rightBoundary) {
            return null;
        }
        this.x += stepHorizontalLength;
    }  
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var i = 0; i < 3; i++) {
    var initialSpeed = Math.floor(Math.random() * 5 + 1) * 75;
    allEnemies.push(new Enemy(-120, 60 + 80 * i, initialSpeed));
}

var player = new Player();
Player.prototype.boundaryState();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
