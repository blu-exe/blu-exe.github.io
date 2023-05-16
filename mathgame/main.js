// consts
let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

let heightOffset = viewportHeight / 7;
let widthOffset = viewportWidth / 7;

const winNum = document.getElementsByClassName("winNum");
const operand1 = document.querySelector("#operand1");
const operand2 = document.querySelector("#operand2");

// PID
const numOp2 = 5;
const maxNumOp2 = 12;
let state = {
    playerATurn: true,
    turnNum: 1,
    opSelectA: "add",
    opSelectB: "add",
    
    operation: "add",
    operand1: 1,
    operand2: 2,
    result: 2,

    op2List: []
}
let strToOpStr = {
    'add': '+',
    'sub': '−',
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



// Game inits
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
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

    // transforms and ops, keep at end
    for (let index = 0; index < state.op2List.length; index++) {
        console.log("appending child " + state.op2List[index]);
        let child = document.querySelector("#op2row").appendChild(document.createElement("div"));
        child.classList.add("data");
        child.classList.add("col");
        child.setAttribute("id", "operand2");
        child.innerHTML = state.op2List[index];
    }

    $(".data").css({
        "fontSize": "40pt",
        "text-align": "center",
        "transform": "rotate(-90deg)"
    });

    $("#operand1").text(state.operand1);
    $("#result").text(state.result);
    $("#operation").text(strToOpStr[state.operation]);
}
function funcGameStart() {
    for (let index = 0; index < numOp2; index++) {
        state.op2List[index] = getRandomInt(1, maxNumOp2);
    }

    state.operand1 = 1;
    state.operand2 = state.op2List[2];
    state.result = op(state.operand1, state.operand2, state.operation);
}



// Per-turn update helpers
function op(r1, r2, op) {
    console.log ("op(" + r1 + " " + op + " " + r2 + ")");
    if (op === "add") {
        return r1 + r2;
    } else if (op === "sub") {
        return r1 - r2;
    } else if (op === "mul") {
        return r1 * r2;
    } else if (op === "div") {
        return Math.floor(r1 / r2);
    }
    throw new Error(`op() with invalid op ${op}`);
}
function setTurnIndicator() {
    if (state.playerATurn) {
        if (state.turnNum > 2) {
            $(".bg").removeClass("bg-reverse-animate");
        }
        $(".bg").addClass("bg-animate");
    } else {
        if (state.turnNum > 2) {
            $(".bg").removeClass("bg-animate");
        }
        $(".bg").addClass("bg-reverse-animate");
    }
}
function updateVars(s) {
    if (s.playerATurn) {
        s.operation = s.opSelectA;
    } else {
        s.operation = s.opSelectB;
    }
}
function animateUpdate (olds, s) {
    $("#operation").text(strToOpStr[s.operation]);
    $("#result").text(op(s.operand1, s.operand2, s.operation));
}



// Per-turn update
function update() {
    let oldstate = state;
    updateVars(state);
    animateUpdate(oldstate, state);
    setTurnIndicator();
    state.playerATurn = !state.playerATurn;
    state.turnNum++;
}



// Main
$(document).ready(() => {
    funcGameStart();
    guiGameStart();
});
