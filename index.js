const SnakeGame = require('./SnakeGame');
const Direction = require('./Direction');

const snakeBlock = '\u258A';
const spaceBlock = '\u2591';
const foodBlock = '\u25B3';

console.reset = () => {
  return process.stdout.write('\033c');
};

let inputKey = null;

const setup = () => {
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on('data', (key) => {
    if (key === null) {
      return;
    }
    if (key === '\u0003') {
      process.exit();
    }
    inputKey = key;
  });
};

const printMap = (game) => {
  console.reset();
  let map = Array(game.getSize()).fill([]).map(i => Array(game.getSize()).fill(0));

  game
    .getSnake()
    .forEach(p => {
      map[p[0]][p[1]] = 1;
    });

  const foodPosition = game.getFoodPosition();
  map[foodPosition[0]][foodPosition[1]] = 2;

  for (let i = 0; i < game.getSize(); ++i) {
    for (let j = 0; j < game.getSize(); ++j) {
      switch(map[i][j]) {
        case 0:
          process.stdout.write(spaceBlock + spaceBlock);
          break;
        case 1:
          process.stdout.write(snakeBlock + snakeBlock);
          break;
        case 2:
          process.stdout.write(foodBlock + ' ');
          break;
      }
    }
    process.stdout.write('\n');
  }

};

let game = new SnakeGame(20);

const gameStep = () => {
  let direction = null;
  switch(inputKey) {
    case 'w':
      direction = Direction.UP;
      break;
    case 's':
      direction = Direction.DOWN;
      break;
    case 'a':
      direction = Direction.LEFT;
      break;
    case 'd':
      direction = Direction.RIGHT;
      break;
  }
  inputKey = null;
  game.step(direction);
  printMap(game);
  if(game.isGameOver()) {
    console.log('-- game over --');
    return;
  }
  setTimeout(gameStep, 200);
}

setup()
printMap(game);
gameStep();
