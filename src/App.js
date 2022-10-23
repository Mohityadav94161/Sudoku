import { useState } from "react";
import "./app.css";

const initial = [
  [3,-1,6,5,-1,8,4,-1,-1],
  [5,2,-1,-1,-1,-1,-1,-1,-1],
  [-1,8,7,-1,-1,-1,-1,3,1],
  [-1,-1,3,-1,1,-1,-1,8,-1],
  [9,-1,-1,8,6,3,-1,-1,5],
  [-1,5,-1,-1,9,-1,6,-1,-1],
  [1,3,-1,-1,-1,-1,2,5,-1],
  [-1,-1,-1,-1,-1,-1,-1,7,4],
  [-1,-1,5,2,-1,6,3,-1,-1],
];

function App() {
  const getDeepCopy = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  };
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));
  const onInputChange = (e, row, col) => {
    var val = parseInt(e.target.value) || -1,
    grid = getDeepCopy(sudokuArr);
    //sudoku range should be only in 0-9

    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }

    setSudokuArr(grid);
  };
  // const giveInput = (e,row,col)=>{
  //   var val = parseInt(e.target.value) || -1;
  //   if (val === -1 || (val >= 1 && val <= 9)) {
  //     initial[row][col] = val;
  //   }
  //   setSudokuArr(initial);
  // }
  const rowSafe = (sudoku,row,num) =>{
     for(let i = 0 ; i<9 ; i++){
       if(sudoku[row][i] === num)return false;
     }
     return true;

  }
  const colSafe = (sudoku,col,num)=>{
    for(let i = 0 ; i<9 ; i++){
      if(sudoku[i][col] === num)return false;
    }
    return true;
  }
  const boxSafe = (sudoku,row,col,num)=>{
    let boxArr = [],
    rowStart = row - (row%3),
    colStart = col - (col%3);

    for(let i=0 ;i<3 ; i++){
      for(let j = 0 ; j< 3 ; j++){
        boxArr.push(sudoku[rowStart+i][colStart+j]);
      }
    }

    return boxArr.indexOf(num) === -1;
  }
  const isSafe = (sudoku,row,col,num)=>{
    if(rowSafe(sudoku,row,num) && colSafe(sudoku,col,num) && boxSafe(sudoku,row ,col,num)){
      return true;
    }
    return false;
  }

  const solver = (sudoku ,row = 0 ,col = 0)=>{
    if(row === 8 && col === 9){
      console.log('fi' ,sudoku);
      return true;
    }
    if(col === 9){
      row++;
      col = 0;
    }
    if(sudoku[row][col] !== -1){
      return solver(sudoku ,row,col+1);
    }

    for(let num = 1 ; num <= 9; num++){

      if(isSafe(sudoku ,row , col, num)){
          sudoku[row][col] = num;
          if(solver(sudoku ,row ,col+1 ))return true;
          
        }
        sudoku[row][col] = -1;
    }
    
    return false;
  }
  const solveSudoku = ()=>{
    console.log('fun called');
    let sudoku = getDeepCopy(initial);
    var v = solver(sudoku);
    console.log(v);
    console.log(sudoku);
    if(v === true){
      setSudokuArr(sudoku);
    }
    else{
      alert("Sudoku is invalid , hence it can't b solve");
    }
    
    
  }
  const compareSudokus = ( currentSudoku ,solveSudoku)=>{
    solver(solveSudoku);
    let res ={
      isComplete: true,
      isSolvable: true
    }
    for(var i = 0 ; i<9 ; i++){
      for(var j = 0 ; j< 9 ; j++){
        if(currentSudoku[i][j] !== solveSudoku[i][j]){
          if(currentSudoku[i][j] !== -1){
            res.isSolvable = false;
          }
          res.isComplete = false;
        }
      }
    }
    return res;
  }


  const checkSudoku = ()=>{
    let sudoku = getDeepCopy(initial);
    let compare = compareSudokus(sudokuArr,sudoku);
    if(compare.isComplete){
      alert('Congratulations!! you have solved it');

    }
    else if(compare.isSolvable){
      alert("keep going!!");
    }
    else{
      alert("Can't solvable");
    }
  }
  const resetSudoku = ()=>{
    let sudoku = getDeepCopy(initial);
    setSudokuArr(sudoku);
  }

  return (
    <div className="App">
      <div className="app-header">
        <h3>Sudoku solver</h3>
        <table>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rindex) => {
              return (
                <tr key={rindex} className={(row !== 8 && (row + 1) % 3 === 0)?'trow' : ''}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cindex) => {
                    return (
                      <td
                        key={rindex + cindex}
                        className={
                          
                          (col !== 8 && (col + 1) % 3 === 0 ? "tcol" : "")
                            ? "tcol"
                            : ""
                        }
                        
                      >
                        <input
                          onChange={(e) => onInputChange(e, row, col)}
                          value={
                            sudokuArr[row][col] === -1
                              ? ""
                              : sudokuArr[row][col]
                          }
                          className="cellInput"
                          disabled={initial[row][col] !== -1}
                        ></input>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="buttonContainer">
          <button className="solveButton" onClick={solveSudoku}>Solve</button>
          <button className="resetButton" onClick={resetSudoku}>reset</button>
          <button className="checkButton" onClick={checkSudoku}>check</button>
        </div>
      </div>
    </div> 
  );
}

export default App;
