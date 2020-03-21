import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={"square" + (props.isCurrent ? " cell-current" : "") + (props.isWin ? " cell-win" : "")}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                isCurrent={i === this.props.lastMove}
                isWin={isWinnerCell(i, this.props.winLine)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquareRow(i) {
        let res = [];
        for (let j=0; j<3; j++) {
            res.push(this.renderSquare(i + j));
        }
        return (
            <div className="board-row">
                {res}
            </div>
        );
    }

    render() {
        let rows = [];
        for (let i=0; i<3; i++) {
            rows.push(this.renderSquareRow(i*3));
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: {row: null, col: null}
            }],
            historyOrder: 'a',
            stepNumber: 0,
            xIsNext: true
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Выиграл ' + winner.winner;
        } else {
            if (this.state.stepNumber === 9) {
                status = 'Ничья!!!';
            } else {
                status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Перейти к ходу #' + move + ' (' + step.lastMove.col + ', ' + step.lastMove.row  + ')':
                'К началу игры';
            return (
                <li key={move} className="move-item">
                    <button
                        className={move === this.state.stepNumber ? "current-move" : "move"}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        if (this.state.historyOrder !== 'a') {
            moves.reverse();
        }

        const movies_order = (
            <button
                className="button-sort"
                onClick={() => this.changeSortOrder()}
            >
                {this.state.historyOrder === 'a' ? 'По возрастанию' : 'По убыванию'}
            </button>
        );

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        lastMove={(current.lastMove.col - 1) + (current.lastMove.row - 1) * 3}
                        winLine={winner ? winner.line : null}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{movies_order}</div>
                    <ol reversed={this.state.historyOrder !== 'a'}>{moves}</ol>
                </div>
            </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const lastMove = {row: Math.floor(i / 3) + 1, col: i % 3 + 1};
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: lastMove
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    changeSortOrder() {
        this.setState({
            historyOrder: this.state.historyOrder === 'a' ? 'd' : 'a'
        });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) === 0,
        });
    }
}

function isWinnerCell(i, winLine) {
    return winLine ? winLine.includes(i) : false;
}

function calculateWinner(squares) {
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
            return {winner: squares[a], line: lines[i]};
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
