import React from "react";


const Board = () => {

    let arr = Array(5).fill(0).map(() => new Array(5).fill("E"));

    arr[1][0] = 21;
    arr[2][4] = 21;
    arr[1][3] = 15;
    arr[3][2] = 15;

    // let initialKeiPos1 = arr[1][0];
    // let initialKeiPos2 = arr[2][4];
    // let initialYenPos1 = arr[1][3];
    // let initialYenPos2 = arr[3][2];

    // function checkKeiPos(row, col){
    //     if((row == 0 && col == 0) || (row == 0 && col == 4) || (row == 4 && col == 0) || (row == 4 && col == 4)){

    //     }
    // }

    return (
        <div>
            {arr.map(items => {
                return (
                    <div>
                        {items.map(subItems => {
                            return <button> {subItems} </button>;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Board;
