const gameboard = {
  board: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ],
  availableMoves: 9,
  player1: null,
  player2: null,
  gameMode: null,
  resetBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        gameboard.board[i][j] = `${i * 3 + j + 1}`;
      }
      this.availableMoves = 9;
    }
  },
  play(number, mark) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameboard.board[i][j] === number) {
          gameboard.board[i][j] = mark;
          return;
        }
      }
    }
  },
};

// factory creates players
function playerFactory(name, playerMark) {
  return {
    wins: 0,
    loses: 0,
    draws: 0,
    mark: playerMark,
    startedLastGame: null,
    faceBanner: (() => {
      const faceDiv = document.createElement('div');
      faceDiv.textContent = 'Turn:';
      const face = document.createElement('img');
      faceDiv.classList.add('facebanner');
      face.classList.add('facebanner');
      face.src = `./res/images/${name}.png`;
      faceDiv.appendChild(face);
      faceDiv.appendChild(playerMark);
      return faceDiv;
    })(),
  };
}
const container = document.querySelector('.container');
mainMenu();

// main page design
function mainMenu() {
  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu');

  const title = document.createElement('div');
  title.textContent = 'Tic Tac Toe';
  title.classList.add('title');
  mainMenu.appendChild(title);

  const singlePlayerBtn = document.createElement('button');
  singlePlayerBtn.textContent = 'Single Player';
  singlePlayerBtn.addEventListener('click', chooseCharacterScreen);
  mainMenu.appendChild(singlePlayerBtn);

  const multyPlayerBtn = document.createElement('button');
  multyPlayerBtn.textContent = 'Multy Player';
  multyPlayerBtn.addEventListener('click', chooseCharacterScreen);
  mainMenu.appendChild(multyPlayerBtn);

  container.replaceChildren(mainMenu);
}

// Choosing character
function chooseCharacterScreen(e) {
  gameboard.gameMode = e.target.textContent;

  const ccScreen = document.createElement('div');
  ccScreen.classList.add('char-menu');

  const title = document.createElement('div');
  title.textContent = 'Choose your character';
  title.classList.add('title');
  ccScreen.appendChild(title);

  // --Yui

  const yuiContainer = document.createElement('div');
  yuiContainer.classList.add('char-container');

  const yuiName = document.createElement('div');
  yuiName.classList.add('char-name');
  yuiName.textContent = 'Yui';
  yuiContainer.appendChild(yuiName);

  const yuiFace = document.createElement('img');
  yuiFace.src = './res/images/Yui.png';
  yuiFace.classList.add('char-face');
  yuiFace.addEventListener('click', gameScreen);
  yuiFace.id = 'Yui';
  yuiContainer.appendChild(yuiFace);

  const circle = document.createElement('img');
  circle.src = './res/images/circle.png';
  circle.classList.add('circle');
  yuiContainer.appendChild(circle);

  // -- Ai

  const aiContainer = document.createElement('div');
  aiContainer.classList.add('char-container');

  const aiName = document.createElement('div');
  aiName.classList.add('char-name');
  aiName.textContent = 'Ai';
  aiContainer.appendChild(aiName);

  const aiFace = document.createElement('img');
  aiFace.src = './res/images/Ai.png';
  aiFace.classList.add('char-face');
  aiFace.id = 'Ai';
  aiFace.addEventListener('click', gameScreen);
  aiContainer.appendChild(aiFace);

  const cross = document.createElement('img');
  cross.src = './res/images/cross.png';
  cross.classList.add('cross');
  aiContainer.appendChild(cross);

  // --container
  const charMainContainer = document.createElement('div');
  charMainContainer.classList.add('char-main-container');

  charMainContainer.appendChild(yuiContainer);
  charMainContainer.appendChild(aiContainer);
  ccScreen.appendChild(charMainContainer);
  container.replaceChildren(ccScreen);
}

// creating game screen
function gameScreen(e) {
  // creating mark to be used on gameboard
  function markCreator(markName) {
    const finalMark = document.createElement('img');
    finalMark.classList.add('facebanner');
    finalMark.src = `./res/images/${markName}.png`;
    if (markName === 'cross') {
      finalMark.id = 'X';
    } else {
      finalMark.id = 'O';
    }
    return finalMark;
  }
  // getting player info
  let activePlayer = null;

  const map = new Map();
  map.set('Ai', 'cross');
  map.set('Yui', 'circle');

  if (gameboard.gameMode === 'Single Player') {
    gameboard.player1 = playerFactory(
      e.target.id,
      markCreator(map.get(e.target.id))
    );
    if (map.get(e.target.id) === 'circle') {
      gameboard.player2 = playerFactory('computer', markCreator('cross'));
    } else {
      gameboard.player2 = playerFactory('computer', markCreator('circle'));
    }
  } else {
    gameboard.player1 = playerFactory(
      e.target.id,
      markCreator(map.get(e.target.id))
    );
    if (e.target.id === 'Yui') {
      gameboard.player2 = playerFactory('Ai', markCreator(map.get('Ai')));
    } else {
      gameboard.player2 = playerFactory('Yui', markCreator(map.get('Yui')));
    }
  }

  // game screen
  const gameScreen = document.createElement('div');
  gameScreen.classList.add('game-screen');

  // drawing headbanner
  const banner = document.createElement('div');
  banner.classList.add('banner');
  gameScreen.appendChild(banner);

  // drawing gameboard
  const gameBoard = document.createElement('div');
  gameBoard.classList.add('gameboard');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', `cell${i + 1}`);
    cell.addEventListener('click', turn);
    gameBoard.appendChild(cell);
  }
  gameScreen.appendChild(gameBoard);

  // drawing scoreboard footbanner
  const scoreboard = document.createElement('div');
  scoreboard.classList.add('scoreboard');
  gameScreen.appendChild(scoreboard);

  container.replaceChildren(gameScreen);

  // defining who starts players
  function startGame() {
    if (gameboard.player1.startedLastGame === null) {
      if (Math.random() >= 0.5) {
        gameboard.player1.startedLastGame = false;
        gameboard.player2.startedLastGame = true;
      } else {
        gameboard.player1.startedLastGame = true;
        gameboard.player2.startedLastGame = false;
      }
    }
    if (gameboard.player1.startedLastGame === false) {
      activePlayer = gameboard.player1;
    } else {
      activePlayer = gameboard.player2;
    }
    banner.replaceChildren(activePlayer.faceBanner);
  }
  startGame();

  // turn

  function turn(e) {
    // drawing move on gameboards
    e.target.appendChild(activePlayer.mark.cloneNode());
    e.target.removeEventListener('click', turn);
    gameboard.play(
      e.target.classList.value.charAt(e.target.classList.value.length - 1),
      activePlayer.mark.id
    );

    gameboard.availableMoves--;

    // checking if this move ends the game
    if (gameboard.availableMoves < 5) {
      for (let i = 0; i < 3; i++) {
        if (
          gameboard.board[i][0] === gameboard.board[i][1] &&
          gameboard.board[i][0] === gameboard.board[i][2]
        ) {
          // return 'you won';
          gamecompleted();
          return;
        }
      }
      for (let j = 0; j < 3; j++) {
        if (
          gameboard.board[0][j] === gameboard.board[1][j] &&
          gameboard.board[0][j] === gameboard.board[2][j]
        ) {
          // return 'you won';
          gamecompleted();
          return;
        }
      }
      if (
        gameboard.board[0][0] === gameboard.board[1][1] &&
        gameboard.board[0][0] === gameboard.board[2][2]
      ) {
        // return 'you won';
        gamecompleted();
        return;
      }
      if (
        gameboard.board[0][2] === gameboard.board[1][1] &&
        gameboard.board[0][2] === gameboard.board[2][0]
      ) {
        // return 'you won';
        gamecompleted();
        return;
      }
    }
    if (gameboard.availableMoves === 0) {
      // return 'draw';
      gameboard.resetBoard();
      endgameModal('draw');
      gameboard.player1.draws++;
      gameboard.player2.draws++;
      return;
    }
    // setting up next turn
    if (activePlayer === gameboard.player1) {
      activePlayer = gameboard.player2;
    } else {
      activePlayer = gameboard.player1;
    }
    banner.replaceChildren(activePlayer.faceBanner);
  }

  // pop up dialog/ modal when game ends
  function endgameModal(winner) {
    const modal = document.createElement('dialog');

    const winnerDiv = document.createElement('div');
    winnerDiv.classList.add('winner-div');
    if (winner === 'draw') {
      winnerDiv.textContent = 'DRAW';
      winnerDiv.style.fontSize = '3rem';
      winnerDiv.style.height = 'auto';
      modal.style.backgroundColor = 'black';
    } else {
      winnerDiv.appendChild(activePlayer.faceBanner);
      modal.style.backgroundImage = "url('./res/images/winner.png')";
    }

    const btnDiv = document.createElement('div');
    btnDiv.classList.add('btnDiv');

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Again!';

    const mainMenuBtn = document.createElement('button');
    mainMenuBtn.textContent = 'Main Menu';
    mainMenuBtn.addEventListener('click', mainMenu);
    btnDiv.append(playAgainBtn, mainMenuBtn);

    modal.append(winnerDiv, btnDiv);

    gameScreen.appendChild(modal);
    modal.showModal();
  }

  // results div
  function gamecompleted() {
    gameboard.resetBoard();
    endgameModal();
    activePlayer.wins++;
    if (gameboard.player1 !== activePlayer) {
      gameboard.player1.loses++;
    } else {
      gameboard.player2.loses++;
    }
  }
}
