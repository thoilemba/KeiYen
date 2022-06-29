import React, { useState, useRef, useEffect } from "react";
import './Board.css';

const storeMiddlematrix = new Array(5).fill(0)
    .map(() => new Array(5).fill(0).map(() => new Array(2).fill(0)));

console.log(storeMiddlematrix);

const Kei = (props) => {
    return <span style={{ color: "Red" }}>{props.children}</span>
}
const Yen = (props) => {
    return <span style={{ color: "Green" }}>{props.children}</span>
}
const Square = (props) => {
    let posItem = "";
    if (props.value / 10 > 1) {
        posItem = <Kei>{props.value % 10}</Kei>
    }
    if (props.value / 20 > 1) {
        posItem = <Yen>{props.value % 20}</Yen>
    }
    const buttonRef = useRef(null);
    useEffect(() => {
        props.myRefreshMiddlePoint(buttonRef.current.getBoundingClientRect());
    });
    return (
        <button className="square" ref={buttonRef} onClick={() => props.myClick()}>
            {posItem}
        </button>
    );
}
const KeiYenBoard = () => {
    const matrix = new Array(5).fill(0).map(() => new Array(5).fill(0));
    //Fill initial Position
    matrix[0][0] = 25
    matrix[1][0] = 11
    const [gridStatus, setGridStatus] = useState(matrix)
    var InitialRow, InitialColumn, FinalRow, FinalColumn;


    // const [middlePoints, setMiddlePoints] = useState(storeMiddlematrix);

    function ConvertCoordinatesToPosition(row, column) {
        var ConversionMap = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1],
        [2, 2], [2, 3], [2, 4], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]];

        for (let i = 0; i < ConversionMap.length; i++) {
            let conRow = ConversionMap[i][0];
            let conColumn = ConversionMap[i][1];
            if (row === conRow && column === conColumn) {
                return i;
            }
        }
    }

    function checkValidPath(startRow, startColumn, endRow, endColumn) {
        let start = ConvertCoordinatesToPosition(startRow, startColumn);
        let end = ConvertCoordinatesToPosition(endRow, endColumn);
        //Not allow to move .
        var move = [[1, 5], [5, 1], [1, 7], [7, 1], [7, 3], [3, 7], [3, 9], [9, 3], [5, 11], [11, 5], [11, 7], [7, 11], [7, 13], [13, 7], [13, 9],
        [9, 13], [11, 15], [15, 11], [11, 17], [17, 11], [17, 13], [13, 17], [13, 19], [19, 13], [15, 21], [21, 15], [21, 17],
        [17, 21], [17, 23], [23, 17], [23, 19], [19, 23]]
        for (let i = 0; i < move.length; i++) {
            let Initial = move[i][0];
            let Final = move[i][1];
            if (start === Initial && end === Final) {
                return false;
            }
        }
        return true;
    }

    function checkMoveFeasibility() {
        // moving  in the same row
        if (FinalRow === InitialRow && Math.abs(FinalColumn - InitialColumn) === 1 && matrix[FinalRow][FinalColumn] === 0) {
            //Ok to move
            alert("Ok");
            if (gridStatus[InitialRow][InitialColumn] !== 0) {
                const myMatrix = gridStatus.slice();
                myMatrix[FinalRow][FinalColumn] = myMatrix[InitialRow][InitialColumn];
                myMatrix[InitialRow][InitialColumn] = 0;
                setGridStatus(myMatrix);
            }
        }
        // moving in the same column
        else if (FinalColumn === InitialColumn && Math.abs(FinalRow - InitialRow) === 1 && matrix[FinalRow][FinalColumn] === 0) {
            //Ok to move
            alert("Ok");
            if (gridStatus[InitialRow][InitialColumn] !== 0) {
                const myMatrix = gridStatus.slice();
                myMatrix[FinalRow][FinalColumn] = myMatrix[InitialRow][InitialColumn];
                myMatrix[InitialRow][InitialColumn] = 0;
                setGridStatus(myMatrix);
            }
        }

        else {
            let ret = checkValidPath(
                InitialRow,
                InitialColumn,
                FinalRow,
                FinalColumn
            );
            if (ret === true && Math.abs(FinalRow - InitialRow) === 1 && Math.abs(FinalColumn - InitialColumn) === 1 && matrix[FinalColumn][FinalRow] === 0) {
                alert("Ok");
                if (gridStatus[InitialRow][InitialColumn] !== 0) {
                    const myMatrix = gridStatus.slice();
                    myMatrix[FinalRow][FinalColumn] = myMatrix[InitialRow][InitialColumn];
                    myMatrix[InitialRow][InitialColumn] = 0;
                    setGridStatus(myMatrix);
                }
            } else {
                alert("Not Ok");
            }
        }

    }

    const DisplayRow = ({ rowitems, rowIndex }) => {
        function handleClick(row, column) {
            InitialRow = FinalRow;
            InitialColumn = FinalColumn;
            FinalRow = row;
            FinalColumn = column;
            checkMoveFeasibility();
        }

        function handleMiddlePointCal(rect, row, column) {
            InitialRow = FinalRow;
            InitialColumn = FinalColumn;
            FinalRow = row;
            FinalColumn = column;
            // console.log(row, column);
            // const myMiddleMatrix = middlePoints.slice();
            let x = Math.floor((rect.x + rect.x + rect.width) / 2);
            let y = Math.floor((rect.y + rect.y + rect.height) / 2);
            storeMiddlematrix[row][column][0] = x;
            storeMiddlematrix[row][column][1] = y;

        }

        return (
            <div>
                {rowitems.map((item, columnIndex) => <Square value={item} myRefreshMiddlePoint={(rect) => handleMiddlePointCal(rect, rowIndex, columnIndex)
                }
                    myClick={() => handleClick(rowIndex, columnIndex)} ></Square>)}
            </div>)
    }

    const [shouldRender, setRender]  = useState(false);
    useEffect(() => {
        setRender(true);
    },[]);
    return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
      <div style={{position: "absolute"}}>
        {gridStatus.map((row, rowIndex) => (
            <DisplayRow  rowIndex={rowIndex} rowitems={row} />
        ))}
      </div>
        <svg style={{height:"100vh",width: "100vw"}}>
        {/* <line stroke-width="1px" stroke="#000000"  x1="205" y1="77" x2="821" y2="693" id="mySVG"/> */}
        //ROW LINE
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][0][0]} y1={storeMiddlematrix[0][0][1]} x2={storeMiddlematrix[0][1][0]} y2={storeMiddlematrix[0][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][1][0]} y1={storeMiddlematrix[0][1][1]} x2={storeMiddlematrix[0][2][0]} y2={storeMiddlematrix[0][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][2][0]} y1={storeMiddlematrix[0][2][1]} x2={storeMiddlematrix[0][3][0]} y2={storeMiddlematrix[0][3][1]} id="mySVG"/>
         <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][3][0]} y1={storeMiddlematrix[0][3][1]} x2={storeMiddlematrix[0][4][0]} y2={storeMiddlematrix[0][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][0][0]} y1={storeMiddlematrix[1][0][1]} x2={storeMiddlematrix[1][1][0]} y2={storeMiddlematrix[1][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][1][0]} y1={storeMiddlematrix[1][1][1]} x2={storeMiddlematrix[1][2][0]} y2={storeMiddlematrix[1][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][2][0]} y1={storeMiddlematrix[1][2][1]} x2={storeMiddlematrix[1][3][0]} y2={storeMiddlematrix[1][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][3][0]} y1={storeMiddlematrix[1][3][1]} x2={storeMiddlematrix[1][4][0]} y2={storeMiddlematrix[1][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][0][0]} y1={storeMiddlematrix[2][0][1]} x2={storeMiddlematrix[2][1][0]} y2={storeMiddlematrix[2][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][1][0]} y1={storeMiddlematrix[2][1][1]} x2={storeMiddlematrix[2][2][0]} y2={storeMiddlematrix[2][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][2][0]} y1={storeMiddlematrix[2][2][1]} x2={storeMiddlematrix[2][3][0]} y2={storeMiddlematrix[2][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][3][0]} y1={storeMiddlematrix[2][3][1]} x2={storeMiddlematrix[2][4][0]} y2={storeMiddlematrix[2][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][0][0]} y1={storeMiddlematrix[3][0][1]} x2={storeMiddlematrix[3][1][0]} y2={storeMiddlematrix[3][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][1][0]} y1={storeMiddlematrix[3][1][1]} x2={storeMiddlematrix[3][2][0]} y2={storeMiddlematrix[3][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][2][0]} y1={storeMiddlematrix[3][2][1]} x2={storeMiddlematrix[3][3][0]} y2={storeMiddlematrix[3][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][3][0]} y1={storeMiddlematrix[3][3][1]} x2={storeMiddlematrix[3][4][0]} y2={storeMiddlematrix[3][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[4][0][0]} y1={storeMiddlematrix[4][0][1]} x2={storeMiddlematrix[4][1][0]} y2={storeMiddlematrix[4][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[4][1][0]} y1={storeMiddlematrix[4][1][1]} x2={storeMiddlematrix[4][2][0]} y2={storeMiddlematrix[4][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[4][2][0]} y1={storeMiddlematrix[4][2][1]} x2={storeMiddlematrix[4][3][0]} y2={storeMiddlematrix[4][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[4][3][0]} y1={storeMiddlematrix[4][3][1]} x2={storeMiddlematrix[4][4][0]} y2={storeMiddlematrix[4][4][1]} id="mySVG"/>
        //COLUMN LINE
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][0][0]} y1={storeMiddlematrix[0][0][1]} x2={storeMiddlematrix[1][0][0]} y2={storeMiddlematrix[1][0][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][0][0]} y1={storeMiddlematrix[1][0][1]} x2={storeMiddlematrix[2][0][0]} y2={storeMiddlematrix[2][0][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][0][0]} y1={storeMiddlematrix[2][0][1]} x2={storeMiddlematrix[3][0][0]} y2={storeMiddlematrix[3][0][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][0][0]} y1={storeMiddlematrix[3][0][1]} x2={storeMiddlematrix[4][0][0]} y2={storeMiddlematrix[4][0][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][1][0]} y1={storeMiddlematrix[0][1][1]} x2={storeMiddlematrix[1][1][0]} y2={storeMiddlematrix[1][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][1][0]} y1={storeMiddlematrix[1][1][1]} x2={storeMiddlematrix[2][1][0]} y2={storeMiddlematrix[2][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][1][0]} y1={storeMiddlematrix[2][1][1]} x2={storeMiddlematrix[3][1][0]} y2={storeMiddlematrix[3][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][1][0]} y1={storeMiddlematrix[3][1][1]} x2={storeMiddlematrix[4][1][0]} y2={storeMiddlematrix[4][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][2][0]} y1={storeMiddlematrix[0][2][1]} x2={storeMiddlematrix[1][2][0]} y2={storeMiddlematrix[1][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][2][0]} y1={storeMiddlematrix[1][2][1]} x2={storeMiddlematrix[2][2][0]} y2={storeMiddlematrix[2][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][2][0]} y1={storeMiddlematrix[2][2][1]} x2={storeMiddlematrix[3][2][0]} y2={storeMiddlematrix[3][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][2][0]} y1={storeMiddlematrix[3][2][1]} x2={storeMiddlematrix[4][2][0]} y2={storeMiddlematrix[4][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][3][0]} y1={storeMiddlematrix[0][3][1]} x2={storeMiddlematrix[1][3][0]} y2={storeMiddlematrix[1][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][3][0]} y1={storeMiddlematrix[1][3][1]} x2={storeMiddlematrix[2][3][0]} y2={storeMiddlematrix[2][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][3][0]} y1={storeMiddlematrix[2][3][1]} x2={storeMiddlematrix[3][3][0]} y2={storeMiddlematrix[3][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][3][0]} y1={storeMiddlematrix[3][3][1]} x2={storeMiddlematrix[4][3][0]} y2={storeMiddlematrix[4][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][4][0]} y1={storeMiddlematrix[0][4][1]} x2={storeMiddlematrix[1][4][0]} y2={storeMiddlematrix[1][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][4][0]} y1={storeMiddlematrix[1][4][1]} x2={storeMiddlematrix[2][4][0]} y2={storeMiddlematrix[2][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][4][0]} y1={storeMiddlematrix[2][4][1]} x2={storeMiddlematrix[3][4][0]} y2={storeMiddlematrix[3][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][4][0]} y1={storeMiddlematrix[3][4][1]} x2={storeMiddlematrix[4][4][0]} y2={storeMiddlematrix[4][4][1]} id="mySVG"/>
        //DIAGONAL  LINES left to right
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][0][0]} y1={storeMiddlematrix[0][0][1]} x2={storeMiddlematrix[1][1][0]} y2={storeMiddlematrix[1][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][1][0]} y1={storeMiddlematrix[1][1][1]} x2={storeMiddlematrix[2][2][0]} y2={storeMiddlematrix[2][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][2][0]} y1={storeMiddlematrix[2][2][1]} x2={storeMiddlematrix[3][3][0]} y2={storeMiddlematrix[3][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][3][0]} y1={storeMiddlematrix[3][3][1]} x2={storeMiddlematrix[4][4][0]} y2={storeMiddlematrix[4][4][1]} id="mySVG"/>
        //DIAGONAL  LINES right to left
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][4][0]} y1={storeMiddlematrix[0][4][1]} x2={storeMiddlematrix[1][3][0]} y2={storeMiddlematrix[1][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][3][0]} y1={storeMiddlematrix[1][3][1]} x2={storeMiddlematrix[2][2][0]} y2={storeMiddlematrix[2][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][2][0]} y1={storeMiddlematrix[2][2][1]} x2={storeMiddlematrix[3][1][0]} y2={storeMiddlematrix[3][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][1][0]} y1={storeMiddlematrix[3][1][1]} x2={storeMiddlematrix[4][0][0]} y2={storeMiddlematrix[4][0][1]} id="mySVG"/>
        //SQUARE LINE
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[0][2][0]} y1={storeMiddlematrix[0][2][1]} x2={storeMiddlematrix[1][1][0]} y2={storeMiddlematrix[1][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][1][0]} y1={storeMiddlematrix[1][1][1]} x2={storeMiddlematrix[2][0][0]} y2={storeMiddlematrix[2][0][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][0][0]} y1={storeMiddlematrix[2][0][1]} x2={storeMiddlematrix[3][1][0]} y2={storeMiddlematrix[3][1][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][1][0]} y1={storeMiddlematrix[3][1][1]} x2={storeMiddlematrix[4][2][0]} y2={storeMiddlematrix[4][2][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[4][2][0]} y1={storeMiddlematrix[4][2][1]} x2={storeMiddlematrix[3][3][0]} y2={storeMiddlematrix[3][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[3][3][0]} y1={storeMiddlematrix[3][3][1]} x2={storeMiddlematrix[2][4][0]} y2={storeMiddlematrix[2][4][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[2][4][0]} y1={storeMiddlematrix[2][4][1]} x2={storeMiddlematrix[1][3][0]} y2={storeMiddlematrix[1][3][1]} id="mySVG"/>
        <line stroke-width="1px" stroke="#000000"  x1={storeMiddlematrix[1][3][0]} y1={storeMiddlematrix[1][3][1]} x2={storeMiddlematrix[0][2][0]} y2={storeMiddlematrix[0][2][1]} id="mySVG"/>
        {/* <line stroke-width="1px" stroke="#000000"  x1="821" y1="77" x2="205" y2="693" id="mySVG"/> */}
        </svg>
    </div>)
}
export default KeiYenBoard; 