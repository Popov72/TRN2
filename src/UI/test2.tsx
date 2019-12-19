import React, { useState, useRef } from "react";

interface ISquareProps {
    value: string;
    onClick: () => void;
    selected: boolean;
}

function Square(props: ISquareProps) {
    return (
        <button
            className={props.selected ? "square square-select" : "square"}
            onClick={props.onClick}
        >
        {props.value}
        </button>
    );
}

interface IBoardProps {
    squares: Array<string>;
    onClick: (i: number) => void;
    squaresSel: Array<boolean>;
}

interface IBoardState {
    squares: Array<string>;
    xIsNext: boolean;
}

function Board(props: IBoardProps) {

    function renderSquare(i: number) {
        return (
            <Square
                key={"square" + i}
                selected={props.squaresSel[i]}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }

    let rows = [];
    for (let j = 0; j < 3; ++j) {
        let sq = [];
        for (let i = 0; i < 3; ++i) {
            sq.push(renderSquare(j * 3 + i));
        }
        rows.push(
            <div
                key={"row" + j}
                className="board-row"
                children={sq}
            />
        );
    }

    return (
        <div
            children={rows}
        />
    );
}

interface IGameState {
    history: Array<IBoardState>;
    stepNumber: number;
    xIsNext: boolean;
}

export function Game() {
    const [ghistory, setHistory] = useState([{
        squares: Array(9).fill(null),
        xIsNext: true,
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    //const [myRef, dummy] = useState({current: 0});
    const myRef = useRef(0);

    function handleClick(i: number): void {
        const history = ghistory.slice(0, stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(history.concat([{
            squares: squares,
            xIsNext: !xIsNext,
        }]));
        setStepNumber(history.length);
        setXIsNext(!xIsNext);
    }

    function jumpTo(step: number): void {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }

    console.log(myRef.current);
    myRef.current++;

    const current = ghistory[stepNumber];
    const winner = calculateWinner(current.squares);
    const squaresSel = Array(9).fill(false);

    const moves = ghistory.map((step: IBoardState, move: number) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move} style={{ fontWeight: move === stepNumber ? 'bold' : 'normal'}}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status: string;
    if (winner) {
        status = 'Winner: ' + winner[0];
        squaresSel[winner[1]] = squaresSel[winner[2]] = squaresSel[winner[3]] = true;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squaresSel={squaresSel}
                    squares={current.squares}
                    onClick={(i: number) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares: Array<string>): [string, number, number, number] | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], a, b, c];
      }
    }
    return null;
  }