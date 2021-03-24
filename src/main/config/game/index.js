const { gameConfig } = require('@env');
const { randomInt } = require('crypto');

class Game {
  #ui;
  #snake;
  #dot;
  #score;
  #currentDirection;
  #changingDirection;
  #timer;

  constructor(ui) {
    this.#ui = ui;
    this.#reset();
    this.#ui.bindHandlers(this.#changeDirection.bind(this));
    this.#ui.bindHandlers(this.#start.bind(this));
  }

  #reset() {
    this.#snake = [];

    for (let i = gameConfig.initialSnakeSize; i >= 0; i--) {
      this.#snake[gameConfig.initialSnakeSize - i] = { x: i, y: 1 };
    }

    this.#dot = {};
    this.#score = 0;
    this.#currentDirection = 'right';
    this.#changingDirection = false;
    this.#timer = null;

    this.#generateDot();
    this.#ui.start();
  }

  #changeDirection(_, { name }) {
    const { up, down, left, right } = gameConfig.keys;

    if (up.includes(name) && this.#currentDirection !== 'down') {
      this.#currentDirection = 'up';
    }
    if (down.includes(name) && this.#currentDirection !== 'up') {
      this.#currentDirection = 'down';
    }
    if (left.includes(name) && this.#currentDirection !== 'right') {
      this.#currentDirection = 'left';
    }
    if (right.includes(name) && this.#currentDirection !== 'left') {
      this.#currentDirection = 'right';
    }
  }

  #start(_, { name }) {
    if (name === 'return') this.start();
  }

  #checkColide(snake, colidePoint) {
    return (
      Math.abs(snake.x - colidePoint.x) <= 1 &&
      !Number.parseInt(snake.y - colidePoint.y)
    );
  }

  #moveSnake() {

    if (this.#changingDirection) {
      return;
    }

    this.#changingDirection = true;

    const head = {
      x: this.#snake[0].x + gameConfig.directions[this.#currentDirection].x,
      y: this.#snake[0].y + gameConfig.directions[this.#currentDirection].y,
    };

    this.#snake.unshift(head);

    if (this.#checkColide(this.#snake[0], this.#dot)) {
      this.#score++;
      this.#ui.updateScore(this.#score);
      this.#generateDot();
    } else {
      this.#snake.pop();
    }
  }

  #generateRandomPixelCoord(min, max) {
    return randomInt(min, max);
  }

  #generateDot() {
    const { width, height } = this.#ui.size;
    this.#dot.x = this.#generateRandomPixelCoord(1, width - 4);
    this.#dot.y = this.#generateRandomPixelCoord(1, height - 5);

    this.#snake.forEach(segment => {
      if (this.#checkColide(segment, this.#dot)) {
        this.#generateDot();
      }
    });
  }

  #drawSnake() {
    this.#snake.forEach(segment => {
      this.#ui.draw(segment, gameConfig.color.snake);
    });
  }

  #drawDot() {
    this.#ui.draw(this.#dot, gameConfig.color.dot);
  }

  #isGameOver() {
    const { width, height } = this.#ui.size;
    const collide = this.#snake
      .filter((_, i) => i > 0)
      .some(segment => segment.x === this.#snake[0].x && segment.y === this.#snake[0].y);

    return (
      collide ||
      this.#snake[0].x >= width - 4 ||
      this.#snake[0].x <= 0 ||
      this.#snake[0].y >= height - 5 ||
      this.#snake[0].y <= 0
    );
  }

  #showGameOverScreen() {
    this.#ui.gameOver();
    this.#ui.render();
  }

  #tick() {
    if (!this.#ui.isPaused) {
      if (this.#isGameOver()) {
        this.#showGameOverScreen();
        clearInterval(this.#timer);
        this.#timer = null;
        return;
      }
      this.#changingDirection = false;
      this.#ui.clearScreen();
      this.#drawDot();
      this.#moveSnake();
      this.#drawSnake();
      this.#ui.render();
    }
  }

  start() {
    if (!this.#timer) {
      this.#reset();
      this.#timer = setInterval(this.#tick.bind(this), gameConfig.gameSpeed);
    }
  }
}

module.exports = Game;