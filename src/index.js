import { waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Returns a  clickable square
function Square(props) {
  return (
    <button className={"square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {

    // Renders a  clickable square
    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          />
      );
    }
    
    // Renders the tic tac toe board
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
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
          location: null
        }],
        stepNumber: 0,
        xIsNext: true,
        selectedMove: null,
      };
    }

    // game handles the square that was clicked and updates its value
    handleClick(i){

      const locations = [
        [1,1],
        [2,1],
        [3,1],
        [1,2],
        [2,2],
        [3,2],
        [1,3],
        [2,3],
        [3,3]
      ];

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
          location: locations[i]
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        selectedMove: step,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move # ' + move + ' @ ' + history[move].location :
          'Go to game start';
        return (
          <li key={move}>
            <button className={move === this.state.selectedMove ? 'selectedMove' : 'button'} 
              onClick={() => this.jumpTo(move)}>{desc}
            </button>
          </li>
        );
      });

      // game renders the game status
      let status;
      if(winner){
        status = 'Winner: ' + winner;
      } else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      // game returns the structure of tic tac toe
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
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
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {

    // winning lines
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];

    for (let i=0; i<lines.length; i++){
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }