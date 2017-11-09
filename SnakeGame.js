const Direction = require('./Direction');

function SnakeGame(size) {
  // assert(size > 4);
  this._size = size;

  // length of snake, start with 2
  let midSize = Math.floor(size / 2);
  this._snake = [
    [midSize, midSize],
    [midSize + 1, midSize]
  ];

  this._snakeLength = 2;
  this._foodPosition = generateRandomFoodPosition(this);
  this._currentDirection = Direction.UP;

  this._isGameOver = false;
}

SnakeGame.prototype.getSize = function getSize() {
  return this._size;
};

SnakeGame.prototype.getSnakeLength = function getSnakeLength() {
  return this._snakeLength;
};

SnakeGame.prototype.getSnake = function getSnake() {
  return this._snake;
}

SnakeGame.prototype.getFoodPosition = function getFoodPosition() {
  return this._foodPosition;
}

SnakeGame.prototype.isGameOver = function isGameOver() {
  return this._isGameOver;
}

SnakeGame.prototype.step = function step(dir) {
  if (this._isGameOver) {
    throw new Error('Game is already over');
  }
  // set a new direction if player decides to put a new direction
  if (dir !== null) {
    let isNotOppositeDirection = (this._currentDirection == Direction.UP && dir != Direction.DOWN)
      || (this._currentDirection == Direction.DOWN && dir != Direction.UP)
      || (this._currentDirection == Direction.LEFT && dir != Direction.RIGHT)
      || (this._currentDirection == Direction.RIGHT && dir != Direction.LEFT);
    if (isNotOppositeDirection) {
      this._currentDirection = dir;
    }
  }

  // get the head position of the snake
  let head = this._snake[0];
  let newHead = [
    head[0],
    head[1]
  ];
  switch(this._currentDirection) {
    case Direction.UP:
      newHead[0] -= 1;
      if (newHead[0] < 0) {
        // wrap around the area
        newHead[0] += this._size;
      }
      break;
    case Direction.DOWN:
      newHead[0] += 1;
      if (newHead[0] >= this._size) {
        // wrap around the area
        newHead[0] -= this._size;
      }
      break;
    case Direction.LEFT:
      newHead[1] -= 1;
      if (newHead[1] < 0) {
        // wrap around the area
        newHead[1] += this._size;
      }
      break;
    case Direction.RIGHT:
      newHead[1] += 1;
      if (newHead[1] >= this._size) {
        // wrap around the area
        newHead[1] -= this._size;
      }
      break;
    default:
      throw new Error('Invalid direction for snake');
  }

  // move snake onto the new position
  this._snake.unshift(newHead);

  if (isSamePosition(newHead, this._foodPosition)) {
    // we ate a food, so let's grow!
    ++this._snakeLength;
    this._foodPosition = generateRandomFoodPosition(this);
  } else {
    // remove 1 of tail to keep same length
    this._snake.pop();
  }

  // perform check if game over
  if (this._snakeLength == this._size * this._size) {
    this._isGameOver = true;
    return;
  }
  if (this._snake.filter(g => isSamePosition(g, newHead)).length > 1) {
    this._isGameOver = true;
  }
};

function isSamePosition(pos1, pos2) {
  return pos1[0] == pos2[0] && pos1[1] == pos2[1];
}

function generateRandomFoodPosition(game) {
  // assert(game instanceof SnakeGame);

  if (game._snakeLength == game._size * game._size) {
    // snake has already optimally occupied the entire space
    // we can't find a new space to generate a food position
    return;
  }
  let randomPosition = generateRandomPosition(game._size);
  let doesPositionOccupyOnSnake = (position) => {
    return game._snake.filter(g => isSamePosition(g, position)).length > 0;
  };

  while (doesPositionOccupyOnSnake(randomPosition)) {
    // the previously randomly generated position is where a snake is
    randomPosition = generateRandomPosition(game._size);
  }
  return randomPosition;
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomPosition(size) {
  return [
    randomNumberBetween(0, size),
    randomNumberBetween(0, size)
  ];
}

module.exports = SnakeGame;
