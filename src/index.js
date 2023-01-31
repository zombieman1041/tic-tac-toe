import { waitForElementToBeRemoved } from '@testing-library/react';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Returns a  clickable square
function Square(props) {
  return (
    // If a square is part of the winning line change the classname
    <button className={"square" + (props.isWinning ? "--winning" : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {

    // Renders a clickable square with a unique identity
    renderSquare(i) {
      return (
        <Square 
          isWinning={this.props.winningSquares.includes(i)}
          key={"square" + i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          />
      );
    }

    // Renders 3 squares
    renderSquares(n){
      let squares = [];
      for(let i = n; i < n + 3; i++){
        squares.push(this.renderSquare(i));
      }
      return squares;
    }

    // Renders a row of at least 3 squares
    renderRows(i) {
      return <div className="board-row">
        {this.renderSquares(i)}
      </div>;
    }
    
    // Renders the tic tac toe board
    render() {
      return (
        <div>
          {this.renderRows(0)}
          {this.renderRows(3)}
          {this.renderRows(6)}
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
        isDecending: true
      };
    }

    // game handles the square that was clicked, checks for a winner, updates its value and whos turn it is, and stores the game state
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
          location: locations[i],
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    // Jumps to a previous move made 
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        selectedMove: step,
      });
    }

    sortHistory(){
      this.setState({
        isDecending: !this.state.isDecending
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // game renders the move list that can jump through time
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move # ' + move + ' @ ' + history[move].location :
          'Go to game start';
        return (
          <li key={move}>
            {/* bolds the current move in the list */}
            <button className={move === this.state.stepNumber ? 'selectedMove' : 'button'} 
              onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        );
      });

      // game renders the game status
      let status;
      if(winner){
        status = 'Winner: ' + (!this.state.xIsNext ? 'X!' : 'O!');
      } else if(!current.squares.includes(null)){
        status = "Draw!";
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      // game returns the structure of tic tac toe
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              winningSquares={winner ? winner.line : []}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{this.state.isDecending ? moves : moves.reverse()}</ol>
            <button onClick={() => this.sortHistory()}>
              Sort by: {this.state.isDecending ? "Descending" : "Ascending"}
            </button>
            
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
        return {player: squares[a], line: [a, b, c]};
      }
    }
    return null;
  }