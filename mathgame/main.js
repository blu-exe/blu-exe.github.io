let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

let heightOffset = viewportHeight / 7;
let widthOffset = viewportWidth / 7;

const winNum = document.getElementsByClassName("winNum");
const operand1 = document.querySelector("#operand1");
const operand2 = document.querySelector("#operand2");

let state = {
    playerATurn: true,
    operand1: 1,
    operand2: 2,
    result: 2,
    opSelectA: undefined,
    opSelectB: undefined
}


let strToOpStr = {
    'add': '+',
    'sub': '-',
    'mul': '×',
    'div': '÷'
}

// Setup event listeners
$(".playerATable").click((e) => {
    if (!state.playerATurn) {return;}
    if (e.target.id) {
        state.opSelectA = e.target.id; 
        console.log(state);
    }
    update();
});
$(".playerBTable").click((e) => {
    if (state.playerATurn) {return;}
    if (e.target.id) {
        state.opSelectB = e.target.id; 
        console.log(state);
    }
    update();
});


// Per-turn updates
function setTurnIndicator() {
    if (state.playerATurn) {
        $(".bg").css("background", "linear-gradient(0deg, rgba(91,142,224,0.578890931372549) 0%, rgba(255,255,255,0) 15%)");
    } else {
        $(".bg").css("background", "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 85%, rgba(212,67,67,0.58) 100%)");
    }
}
function op(r1, r2, op) {
    if (op === "add") {
        return r1 + r2;
    } else if (op === "sub") {
        return r1 - r2;
    } else if (op === "mul") {
        return r1 * r2;
    } else if (op === "div") {
        return r1 / r2;
    }
    throw new Error(`op() with invalid op ${op}`);
}

function update() {
    if (state.playerATurn) {
        $("#operation").text(strToOpStr[state.opSelectA]);
        $("#result").text(op(state.operand1, state.operand2, state.opSelectA));

    } else {
        $("#operation").text(strToOpStr[state.opSelectB]);
        $("#result").text(op(state.operand1, state.operand2, state.opSelectB));

    }
    setTurnIndicator();
    state.playerATurn = !state.playerATurn;
}


// Game inits
function guiGameStart() {
    for (var i = 0; i < winNum.length; ++i) {
        winNum[i].style.fontSize = "24pt";
        winNum[i].style.border = "thick solid black";
        winNum[i].style.width = "60px";
        winNum[i].style.height = "60px";
        winNum[i].style.textAlign = "center";
    }

    $("#playerAWinNum").css({
        top: 0,
        right: 0
    });
    $(".playerATable").css({
        top: 0,
        left: 0,
        "width": (viewportWidth - 90) + "px"
    });

    $("#playerBWinNum").css({
        bottom: 0,
        left: 0
    });
    $(".playerBTable").css({
        bottom: 0,
        right: 0,
        "width": (viewportWidth - 90) + "px"
    });

    $(".data").css({
        "fontSize": "40pt",
        "transform": "rotate(-90deg)"
    });

    $("#operand1").text(state.operand1);
    $("#operand2").text(state.operand2);
}


$(document).ready(() => {
    guiGameStart();
    // initAnimation();
});
