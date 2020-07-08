var turn = "X";
/*  
    [0, 1, 2]
    [3, 4, 5]
    [6, 7, 8]
*/
const WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];


console.log("js loaded");

//select all cells
const allCells = document.querySelectorAll("div.cell");


allCells.forEach(cell => {
    //when the cell is clicked, call handleClick
    cell.addEventListener("click", handleClick, {once: true});
})  

function handleClick(e) {
    console.log("clicekd");
    appendPlayer(e);
    if (checkWin()) {
        console.log("player " + turn + " won!");
    };
    turn = (turn == "X") ? "O" : "X";
}

function appendPlayer(e) {
    var cellClicked = e.target;
    var append = document.createTextNode(turn);
    cellClicked.childNodes[0].appendChild(append);
    
}

function checkWin() {
    //.some iterates through array seeing if one matches
    return WINNING_PATTERNS.some(cells => {
        return cells.every(index => {
            return allCells[index].contains(turn);
        })
    })
}
