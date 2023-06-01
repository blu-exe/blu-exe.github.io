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
const maxNumOp2 = 24;
const maxPlayerWinNum = 50;
const maxNumInPlay = 50;
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
function resetState() {
    state = {
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
}
let strToOpStr = {
    'add': '+',
    'sub': '−',
    'mul': '×',
    'div': '÷'
}





// Setup event listeners
$(".playerATable").click((e) => {
    console.log("A");
    console.log(state);
    if (!state.playerATurn) {return;}
    if (state.winState) {return;}
    if (e.target.id) {
        state.opSelectA = e.target.id; 
    }
    update();
});
$(".playerBTable").click((e) => {
    console.log("B");
    console.log(state);
    if (state.playerATurn) {return;}
    if (state.winState) {return;}
    if (e.target.id) {
        state.opSelectB = e.target.id; 
    }
    update();
});
$("#resetButton").click(() => { 
    $("#resetButton").hide();
    resetState();
    funcGameStart();
    guiGameStart();
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
}





// Game inits
function getRandomInt(min, max) {
    return Math.floor(Math.abs( (Math.random() - Math.random()) * (max - min) )) + min;

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
let confirmClicked = false;
$('#confirm').click(() => {
    if (!confirmClicked) {
        state.playerAWinNum = parseInt($("#winNumInput").val());
        $(".overlay").css({
            "transform": "scaleX(-1)"
        }) 
    } else {
        state.playerBWinNum = parseInt($("#winNumInput").val());
    }
    console.log(state);
    confirmClicked = true;
});
// async function guiRoundStart() {
//     // make DOM overlay
//     $('<div/>')
//         .css({position: absolute,
//               top: 0,
//               width: 100,
//               height: 100 
//         })
//         .addClass("overlay")
//         .append("<span/>")
//         .text("Enter your target number:")
//         .append("<button/>")
//     ;
//     // await number entry player A
//     // state.playerAWinNum = await 

//     // swap overlay

//     // await number entry player B

//     // return promise
// }



// Win helpers
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
async function animateWin(str) {
    $("#table1").each(function() {
        $("#table1").children().hide(); 
    });
    $("#equals").data(str);
    $("#equals").show();
    $("#resetButton").show();
}
async function checkForWin() {
    // process damage
    if (state.result == state.playerAWinNum) {
        state.winState = true;
        const result = await resolveAWin();
        console.log(result);
    } else if (state.result == state.playerBWinNum) {
        state.winState = true;
        const result = await resolveBWin();
        console.log(result);
    } else {
        return;
    }

    // if game over, celebrate win
    if (hBarA.data('value') <= 0) {
        // display win
        animateWin("Player B wins!");
        // reset winState
        state.winState = false;
        return;
    } else if (hBarB.data('value') <= 0) {
        animateWin("Player A wins!");
        state.winState = false;
        return;
    }

    // if round over, select new nums
    $('#winModal').modal("show");
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
        "fontSize": "12vw",
        "text-align": "center",
        "transform": "rotate(-90deg)",
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
function deactivateInvalidOps() {
    let mul, add, sub, div;
    if (state.playerATurn) {
        mul = $(".mulA"),
        add = $(".addA"),
        sub = $(".subA"),
        div = $(".divA");
    } else {
        mul = $(".mulB"),
        add = $(".addB"),
        sub = $(".subB"),
        div = $(".divB");
    }
    add.show();
    mul.show();
    sub.show();
    div.show();
    console.log(op(state.operand1, state.operand2, "add"), op(state.operand1, state.operand2, "mul"), op(state.operand1, state.operand2, "div"), op(state.operand1, state.operand2, "sub"));
    let addRes = op(state.operand1, state.operand2, "add");
    let subRes = op(state.operand1, state.operand2, "sub");
    let mulRes = op(state.operand1, state.operand2, "mul");
    let divRes = op(state.operand1, state.operand2, "div");

    if (addRes > maxNumInPlay && addRes > 0) {
        add.hide();
    } 
    if (mulRes > maxNumInPlay && mulRes > 0) {
        mul.hide();
    } 
    // if (divRes > maxNumInPlay && divRes > 0) {
    //     div.hide();
    // } 
    if (subRes > maxNumInPlay && subRes < 0) {
        sub.hide();
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

    setTurnIndicator();
}


// sin city waasnt made for u


// Per-turn update
function update() {
    let oldstate = state;
    updateVars(state);
    animateUpdate(oldstate, state);
    state.playerATurn = !state.playerATurn;
    deactivateInvalidOps();
    state.turnNum++;
}





// Main
$(document).ready(() => {
    $("#resetButton").hide();
    // initMainMenu();
    funcGameStart();
    guiGameStart();
});
