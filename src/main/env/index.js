const config = {
  gameConfig: { 
    gameSpeed: 40,
    initialSnakeSize: 4,
    directions: {
      up: { x: 0, y: -0.5 },
      down: { x: 0, y: 0.5 },
      right: { x: 1, y: 0 },
      left: { x: -1, y: 0 },
    },
    color: {
      snake: 'green',
      dot: 'red'
    },
    keys: {
      up: ['up', 'w'],
      right: ['right', 'd'],
      down: ['down', 's'],
      left: ['left', 'a'],
    }
  },
  defaultScreen: {
    keys: {
      exit: ['escape', 'q', 'C-c'],
      pause: ['pause', 'p'],
      start: ['enter']
    },
    text: {
      gameOver: 'Game Over!\n\nPress {{key}} to try again\n',
      score: ' score:',
      timer: ' timer:',
      pause: ' Game paused\n\nPress {{key}} to resume\n'
    },
    style: {
      screen: {
        fg: 'black',
        bg: 'black'
      },
      score: {
        fg: 'white',
        bg: '#5c0000'
      },
      timer: {
        fg: 'white',
        bg: '#5c0000'
      },
      gameOver: {
        fg: 'black',
        bg: '#a18ab5',
        border: {
          fg: '#ffffff',
        },
        shadow: true,
      },
      pause: {
        fg: 'black',
        bg: '#a18ab5',
        border: {
          fg: '#ffffff',
        },
        shadow: true,
      }
    },
    size: {
      defaultScreen: {
        width: '100%',
        height: '100%'
      },
      game: {
        width: '100%',
        height: '100%-2'
      },
      score: {
        width: '25%',
        height: 1
      },
      timer: {
        width: 13,
        height: 1
      },
      gameOver: {
        width: '20%',
        height: '20%'
      },
      pause: {
        width: '20%',
        height: '20%'
      }
    }
  }
};

module.exports = config;