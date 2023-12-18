//global consts
const invisibleCharacter = "‎";
const plusChar = "＋";
const minusChar = "－";
const multChar = "×";
const divChar = "÷";
const opBindings = {"＋":"+", "－":"-", "×":"*", "÷":"/", "=": "=", "‎": " "};
const opBindingsSwapped = {'+': '＋','-': '－','*': '×','/': '÷','=': '=', " ": "‎"};
const numTokens = 12;


//global vars
let rowCounter = 0;
let currentFocusBox = undefined;
let curLockedBoxes = [];
let curSoln = "";
let curNumBoxes = undefined;
let tokensRemaining = 12;


//LOGIC HELPERS
function convertInverse(str) {
    let res = "";
    for (let i in str) {
        if (isNaN(str[i]) && !Number.isInteger(parseInt(str[i]))) {
            // console.log("read " + str[i], " appending " + opBindings[str[i]]);
            res += opBindingsSwapped[str[i]];
        } else {
            // console.log("read " + str[i], " appending " + str[i]);
            res += str[i];
        }
    }
    // console.log("converted to " + res);
    return res;
}
function convert(str) {
    let res = "";
    for (let i in str) {
        if (isNaN(str[i]) && !Number.isInteger(parseInt(str[i]))) {
            res += opBindings[str[i]];
        } else {
            res += str[i];
        }
    }
    return res;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);   // Round up the minimum value
    max = Math.floor(max);  // Round down the maximum value
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateSoln(totalLength) {
    const operators = ['+', '-', '*', '/'];
    let equation = '';
    let result = 0;

    // Determine the maximum length for the equation (leaving space for the result)
    const maxEquationLength = totalLength - 3;

    // Generate random numbers and operators to form a valid equation
    while (equation.length < maxEquationLength) {
        if (equation.length > 0 && Math.random() < 0.5) {
            // Insert an operator randomly after the first character
            equation += operators[Math.floor(Math.random() * operators.length)];
        }

        // Generate random numbers for each position
        equation += Math.floor(Math.random() * 9) + 1;
    }

    // Evaluate the generated equation to get the result
    try {
        result = eval(equation); // Evaluate the equation string
    } catch (error) {
        // If an error occurs during evaluation, generate a new equation
        return generateSoln(totalLength);
    }

    // Convert the result to a string
    const resultString = '=' + result.toString();

    // Calculate the remaining space for padding
    const paddingLength = totalLength - equation.length - resultString.length;

    // Check if the result is a finite number and an integer
    if (isFinite(result) && Number.isInteger(result) && paddingLength >= 0) {
        // Add padding to the equation to reach the desired length
        equation += ' '.repeat(paddingLength);
        return equation + resultString;
    } else {
        // If the result is not an integer or not finite, generate a new equation
        return generateSoln(totalLength);
    }
}

//UI HELPERS
function currentFocusCol() {
    return currentFocusBox == undefined ? undefined : Number(currentFocusBox.charAt(currentFocusBox.length - 1));
}
function isLocked(col) {
    for (let i in curLockedBoxes) {
        if (curLockedBoxes[i] === col) {
            return true;
        }
    }
    return false;
}
function createBoxes(numBoxes) {
    let newRow = $(".full-screen").append(`<div class="columns is-mobile is-centered new-cols shakeDiv">`);
    for (let i = 0; i < numBoxes; i++) {
        $(".new-cols").append(`
            <div class="column digit-box" id="${rowCounter}-${i}" style="height:${window.innerHeight / 9}">${invisibleCharacter}
            </div>
        `);
    }
    $(".new-cols").addClass(`row${rowCounter}`);
    rowCounter++;
    $(".new-cols").removeClass("new-cols");
}
function setupBoxes() {
    for (let i = 0; i < curSoln.length; i++) {
        if (curSoln[i] === "=") {
            $("#" + String(rowCounter - 1) + "-" + String(i)).html(opBindings["="]);
        }
    }
}
function removeTokens(num) {
    for (let i = 0; i < num; i++) {
        $("#" + (tokensRemaining - i)).hide();
    }
    tokensRemaining -= num;
}

//GUESS
function checkForValidEquation() {
    console.log("checking valid")
    let lhs = "";
    let rhs = "";
    let reachedEquals = false;
    $('.row' + String(rowCounter - 1)).children().each(function () {
        if ($(this).text() === "=") {
            reachedEquals = true;
        } else {
            if (reachedEquals) {
                rhs += $(this).text();
            } else {
                lhs += $(this).text();
            }
        }
    });
    console.log("lhs = " + lhs + ", rhs = " + rhs);
    console.log("lhs = " + eval(convert(lhs)) + ", rhs = " + eval(convert(rhs)));
    return (eval(convert(lhs)) === eval(convert(rhs)));
}
function checkForWin() {
    console.log("checking win")
    let input = "";
    $('.row' + String(rowCounter - 1)).children().each(function () {
        input += ($(this).text() === "") ? " " : $(this).text();
    });
    console.log("input = " + convert(input) + ", curSoln = " + curSoln);
    return convert(input) === curSoln;
}
function guess() {
    if (!checkForValidEquation()) {
        //if invalid, shake
        console.log("invalid eq");
        $('.shakeDiv').addClass('shake');
        setTimeout(function() {
            $('.shakeDiv').removeClass('shake');
        }, 500);
        return;
    }
    console.log("valid eq, checking for win");

    //check for win
    if (checkForWin()) {
        //if win, go next stage
        openModal();
    } else {
        //if wrong, lose token
        removeTokens(1);

        //start new row
        createBoxes(curNumBoxes);
        setupBoxes();
    }
}

//HINT
function hint() {
    if (isLocked(currentFocusCol())) {
        return;
    }

    //remove tokens
    if (tokensRemaining < 2) {
        $('.numpad-container').addClass('shake');
        setTimeout(function() {
            $('.numpad-container').removeClass('shake');
        }, 500);
        return;
    }
    removeTokens(2);

    //give hint
    document.getElementById(currentFocusBox).innerHTML = convertInverse(curSoln.charAt(currentFocusCol()));
    curLockedBoxes.shift(currentFocusCol());
}

//CLICK LISTENERS
function addToDisplay(value) {
    //insert value
    if (isLocked(currentFocusCol())) {
        return;
    }
    if (currentFocusBox != undefined && document.getElementById(currentFocusBox).innerHTML != "=") {
        document.getElementById(currentFocusBox).innerHTML = value;
    }

    //move to next digit box
    let col = currentFocusBox.charAt(currentFocusBox.length - 1);
    if (col < curNumBoxes) {
        for (let i = 0; i < rowCounter; i++) {
            for (let j = 0; j < 7; j++) {
                $("#" + i + "-" + j).css('background-color', 'transparent');
            }
        }
        currentFocusBox = currentFocusBox.charAt(0) + "-" + String(Number(col) + 1);
        $("#" + currentFocusBox).css('background-color', 'rgba(255, 165, 0, 0.25)');
    }
}
function addToDisplayOp(value) {
    if (currentFocusBox != undefined && document.getElementById(currentFocusBox).innerHTML != "=") {
        document.getElementById(currentFocusBox).innerHTML = value;
        switch (value) {
            case 1:
                document.getElementById(currentFocusBox).innerHTML = plusChar;
                break;
            case 2:
                document.getElementById(currentFocusBox).innerHTML = minusChar;
                break;
            case 3:
                document.getElementById(currentFocusBox).innerHTML = multChar;
                break;
            case 4:
                document.getElementById(currentFocusBox).innerHTML = divChar;
                break;
        }
    }

    let col = currentFocusBox.charAt(currentFocusBox.length - 1);
    if (col < curNumBoxes) {
        for (let i = 0; i < rowCounter; i++) {
            for (let j = 0; j < 7; j++) {
                $("#" + i + "-" + j).css('background-color', 'transparent');
            }
        }
        currentFocusBox = currentFocusBox.charAt(0) + "-" + String(Number(col) + 1);
        console.log(currentFocusBox);
        $("#" + currentFocusBox).css('background-color', 'rgba(255, 165, 0, 0.25)');
    }
}
function clearDisplay() {
    if (currentFocusBox != undefined) {
        $('.row' + String(rowCounter - 1)).children().each(function () {
            if ($(this).text() != "=") {
                $(this).text(invisibleCharacter);
            }
        });
    }
}
function openModal() {
    $(".winModalText").html("You won with " + numTokens + " tokens!");
    document.getElementById('winModal').classList.add('is-active');
}
function closeModal() {
    document.getElementById('winModal').classList.remove('is-active');
}
$(document).on("click", function (event) {
    //uhm for some reason I couldn't get it to click on elems other than document...
    let id = event.target.id;
    let className = event.target.className;

    //digit boxes
    if (className.includes("digit-box")) {
        //remove current highlight
        for (let i = 0; i < rowCounter; i++) {
            for (let j = 0; j < 7; j++) {
                $("#" + i + "-" + j).css('background-color', 'transparent');
            }
        }
        currentFocusBox = id;
        $("#" + id).css('background-color', 'rgba(255, 165, 0, 0.25)');
    }
});

//MAIN
$(function() {
    //setup main container bounds
    let numPadTop = $('.numpad-container').offset().top;
    console.log(numPadTop);
    $(".full-screen").css("height", numPadTop + "px");

    //generate inital boxes
    curNumBoxes = 7;
    createBoxes(curNumBoxes);
    curSoln = generateSoln(7);
    console.log("current soln: " + curSoln);
    setupBoxes();

    //put cursor on first box
    currentFocusBox = "0-0";
    $("#" + currentFocusBox).css('background-color', 'rgba(255, 165, 0, 0.25)');
});
