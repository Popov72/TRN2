import * as React from "react";

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

class Board extends React.Component<IBoardProps, IBoardState> {

    renderSquare(i: number) {
        return (
            <Square
                key={"square" + i}
                selected={this.props.squaresSel[i]}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        for (let j = 0; j < 3; ++j) {
            let sq = [];
            for (let i = 0; i < 3; ++i) {
                sq.push(this.renderSquare(j * 3 + i));
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
}

interface IGameState {
    history: Array<IBoardState>;
    stepNumber: number;
    xIsNext: boolean;
}

export class Game extends React.Component<{}, IGameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i: number): void {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                xIsNext: !this.state.xIsNext,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step: number): void {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const squaresSel = Array(9).fill(false);

        const moves = history.map((step: IBoardState, move: number) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move} style={{ fontWeight: move === this.state.stepNumber ? 'bold' : 'normal'}}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status: string;
        if (winner) {
            status = 'Winner: ' + winner[0];
            squaresSel[winner[1]] = squaresSel[winner[2]] = squaresSel[winner[3]] = true;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squaresSel={squaresSel}
                        squares={current.squares}
                        onClick={(i: number) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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