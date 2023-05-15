let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

let heightOffset = viewportHeight / 7;
let widthOffset = viewportWidth / 7;

const winNum = document.getElementsByClassName("winNum");
const operand1 = document.querySelector("#operand1");
const operand2 = document.querySelector("#operand2");

let state = {
    playerATurn: true,
    opSelectA: undefined,
    opSelectB: undefined
}

let strToOpStr = {
    'add': '+',
    'sub': '-',
    'mul': '×',
    'div': '÷'
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

    $(".data").css({
        "fontSize": "40pt",
        "transform": "rotate(-90deg)"
    });
}

function setupGameStart() {
    $(".playerATable").click((e) => {
        if (e.target.id) {
            state.opSelectA = e.target.id; 
            console.log(state);
        }
        update();
    });
    $(".playerBTable").click((e) => {
        if (e.target.id) {
            state.opSelectB = e.target.id; 
            console.log(state);
        }
        update();
    });
}

function update() {
    if (state.playerATurn) {
        console.log("changing");
        $("#operation").text(strToOpStr[state.opSelectA]);
    } else {
        console.log("changing");

        $("#operation").text(strToOpStr[state.opSelectB]);
    }
    state.playerATurn = !state.playerATurn;
}

$(document).ready(() => {

    guiGameStart();
    setupGameStart();
    // init();
});


// const doors = document.querySelectorAll('.door');
// const door = document.querySelector('#door');

// document.querySelector('#spinner').addEventListener('click', spin);
// document.querySelector('#reseter').addEventListener('click', init);

// function init(firstInit = true, duration = 1) {
//     for (const door of doors) {
//         if (firstInit) {
//             door.dataset.spinned = '0';
//         } else if (door.dataset.spinned === '1') {
//             return;
//         }

//         const boxes = door.querySelector('.boxes');
//         const boxesClone = boxes.cloneNode(false);
//         const pool = [
//             '×',
//             '+',
//             '-',
//             '÷'
//         ];

//         if (!firstInit) {

//             boxesClone.addEventListener(
//                 'transitionstart',
//                 function () {
//                     door.dataset.spinned = '1';
//                     this.querySelectorAll('.box').forEach((box) => {
//                         box.style.filter = 'blur(1px)';
//                     });
//                 },
//                 { once: true }
//             );

//             boxesClone.addEventListener(
//                 'transitionend',
//                 function () {
//                     this.querySelectorAll('.box').forEach((box, index) => {
//                         box.style.filter = 'blur(0)';
//                         if (index > 0) this.removeChild(box);
//                     });
//                 },
//                 { once: true }
//             );
//         }

//         for (let i = pool.length - 1; i >= 0; i--) {
//             const box = document.createElement('div');
//             box.classList.add('box');
//             box.style.width = door.clientWidth + 'px';
//             box.style.height = door.clientHeight + 'px';
//             box.textContent = pool[i];
//             boxesClone.appendChild(box);
//         }
//         boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
//         boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
//         door.replaceChild(boxesClone, boxes);
//     }
// }

// async function spin() {
//     init(false, 2);

//     for (const door of doors) {
//         const boxes = door.querySelector('.boxes');
//         // const duration = parseInt(boxes.style.transitionDuration);
//         boxes.style.transform = 'translateY(0)';
//         // await new Promise((resolve) => setTimeout(resolve, duration * 100));
//     }
// }
