// import { initMainMenu } from "./mainmenu.js";

// consts
let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

let heightOffset = viewportHeight / 7;
let widthOffset = viewportWidth / 7;

const winNum = document.getElementsByClassName("winNum");
const operand1 = document.querySelector("#operand1");
const operand2 = document.querySelector("#operand2");

var hBarA = $('#hbarA'),
    barA = hBarA.find('.bar'),
    hitA = hBarA.find('.hit');
var hBarB = $('#hbarB'),
    barB = hBarB.find('.bar'),
    hitB = hBarB.find('.hit');

const invisibleCharacter = "‎";

// PID
const numOp2 = 5;
const maxNumOp2 = 10;
const maxPlayerWinNum = 50;
let state = {
    winState: false,
    playerATurn: true,
    turnNum: 1,
    opSelectA: "add",
    opSelectB: "add",
    
    operation: "add",
    operand1: 1,
    operand2: 2,
    result: undefined,
    playerAWinNum: undefined,
    playerBWinNum: undefined,

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
    console.log(state);
    if (!state.playerATurn) {return;}
    if (state.winState) {return;}
    if (e.target.id) {
        state.opSelectA = e.target.id; 
    }
    update();
});
$(".playerBTable").click((e) => {
    console.log(state);
    if (state.playerATurn) {return;}
    if (state.winState) {return;}
    if (e.target.id) {
        state.opSelectB = e.target.id; 
    }
    update();
});

function hitASuccess(HPamount){
    var total = hBarA.data('total'),
        value = hBarA.data('value');
    if (value < 0) {
        alert("U DED");
    }
    // max damage is essentially quarter of max life
    var damage = HPamount;
    var newValue = value - damage;
    // calculate the percentage of the total width
    var barWidth = (newValue / total) * 100;
    var hitWidth = (damage / value) * 100 + "%";
    
    // show hit bar and set the width
    hitA.css('width', hitWidth);
    hBarA.data('value', newValue);
    
    setTimeout(function(){
        hitA.css({'width': '0'});
        barA.css('width', barWidth + "%");
    }, 500);
    
    
    if(value < 0){
        alert("DEAD");
    }
}

function hitBSuccess(HPamount){
    var total = hBarB.data('total'),
        value = hBarB.data('value');
    // max damage is essentially quarter of max life
    var damage = HPamount;
    var newValue = value - damage;
    // calculate the percentage of the total width
    var barWidth = (newValue / total) * 100;
    var hitWidth = (damage / value) * 100 + "%";
    
    // show hit bar and set the width
    hitB.css('width', hitWidth);
    hBarB.data('value', newValue);
    
    setTimeout(function(){
        hitB.css({'width': '0'});
        barB.css('width', barWidth + "%");
    }, 500);
    
    
    if(value < 0){
        alert("DEAD");
    }
};



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

    $("#playerAWinNum").text(state.playerAWinNum);
    $("#playerBWinNum").text(state.playerBWinNum);

    // transforms and ops, keep at end
    let op2ListLen = (state.op2List.length < numOp2) ? (state.op2List.length + 1) : state.op2List.length;
    for (let index = 0; index < op2ListLen; index++) {
        console.log("appending child " + state.op2List[index]);
        let child = document.querySelector("#op2row").appendChild(document.createElement("div"));
        child.classList.add("data");
        child.classList.add("col");
        child.setAttribute("id", "operand2");
        child.innerHTML = state.op2List[index];
    }

    reformatDataID();

    $("#operand1").text(state.operand1);
    if (state.result == undefined) {
        $("#result").text(invisibleCharacter);
    } else {
        $("#result").text(state.result);
    }
    $("#operation").text(strToOpStr[state.operation]);

    // hp bar
    hBarA.data('value', hBarA.data('total'));
    hBarB.data('value', hBarB.data('total'));
    hitA.css({'width': '0'});
    barA.css('width', '100%');
    hitB.css({'width': '0'});
    barB.css('width', '100%');
    console.log("resetting health to 100");
}
function funcGameStart() {
    for (let index = 0; index < numOp2; index++) {
        state.op2List[index] = getRandomInt(1, maxNumOp2);
    }

    state.operand1 = 1;
    state.operand2 = state.op2List[Math.floor(numOp2 / 2)];

    state.playerAWinNum = getRandomInt(1, maxPlayerWinNum);
    state.playerBWinNum = getRandomInt(1, maxPlayerWinNum);
}



// Per-turn update helpers
function op(r1, r2, op) {
    // console.log ("op(" + r1 + " " + op + " " + r2 + ")");
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
function reformatDataID() {
    $(".data").css({
        "fontSize": "40pt",
        "text-align": "center",
        "transform": "rotate(-90deg)"
    });
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
function resolveAWin() {
    return new Promise(resolve => {
        hitBSuccess(state.playerAWinNum);
        setTimeout(() => {
            resolve('resolved A');
            //TODO: create modal
            window.alert("Player A (Red) wins the round!");
        }, 2000);
    });
}
function resolveBWin() {
    return new Promise(resolve => {
        hitASuccess(state.playerBWinNum);
        setTimeout(() => {
            resolve('resolved B');
            //TODO: create modal
            window.alert("Player B (Blue) wins the round!");
        }, 2000);
    });
}
async function checkForWin() {
    if (state.result == state.playerAWinNum) {
        state.winState = true;
        const result = await resolveAWin();
        console.log(result);
    } else if (state.result == state.playerBWinNum) {
        state.winState = true;
        const result = await resolveBWin();
        console.log(result);
    }
}
function updateVars(s) {
    // update selected operand
    if (s.playerATurn) {
        s.operation = s.opSelectA;
    } else {
        s.operation = s.opSelectB;
    }

    //update op2 state, making op2List length numOp2 + 1
    s.op2List.pop();
    s.op2List.unshift(getRandomInt(1, maxNumOp2));

    //result --> op1, blank --> result
    console.log(state.operand1 + " " + s.operation + " " + s.operand2);
    s.result = op(s.operand1, s.operand2, s.operation);

    // check for win
    checkForWin();

    // compute for next turn
    s.operand1 = s.result;
    s.operand2 = s.op2List[Math.floor(numOp2 / 2)];
}
function animateUpdate (olds, s) {
    // TODO: animate op2 state slide/shift, animate result moving to op1

    //animate operation change
    $("#operation").text(strToOpStr[s.operation]);

    //animate result change
    if (s.result != undefined) {
        $("#result").text(s.result);
    } else {
        $("#result").text(invisibleCharacter);
    }

    //pause, then delete result change and animate op1 change
    setTimeout(() => {
        $("#operand1").text(s.operand1);
        $("#result").text(invisibleCharacter);
        $("#op2row").empty();
        for (let index = 0; index < s.op2List.length; index++) {
            let child = document.querySelector("#op2row").appendChild(document.createElement("div"));
            child.classList.add("data");
            child.classList.add("col");
            child.setAttribute("id", "operand2");
            child.innerHTML = state.op2List[index];
        }
        reformatDataID();
    }, 2000);

    //animate op2 slide
    // setTimeout(() => {
    //     console.log("animating row2");
    //     $("#op2row").addClass("row-animate");
    //     $("#op2row").addClass("row-animate");
    // }, 2000);
    // setTimeout(() => {
    //     console.log("unanimating row2");
    //     $("#op2row").removeClass("row-animate");
    // }, 4000);

    //overlay new array

    
    //delete old row
    //animate row slide
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
    // initMainMenu();
    funcGameStart();
    guiGameStart();
});
