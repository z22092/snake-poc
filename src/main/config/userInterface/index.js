const { screen, box, layout } = require('@adapters').Screen;
const { defaultScreen } = require('@env');

//todo new Game title with animation 
//help box

class UserInterface {
  #snakeXDebug;
  #snakeYDebug;
  #dotXDebug;
  #dotYDebug;
  #keysDebug;
  #layout;
  #isDebug;
  #screen;
  #gameContainer;
  #scoreContainer;
  #timerContainer;
  #pauseBox;
  #gameOverBox;
  #snakeDebugBox;
  #controllerDebugBox;
  isStart = false;
  isGameOver = true;
  isPaused = false;


  get #gameBoxConfig() {
    return {
      border: {
        fg: 'blue',
        bg: 'red'
      },
      parent: this.#screen,
      top: 1,
      bottom: 1,
      left: 0,
      width: defaultScreen.size.game.width,
      height: defaultScreen.size.game.height,
      style: {
        ...defaultScreen.style.screen
      }
    };
  };

  get #gameOverBoxConfig() {
    const text = defaultScreen.text.gameOver
      .replace('{{key}}',
        defaultScreen.keys.start.join(' or '));

    return {
      border: 'line',
      tags: true,
      parent: this.#screen,
      top: 'center',
      left: 'center',
      width: defaultScreen.size.gameOver.width,
      height: defaultScreen.size.gameOver.height,
      valign: 'middle',
      content: `{center}${text}{/center}`,
      style: {
        ...defaultScreen.style.gameOver
      }
    };
  };

  get #pauseBoxConfig() {
    const text = defaultScreen.text.pause
      .replace('{{key}}',
        defaultScreen.keys.pause.join(' or '));

    return {
      border: 'line',
      tags: true,
      parent: this.#screen,
      top: 'center',
      left: 'center',
      width: defaultScreen.size.pause.width,
      height: defaultScreen.size.pause.height,
      valign: 'middle',
      content: `{center}${text}{/}`,
      style: {
        ...defaultScreen.style.pause
      }
    };
  };

  get #scoreBoxConfig() {
    return {
      parent: this.#screen,
      tags: true,
      top: 0,
      right: 0,
      width: '20%',
      height: 1,
      align: 'right',
      width: defaultScreen.size.score.width,
      height: defaultScreen.size.score.height,
      style: {
        ...defaultScreen.style.score
      }
    };
  }

  get #timerBoxConfig() {
    return {
      parent: this.#screen,
      tags: true,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      align: 'center',
      width: defaultScreen.size.timer.width,
      height: defaultScreen.size.timer.height,
      style: {
        ...defaultScreen.style.timer
      }
    };
  }

  constructor(title) {
    this.#screen = screen({ smartCSR: true, autoPadding: true, title });
    this.#screen.key(defaultScreen.keys.exit, () => process.exit(0));
    this.#screen.key(defaultScreen.keys.pause, this.pause.bind(this));
    this.#screen.key(defaultScreen.keys.start, this.start.bind(this));
    this.create();
  }

  create() {
    this.#scoreContainer = box(this.#scoreBoxConfig);
    this.#timerContainer = box(this.#timerBoxConfig);
    this.#gameContainer = box(this.#gameBoxConfig);
    this.#debug();
  }

  get size() {
    return {
      width: this.#screen.width,
      height: this.#screen.height
    };
  }

  start() {
    if (!this.isStart) {
      this.clearScreen()
      this.resetTimer();
      this.resetScore();
      this.isStart = !this.isStart;
      this.render();
    }
  }

  gameOver() {
    if (this.isGameOver) {
      this.#gameContainer = box(this.#gameOverBoxConfig);
      this.isGameOver = !this.isGameOver;
      this.isStart = !this.isStart;
    }
  }

  pause() {
    if (this.isStart) {
      if (this.isPaused) this.#gameContainer.detach();
      else this.#gameContainer = box(this.#pauseBoxConfig);
      this.isPaused = !this.isPaused;
    }
  }

  bindHandlers(keyPressHandler) {
    this.#screen.on('keypress', keyPressHandler);
  }

  draw(coord, color, type) {
    if (this.#isDebug)
      if (color === 'red') this.#logCoordinatesDot(coord);
      else this.#logCoordinatesSnake(coord);

    box({
      parent: this.#gameContainer,
      top: Number.parseInt(coord.y),
      left: coord.x,
      width: 2,
      height: 1,
      style: {
        fg: color,
        bg: color,
      },
    });
  }

  updateScore(score) {
    this.#scoreContainer.setLine(0, `{bold}${defaultScreen.text.score}{/} ${score} `);
  }

  #startTimer() {
    const initialTimer = + new Date();
    const text = `{bold}${defaultScreen.text.timer} {/}`;
    setInterval(() => {
      if (!this.isPaused) {
        const actual = + new Date();
        const seconds = Math.round((actual - initialTimer) / 1000);
        this.#timerContainer.setContent(`${text}${seconds}`);
      }
    }, 1000);
  }

  clearScreen() {
    this.#gameContainer.detach();
    this.#gameContainer = box(this.#gameBoxConfig);
  }

  resetScore() {
    this.#scoreContainer.detach();
    this.#scoreContainer = box(this.#scoreBoxConfig);
    this.updateScore(0);
  }

  resetTimer() {
    this.#timerContainer.detach();
    this.#timerContainer = box(this.#timerBoxConfig);
    this.#startTimer();
  }

  render() {
    this.#screen.render();
  }

  #logKeys(_, { name }) {
    this.#keysDebug.setContent(`{bold}pressed:{/} ${name}`);
  }

  #logCoordinatesDot(coord) {
    const { x, y } = coord;
    this.#dotXDebug.setContent(` {bold}x:{/}${x.toString()}`);
    this.#dotYDebug.setContent(`{bold}y:{/}${y.toString()} `);
  }

  #logCoordinatesSnake(coord) {
    const { x, y } = coord;
    this.#snakeXDebug.setContent(` {bold}x:{/}${x.toString()}`);
    this.#snakeYDebug.setContent(`{bold}y:{/}${y.toString()}`);
  }

  #debug() {
    this.#isDebug = true;
    this.#layout = layout({
      parent: this.#screen,
      top: 0,
      left: 0,
      align: 'left',
      width: '80%',
      height: 1,
      tags: true,
      style: {
        fg: 'white',
        bg: 'red',
      }
    });

    const keys = {
      parent: this.#layout,
      top: 'center',
      left: 'center',
      width: 15,
      tags: true,
      style: {
        fg: 'white',
        bg: 'red',
      }
    };

    const coordinates = {
      parent: this.#layout,
      top: 'center',
      left: 'center',
      align: 'left',
      width: 10,
      tags: true,
      style: {
        fg: 'white',
        bg: 'red',
      }
    };

    this.#snakeXDebug = box(coordinates);
    this.#snakeYDebug = box(coordinates);
    this.#dotXDebug = box(coordinates);
    this.#dotYDebug = box(coordinates);
    this.#keysDebug = box(keys);

    this.bindHandlers(this.#logKeys.bind(this));
  }

}

module.exports = UserInterface;;