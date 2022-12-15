import React, { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    let fruit = document.getElementById('fruit') as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = '#a3d001';
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameOver]);

  const handleSetScore = () => {
    if (score > Number(localStorage.getItem('snakeScore'))) {
      localStorage.setItem('snakeScore', JSON.stringify(score));
    }
  };

  const play = () => {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setGameOver(false);
  };

  const checkCollision = (head: number[]) => {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }

    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }

    return false;
  };

  // array of array number[][]
  const appleAte = (newSnake: number[][]) => {
    // random coordinates within the canvas
    let coordinate = apple.map(() =>
      Math.floor((Math.random() * canvasX) / scale)
    );
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coordinate;
      setScore(score + 1);
      setApple(newApple);
      return true;
    }
    return false;
  };

  const runGame = () => {
    // make a copy of our current snake
    const newSnake = [...snake];
    // get the first element of the first array [0][0], get the second element of the first array
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    //Inserts new elements at the start of an array, and returns the new length of the array
    // thus we are adding newSnakeHead to the beginning of ...snake
    newSnake.unshift(newSnakeHead);

    // chzck if we hit the wall then reset
    if (checkCollision(newSnakeHead)) {
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

  const changeDirection = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        setDirection([-1, 0]);
        break;
      case 'ArrowUp':
        setDirection([0, -1]);
        break;
      case 'ArrowRight':
        setDirection([1, 0]);
        break;
      case 'ArrowDown':
        setDirection([0, 1]);
        break;
    }
  };

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img id="fruit" src={applePixels} alt="" width="30" />

      <img src={monitor} alt="fruit" width="4000" className="monitor" />
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
