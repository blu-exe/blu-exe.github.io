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

function checkBlank(cell) {
    console.log("checking " + cell + " value is " + cell.innerHTML);
    return cell.childNodes[0].innerHTML !== "";
}

function handleClick(e) {
    appendPlayer(e);
    if (checkWin()) {
        $(".winner-text").text("player " + turn + " won!");
        $(".winner-title").text("YOU ARE WINOR");
        $(".modal").modal("show");
        reset();
    } else if (Array.from(allCells).every(checkBlank)) {
        $(".winner-text").text("n o  o n e  w o n  !");
        $(".winner-title").text("ttttiee");
        $(".modal").modal("show");
        reset();
    }
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
            return allCells[index].childNodes[0].textContent == turn;
        })
    })
}

function reset() {
    console.log("reset run");
    allCells.forEach(cell => {
        cell.childNodes[0].innerHTML = "";
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, {once: true});
    })
}