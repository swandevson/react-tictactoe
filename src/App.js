import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squareValues, onPlay }) {
  const winner = calculateWinner(squareValues);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i) {
    if (squareValues[i] || winner) {
      return;
    }
    const nextSquares = squareValues.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squareValues[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squareValues[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squareValues[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squareValues[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squareValues[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squareValues[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squareValues[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squareValues[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squareValues[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function History({ history, onJumpTo }) {
  function jumpTo(nextMove) {}

  const moves = history.map((square, move) => {
    let description;
    if (move > 0) {
      description = `Go To Move #${move}`;
    } else {
      description = `Go To Game Start`;
    }

    return (
      <li key={move}>
        <button onClick={() => onJumpTo(move)}>{description}</button>
      </li>
    );
  });

  return <ol>{moves}</ol>;
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true); // "X" 먼저 시작
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // 새로운 수를 놓을 때.
  // 이 때, 이전 이동으로 돌아간 후 새로 놓은 경우도 고려해야함
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  // N번째 이동으로 되돌아 갈 때
  function handleJumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 == 0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squareValues={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <History history={history} onJumpTo={handleJumpTo} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    // 가로
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // 세로
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // 대각선
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
