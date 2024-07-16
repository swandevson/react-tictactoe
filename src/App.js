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

  const renderSqaure = (index) => (
    <Square
      value={squareValues[index]}
      onSquareClick={() => handleClick(index)}
    />
  );

  return (
    <>
      <div className="status">{status}</div>

      {[0, 3, 6].map((rowStart) => (
        <div key={rowStart / 3} className="board-row">
          {renderSqaure(rowStart)}
          {renderSqaure(rowStart + 1)}
          {renderSqaure(rowStart + 2)}
        </div>
      ))}
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
