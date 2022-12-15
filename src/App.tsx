import React, { useRef, useState } from 'react';

import './App.css';
import useInterval from './hooks/useInterval';

import applePixels from './assets/applePixels.png';
import monitor from './assets/oldMonitor.png';

/*CONSTANTS*/

// width
const canvasX = 1000;

// heigth
const canvasY = 1000;

//starting point
const initialSnake = [
  [4, 10],
  [4, 10],
];
//starting point of the apple
const initialApple = [14, 10];
// scare up and down the board
const scale = 50;
// milliseconds
const timeDelay = 100;

function App() {
  // reference the canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  //directiong we are doing
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => runGame(), delay);

  const play = () => {};

  const changeDirection = (e) => {};

  const runGame = () => {
    // make a copy of our current snake
    const newSnake = [...snake];
    // get the first element of the first array [0][0], get the second element of the first array
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      (newSnake[0][1] = direction[1]),
    ];
    //Inserts new elements at the start of an array, and returns the new length of the array
    // thus we are adding newSnakeHead to the beginning of ...snake
    newSnake.unshift(newSnakeHead);

    // chzck if we hit the wall then reset
    if (chackCollision(newSnakeHead)) {
      setDelay(null);
      setGameOver(true);
      handleSetScore();
    }

    if (!appleAte(newSnake)) {
      //Removes the last element from an array and returns it
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img src={applePixels} alt="" width="30" />
      <img src={monitor} alt="" width="30" />
      <canvas
        width={`${canvasX}px`}
        height={`${canvasY}px`}
        className="playArea"
        ref={canvasRef}
      />
      {gameOver && <div className="gameOver">Game Over</div>}
      <button onClick={play} className="playButton">
        Start
      </button>
      <div className="scoreBox">
        <h2>Score: {score}</h2>
        <h2>High Score: {localStorage.getItem('snakeScore')}</h2>
      </div>
    </div>
  );
}

export default App;
