let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

let heightOffset = viewportHeight / 6;
let widthOffset = viewportWidth / 6;

const winNum = document.getElementsByClassName("winNum");
const operand1 = document.querySelector("#operand1");
const operand2 = document.querySelector("#operand2");

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

    $("#playerBWinNum").css({
        bottom: 0,
        left: 0
    });

    operand1.style.bottom = heightOffset + "px";
    operand2.style.top = heightOffset + "px";
    $(".operand").css({
        "display": "flex",
        "justify-content": "center",
        "transform": "rotate(-90deg)",
        "fontSize": "48pt"
    });
}

$(document).ready(()=>{
    guiGameStart();
});